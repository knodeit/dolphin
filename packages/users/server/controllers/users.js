'use strict';

/**
 * Module dependencies.
 */
var regexpQuote = require('../../../../lib/regexpquote');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var AclRole = mongoose.model('AclRole');

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

exports.signup = function (req, res, next) {
    User.registerUser(req.body).then(function (user) {
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            res.send(user);
        });
    }).catch(function (err) {
        next(err);
    });
};

exports.forgotPassword = function (req, res, next) {
    User.forgotPassword(req.body).then(function () {
        res.send();
    }).catch(function (err) {
        next(err);
    });
};

exports.resetPassword = function (req, res, next) {
    User.resetPassword(req.body).then(function (user) {
        req.logIn(user, function (err) {
            if (err) {
                return res.status(400).send(err);
            }
            return res.send(user);
        });
    }).catch(function (err) {
        next(err);
    });
};

exports.grid = function (req, res) {
    var page = parseInt(req.query.page, 10);
    if (Number.isNaN(page)) {
        page = 1;
    }
    var perPage = Math.min.apply(Math, [req.query.perPage, 100]);
    var query = {
        'auditing.deleted': false
    };
    if (req.query.filters) {
        req.query.filters = JSON.parse(req.query.filters);

        if (req.query.filters.username) {
            query.username = new RegExp(regexpQuote.quote(req.query.filters.username), 'i');
        }

        if (req.query.filters.blocked != 'all') {
            query.blocked = req.query.filters.blocked == 'yes';
        }
    }

    User.count(query).exec(function (err, count) {
        var totalPages = Math.ceil(count / perPage);
        User.find(query).sort({_id: -1}).limit(perPage).skip(perPage * (page - 1)).exec(function (err, rows) {
            res.send({rows: rows, count: count, perPage: perPage, totalPages: totalPages});
        });
    });
};

exports.getUser = function (req, res) {
    User.findOne({_id: req.query._id}).exec(function (err, row) {
        if (row) {
            return res.send(row);
        }
        row = new User();
        row._id = undefined;
        res.send(row);
    });
};

exports.getRoles = function (req, res) {
    AclRole.find({'auditing.deleted': false}).sort({name: 1}).exec(function (err, rows) {
        res.send(rows);
    });
};

exports.updateUser = function (req, res, next) {
    User.createOrUpdateUser(req.body).then(function (user) {
        res.send(user);
    }).catch(function (err) {
        next(err);
    });
};

exports.deleteUser = function (req, res, next) {
    User.deleteUser(req.user, req.query._id).then(function () {
        res.send();
    }).catch(function (err) {
        next(err);
    });
};