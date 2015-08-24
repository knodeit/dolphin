'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var uuid = require('node-uuid');
var chalk = require('chalk');

/**
 * Validations
 */
var validateUniqueEmail = function (value, callback) {
    var User = mongoose.model('User');
    User.find({
        $and: [
            {
                email: value
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
        unique: true,
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
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
    if (this.isNew && this.provider === 'local' && this.password && !this.password.length)
        return next(new Error('Invalid password'));
    next();
});

/**
 * Validations
 */
UserSchema.path('username').validate(function (row) {
    return !!row;
}, 'Username cannot be blank');

UserSchema.path('username').validate(function (value, callback) {
    if (!value) {
        return callback(true);
    }

    var User = mongoose.model('User');
    var $this = this;
    var query = {
        username: value
    };
    if (!this.isNew) {
        query._id = {$ne: $this._id};
    }
    User.findOne(query).exec(function (err, row) {
        if (row) {
            callback(false);
        } else {
            callback(true);
        }
    });
}, 'Username already exists');

UserSchema.path('email').validate(function (row) {
    return !!row;
}, 'Email cannot be blank');

/**
 * Methods
 */
UserSchema.methods = {

    /**
     * HasRole - check if the user has required role
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    hasRole: function (role) {
        var roles = this.roles;
        return roles.indexOf(role) !== -1;
    },

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function (plainText) {
        return this.hashPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function () {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Hash password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    hashPassword: function (password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};

UserSchema.statics.createRootUser = function (email, password, callback) {
    var User = mongoose.model('User');
    var AccessToken = mongoose.model('AccessToken');

    User.findOne({email: email}).exec(function (err, rootUser) {
        if (rootUser) {
            return callback(null, rootUser);
        }

        rootUser = new User();
        rootUser.username = 'root';
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

mongoose.model('User', UserSchema);
