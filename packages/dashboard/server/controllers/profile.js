'use strict';

/**
 * Created by Vadim on 25.12.2014.
 */
var dolphin = require('dolphinio');
var MongoValidationError = dolphin.load('errors').getMongoalidationError();

var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.updateUser = function (req, res, next) {
    var user = req.user;
    user.username = req.body.username;
    user.save(function (err, user) {
        if (err) {
            return next(new MongoValidationError(err));
        }
        res.send(user);
    });
};

exports.updatePassword = function (req, res, next) {
    User.findOne({_id: req.user._id}).exec(function (err, user) {
        if (!req.body.currentPassword) {
            user.invalidate('currentPassword', 'CurrentPassword cannot be blank');
        } else {
            if (!user.authenticate(req.body.currentPassword)) {
                user.invalidate('currentPassword', 'Wrong current password');
            }
        }

        if (!req.body.password) {
            user.invalidate('password', 'Password cannot be blank');
        } else {
            if (req.body.password.length > 10) {
                user.invalidate('password', 'Password cannot be more 10 characters long');
            }
            if (req.body.password.length < 5) {
                user.invalidate('password', 'Password cannot be less 5 characters long');
            }
        }

        if (!req.body.repeatPassword) {
            user.invalidate('repeatPassword', 'Repeat password cannot be blank');
        }

        if (req.body.password !== req.body.repeatPassword) {
            user.invalidate('repeatPassword', 'Password does not match');
        }

        user.password = req.body.password;
        user.save(function (err, user) {
            if (err) {
                return next(new MongoValidationError(err));
            }
            res.send(user);
        });
    });
};