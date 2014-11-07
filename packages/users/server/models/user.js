'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var uuid = require('node-uuid');
var chalk = require('chalk');

/**
 * Validations
 */
var validatePresenceOf = function (value) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    return (this.provider && this.provider !== 'local') || (value && value.length);
};

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
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
        validate: [validateUniqueEmail, 'E-mail address is already in-use']
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    roles: {
        type: Array,
        default: ['authenticated']
    },
    hashed_password: {
        type: String,
        validate: [validatePresenceOf, 'Password cannot be blank']
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
        return roles.indexOf('admin') !== -1 || roles.indexOf(role) !== -1;
    },

    /**
     * IsAdmin - check if the user is an administrator
     *
     * @return {Boolean}
     * @api public
     */
    isAdmin: function () {
        return this.roles.indexOf('admin') !== -1;
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

UserSchema.statics.createRootUser = function () {
    var User = mongoose.model('User');
    var AccessToken = mongoose.model('AccessToken');

    var userName = 'root';
    User.findOne({name: userName}).exec(function (err, rootUser) {
        if (rootUser) {
            return;
        }
        console.log(chalk.green('Auto installing root user'));

        rootUser = new User();
        rootUser.name = userName;
        rootUser.username = userName;
        rootUser.email = 'admin@admin.com';
        rootUser.password = 'administrator';
        rootUser.roles = ['admin', 'authenticated'];
        rootUser.save(function (err, rootUser) {
            if (err) {
                return console.log('Error', err);
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
        });
    });
};

mongoose.model('User', UserSchema);
