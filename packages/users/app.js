'use strict';

/*
 * Defining the Package
 */
var Module = require('dolphinio').Module;
var User = new Module('users');

User.register(function (app, auth, database, passport) {
    //We enable routing. By default the Package Object is passed to the routes
    User.routes(app, auth, database, passport);
    User.aggregateAsset('js', 'user.js');
    return User;
});
