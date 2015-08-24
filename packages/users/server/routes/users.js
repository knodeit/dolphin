'use strict';

// User routes use users controller
var users = require('../controllers/users');

module.exports = function (MeanUser, app, auth, database, passport) {
    app.get('/logout', users.signout);
    // AngularJS route to check for authentication
    app.get('/loggedin', users.loggedin);
    app.post('/login', users.login);
};
