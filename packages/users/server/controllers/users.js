'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    crypto = require('crypto');

var mailer = require('../../.././../vendor/mailer');

/**
 * Logout
 */
exports.signout = function (req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Create user
 */
exports.create = function (req, res, next) {
    var user = new User(req.body);

    user.provider = 'local';

    // because we set our user.provider to local our models/user.js validation will always be true
    req.assert('name', 'You must enter a name').notEmpty();
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    // Hard coded for now. Will address this with the user permissions system in v0.3.5
    user.roles = ['authenticated'];
    user.save(function (err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    res.status(400).send([
                        {
                            msg: 'Username already taken',
                            param: 'username'
                        }
                    ]);
                    break;
                default:
                    var modelErrors = [];
                    if (err.errors) {
                        for (var x in err.errors) {
                            modelErrors.push({
                                param: x,
                                msg: err.errors[x].message,
                                value: err.errors[x].value
                            });
                        }
                    }
                    res.status(400).send(modelErrors);
            }
        } else {
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.status(200).send({
                    user: user
                });
            });
        }
    });
};

/**
 * Send User
 */
exports.me = function (req, res) {
    res.json(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function (req, res, next, id) {
    User.findOne({_id: id}).exec(function (err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return next(new Error('Failed to load User ' + id));
        }

        req.profile = user;
        next();
    });
};

/**
 * Callback for forgot password link
 */
exports.forgotpassword = function (req, res, next) {

    req.assert('email', 'You must enter a valid email address').isEmail();
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        User.findOne({email: req.body.email}, function (err, user) {
            if (err || !user) {
                return res.status(400).send([
                    {
                        param: 'email',
                        msg: 'Email not found'
                    }
                ]);
            }

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            user.save(function (err, user) {
                if (err) {
                    var modelErrors = [];
                    if (err.errors) {
                        for (var x in err.errors) {
                            modelErrors.push({
                                param: x,
                                msg: err.errors[x].message,
                                value: err.errors[x].value
                            });
                        }
                    }
                    return res.status(400).send(modelErrors);
                }

                var mail = {
                    email: user.email,
                    subject: 'Resetting the password',
                    user: user
                };
                mailer.sendOne('user-registration', mail, function (err) {
                    if (err) {
                        return res.status(400).send([{
                            param: 'email',
                            msg: 'email hasn\'t been sent',
                            value: user.email
                        }]);
                    }

                    return res.json({
                        message: 'EMail sent successfully'
                    });
                });
            });
        });
    });
};


/**
 * Resets the password
 */

exports.resetpassword = function (req, res, next) {
    var query = {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    };
    User.findOne(query, function (err, user) {
        if (err) {
            var modelErrors = [];
            if (err.errors) {
                for (var x in err.errors) {
                    modelErrors.push({
                        param: x,
                        msg: err.errors[x].message,
                        value: err.errors[x].value
                    });
                }
            }
            return res.status(400).send(modelErrors);
        }

        if (!user) {
            return res.status(400).json([{
                param: 'password',
                msg: 'Token invalid or expired'
            }]);
        }

        req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
        req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
        var errors = req.validationErrors();
        if (errors) {
            return res.status(400).send(errors);
        }

        user.password = req.body.password;
        user.resetPasswordToken = '';
        user.resetPasswordExpires = '';
        user.save(function (err, user) {
            if (err) {
                var modelErrors = [];
                if (err.errors) {
                    for (var x in err.errors) {
                        modelErrors.push({
                            param: x,
                            msg: err.errors[x].message,
                            value: err.errors[x].value
                        });
                    }
                }
                return res.status(400).send(modelErrors);
            }

            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.status(200).send({
                    user: user
                });
            });
        });
    });
};