'use strict';

/*
 * Defining the Package
 */
var dolphin = require('dolphinio'),
    Module = dolphin.Module,
    passport = require('passport');

var Access = new Module('access');

Access.register(function (database) {

    // Register auth dependency

    var auth = require('./server/config/authorization');
    require('./server/config/passport')(passport);

    // This is for backwards compatibility
    dolphin.register('auth', function () {
        return auth;
    });

    dolphin.register('passport', function () {
        return passport;
    });

    Access.passport = passport;
    Access.middleware = auth;

    return Access;
});
