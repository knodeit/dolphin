'use strict';

// User routes use users controller
var users = require('../controllers/users');

module.exports = function (MeanUser, app, auth, database, passport) {

    app.route('/logout').get(users.signout);

    app.route('/users/me').get(users.me);

    // Setting up the users api
    app.route('/register').post(users.create);

    app.route('/forgot-password').post(users.forgotpassword);

    app.route('/reset/:token').post(users.resetpassword);

    // Setting up the userId param
    app.param('userId', users.user);

    // AngularJS route to check for authentication
    app.route('/loggedin').get(function (req, res) {
        res.send(req.isAuthenticated() ? req.user : null);
    });

    // Setting the local strategy route
    app.route('/login').post(passport.authenticate('local', {
        failureFlash: true
    }), function (req, res) {
        return res.send({
            user: req.user
        });
    });
};
