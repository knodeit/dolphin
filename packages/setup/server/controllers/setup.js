'use strict';

/**
 * Created by Peter on 12.08.2014.
 */

var Q = require('q');
var dolphin = require('dolphinio');
var MongoValidationError = dolphin.load('errors').getMongoalidationError();

var mongoose = require('mongoose');
var SiteSetting = mongoose.model('SiteSetting');
var User = mongoose.model('User');

function getSiteSetting(req) {
    var deferred = Q.defer();
    if (req.body.id) {
        SiteSetting.findOne({_id: req.body.id}).exec(function (err, row) {
            if (row) {
                deferred.resolve(row);
            } else {
                deferred.resolve(new SiteSetting());
            }
        });
    } else {
        deferred.resolve(new SiteSetting());
    }
    return deferred.promise;
}

exports.update = function (req, res, next) {
    getSiteSetting(req).then(function (row) {
        if (!req.body.email) {
            row.invalidate('email', 'Email cannot be blank');
        }
        if (!req.body.username) {
            row.invalidate('username', 'Username cannot be blank');
        }
        if (!req.body.password) {
            row.invalidate('password', 'Password cannot be blank');
        }
        if (!req.body.confirmPassword) {
            row.invalidate('confirmPassword', 'Confirm password cannot be blank');
        } else {
            if (req.body.password != req.body.confirmPassword) {
                row.invalidate('password', 'Passwords do not match');
            }
        }

        row.title = req.body.title;
        row.save(function (err, row) {
            if (err) {
                return next(new MongoValidationError(err));
            }

            User.createRootUser(req.body.username, req.body.email, req.body.password, function (err) {
                if (err) {
                    row.remove();
                    return next(new MongoValidationError(err));
                }

                return res.send(row);
            });
        });
    });
};
