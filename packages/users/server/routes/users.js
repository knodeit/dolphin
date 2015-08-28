'use strict';

// User routes use users controller
var users = require('../controllers/users');

module.exports = function (Users, app, auth, database, passport) {
    app.get('/logout', users.signout);
    // AngularJS route to check for authentication
    app.get('/users/loggedin', users.loggedin);
    app.post('/users/front/login', users.login);
    app.post('/users/front/signup', users.signup);
    app.post('/users/front/forgot-password', users.forgotPassword);
    app.post('/users/front/reset-password', users.resetPassword);

    //dashboard
    app.get('/users/dashboard/users', Users.acl.checkAccess(Users.acl.matrix.entities.users), users.grid);
    app.get('/users/dashboard/roles', Users.acl.checkAccess(Users.acl.matrix.entities.users), users.getRoles);
    app.get('/users/dashboard/user', Users.acl.checkAccess(Users.acl.matrix.entities.users), users.getUser);
    app.put('/users/dashboard/user', Users.acl.checkAccess(Users.acl.matrix.entities.users), users.updateUser);
    app.delete('/users/dashboard/user', Users.acl.checkAccess(Users.acl.matrix.entities.users), users.deleteUser);
};
