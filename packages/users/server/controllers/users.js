'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');

/**
 * Logout
 */
exports.signout = function (req, res) {
    req.logout();
    res.redirect('/');
};

exports.loggedin = function (req, res) {
    res.send(req.isAuthenticated() ? req.user : null);
};

exports.login = function (req, res) {
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('password', 'You must enter the password').len(1);
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    User.loginInByEmail(req.body.email, function (user) {
        if (!user) {
            return res.status(400).send([{
                param: 'email',
                msg: 'User not found'
            }]);
        }

        if (!user.authenticate(req.body.password)) {
            return res.status(400).send([{
                param: 'password',
                msg: 'Invalid password'
            }]);
        }
        if (!user.verified) {
            return res.status(400).send([{
                param: 'email',
                msg: 'User is not verified'
            }]);
        }
        if (user.blocked) {
            return res.status(400).send([{
                param: 'email',
                msg: 'User is banned'
            }]);
        }

        req.logIn(user, function (err) {
            if (err) {
                return res.status(400).send(err);
            }
            return res.send(user);
        });
    });
};