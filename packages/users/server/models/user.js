'use strict';

/**
 * Module dependencies.
 */
var dolphin = require('dolphinio');
var crypto = require('crypto');
var uuid = require('node-uuid');
var chalk = require('chalk');
var Q = require('q');
var mailer = require('../../../../lib/mailer');
var _ = require('lodash');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var validateUniqueEmail = function (value, callback) {
    var User = mongoose.model('User');
    User.find({
        $and: [
            {
                email: value,
                'auditing.deleted': false
            },
            {
                _id: {
                    $ne: this._id
                }
            }
        ]
    }, function (err, user) {
        callback(err || user.length === 0);
    });
};

/**
 * User Schema
 */
var UserSchema = new Schema({
    email: {
        type: String,
        // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
        validate: [validateUniqueEmail, 'E-mail address is already in-use']
    },
    username: {
        type: String
    },
    roles: {
        type: Array,
        default: []
    },
    hashed_password: {
        type: String
    },
    provider: {
        type: String,
        default: 'local'
    },
    salt: String,
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    appVersion: {
        type: String,
        default: '1.0.0'
    },
    verified: {
        type: Boolean,
        default: false
    },
    blocked: {
        type: Boolean,
        default: false
    }
});
UserSchema.plugin(require('../../../../lib/mongo_plugins/auditing'));

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.hashPassword(password);
}).get(function () {
    return this._password;
});

/**
 * Methods
 */

/**
 * HasRole - check if the user has required role
 *
 * @param {String} plainText
 * @return {Boolean}
 * @api public
 */
UserSchema.methods.hasRole = function (role) {
    var roles = this.roles;
    return roles.indexOf(role) !== -1;
};

/**
 * Authenticate - check if the passwords are the same
 *
 * @param {String} plainText
 * @return {Boolean}
 * @api public
 */
UserSchema.methods.authenticate = function (plainText) {
    return this.hashPassword(plainText) === this.hashed_password;
};

/**
 * Make salt
 *
 * @return {String}
 * @api public
 */
UserSchema.methods.makeSalt = function (plainText) {
    return crypto.randomBytes(16).toString('base64');
};

/**
 * Hash password
 *
 * @param {String} password
 * @return {String}
 * @api public
 */
UserSchema.methods.hashPassword = function (password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
};

UserSchema.statics.createRootUser = function (username, email, password, callback) {
    var User = mongoose.model('User');
    var AccessToken = mongoose.model('AccessToken');

    User.findOne({email: email}).exec(function (err, rootUser) {
        if (rootUser) {
            return callback(null, rootUser);
        }

        rootUser = new User();
        rootUser.username = username;
        rootUser.email = email;
        rootUser.password = password;
        rootUser.roles = ['root', 'admin'];
        rootUser.verified = true;
        rootUser.save(function (err, rootUser) {
            if (err) {
                console.log('Error', err);
                return callback(err);
            }
            console.log(chalk.green('Email:'), chalk.yellow(rootUser.email));
            console.log(chalk.green('Password:'), chalk.yellow(rootUser.password));

            var row = new AccessToken();
            row.name = 'ROOTACCESS';
            row.user = rootUser._id;
            row.token = uuid.v4();
            row.blocked = false;
            row.default = true;
            row.save(function (err, row) {
                if (err) {
                    return console.log('Error', err);
                }
                console.log(chalk.green('AccessToken:'), chalk.yellow(row.token));
                console.log(chalk.green('try:'), chalk.yellow('/api/test?access_token=' + row.token));
            });
            callback(null, rootUser);
        });
    });
};

UserSchema.statics.loginInByEmail = function (email, callback) {
    var User = mongoose.model('User');
    User.findOne({email: new RegExp('^' + email + '$', 'i')}).exec(function (err, user) {
        if (user) {
            return callback(user);
        }
        callback(null);
    });
};

UserSchema.statics.registerUser = function (params) {
    var deferred = Q.defer();
    var User = mongoose.model('User');
    var AccessToken = mongoose.model('AccessToken');
    var AclRole = mongoose.model('AclRole');
    var MongoValidationError = dolphin.load('errors').getMongoalidationError();
    var CustomValidationError = dolphin.load('errors').getCustomValidationError();

    AclRole.getRegistrationRole().then(function (defaultRole) {
        if (!defaultRole) {
            return deferred.reject(new CustomValidationError('username', 'The default role was not found'));
        }

        User.loginInByEmail(params.email, function (existsUser) {
            if (!params.verified) {
                params.verified = true;
            }
            if (!params.roles) {
                params.roles = [defaultRole.role]; // from settings
            }
            var row = new User(params);
            validateUser(row, true, existsUser, params);
            row.save(function (err, row) {
                if (err) {
                    return deferred.reject(new MongoValidationError(err));
                }

                var access = {
                    name: 'Api access',
                    user: row._id,
                    blocked: false,
                    default: true
                };
                AccessToken.createAccess(access).then(function () {
                    return deferred.resolve(row);
                }).catch(function (err) {
                    row.remove();
                    return deferred.reject(err);
                });
            });
        });
    });
    return deferred.promise;
};

UserSchema.statics.createOrUpdateUser = function (params) {
    var deferred = Q.defer();
    var User = mongoose.model('User');
    var AccessToken = mongoose.model('AccessToken');
    var MongoValidationError = dolphin.load('errors').getMongoalidationError();

    User.findOne({_id: params._id}).exec(function (err, user) {
        if (!user) {
            user = new User(params);
        } else {
            _.extend(user, params);
        }
        validateUser(user, false, false, params);

        var isNewRow = user.isNew;
        if (isNewRow || params.password || params.confirmPassword) {
            validatePasswords(user, params);
        }

        user.save(function (err, user) {
            if (err) {
                return deferred.reject(new MongoValidationError(err));
            }
            if (!isNewRow) {
                return deferred.resolve(user);
            }

            var access = {
                name: 'Api access',
                user: user._id,
                blocked: false,
                default: true
            };
            AccessToken.createAccess(access).then(function () {
                return deferred.resolve(user);
            }).catch(function (err) {
                user.remove();
                return deferred.reject(err);
            });
        });
    });
    return deferred.promise;
};

UserSchema.statics.forgotPassword = function (params) {
    var deferred = Q.defer();
    var User = mongoose.model('User');
    var MongoValidationError = dolphin.load('errors').getMongoalidationError();
    var CustomValidationError = dolphin.load('errors').getCustomValidationError();

    User.findOne({email: params.email}).exec(function (err, user) {
        if (!user) {
            return deferred.reject(new CustomValidationError('email', 'Email not found'));
        }

        crypto.randomBytes(20, function (err, buf) {
            var token = buf.toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000 * 24 * 2; // 2 days
            user.save(function (err, user) {
                if (err) {
                    return deferred.reject(new MongoValidationError(err));
                }

                var letter = {
                    to: user.email,
                    subject: 'Resetting the password',
                    user: user
                };
                mailer.renderTemplate('user-restore-password', letter).then(function () {
                    deferred.resolve();
                }).catch(function (err) {
                    deferred.reject(err);
                });
            });
        });
    });
    return deferred.promise;
};

UserSchema.statics.resetPassword = function (params) {
    var deferred = Q.defer();
    var User = mongoose.model('User');
    var MongoValidationError = dolphin.load('errors').getMongoalidationError();
    var CustomValidationError = dolphin.load('errors').getCustomValidationError();

    var query = {
        resetPasswordToken: params.tokenId,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    };
    User.findOne(query, function (err, user) {
        if (!user) {
            return deferred.reject(new CustomValidationError('password', 'The token is not valid'));
        }
        validatePasswords(user, params);

        user.password = params.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save(function (err, user) {
            if (err) {
                return deferred.reject(new MongoValidationError(err));
            }

            deferred.resolve(user);
        });
    });
    return deferred.promise;
};

UserSchema.statics.deleteUser = function (user, _id) {
    var deferred = Q.defer();
    var User = mongoose.model('User');
    var AccessToken = mongoose.model('AccessToken');
    User.findOne({_id: _id}).exec(function (err, row) {
        if (!row) {
            return deferred.reject(new Error('Row not found'));
        }
        if (row._id == user._id) {
            return deferred.reject(new Error('You can delete myself'));
        }

        row.delete({user: user}).then(function () {
            AccessToken.findOne({user: row._id}).exec(function (err, access) {
                if (!access) {
                    console.warn('Access token nof found', row._id);
                    return deferred.resolve();
                }

                access.delete({user: user}).then(function () {
                    deferred.resolve();
                }).catch(function (err) {
                    return deferred.reject(err);
                });
            });
        }).catch(function (err) {
            return deferred.reject(err);
        });
    });
    return deferred.promise;
};

function validateUser(row, validatePasswrod, existsUser, params) {
    if (!params.username) {
        row.invalidate('username', 'Name cannot be blank');
    }
    if (!params.email) {
        row.invalidate('email', 'Email cannot be blank');
    }
    if (existsUser) {
        row.invalidate('email', 'This email address has already been used');
    }
    if (!params.roles || params.roles.length === 0) {
        row.invalidate('roles', 'You must select at least one role');
    }

    if (validatePasswrod) {
        validatePasswords(row, params);
    }
}

function validatePasswords(row, params) {
    if (!params.password) {
        row.invalidate('password', 'Password cannot be blank');
    }
    if (!params.confirmPassword) {
        row.invalidate('confirmPassword', 'Confirm password cannot be blank');
    }
    if (params.password && (params.password.length < 6 || params.password.length > 15)) {
        row.invalidate('password', 'Password must be more than 6 and less 15 characters long');
    }
    if (params.password && params.confirmPassword && params.confirmPassword != params.password) {
        row.invalidate('confirmPassword', 'The passwords do not match');
    }
}

mongoose.model('User', UserSchema);
