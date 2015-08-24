'use strict';

/*
 * Defining the Package
 */
var dolphin = require('dolphinio');
var Module = dolphin.Module;
var Access = new Module('access');
var passport = require('passport');
var mongoose = require('mongoose');

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

    Access.aggregateAsset('css', 'access.css');

    Access.registerMenu([
        {
            title: 'Access',
            state: 'dashboard.access',
            menu: mongoose.model('Menu').getMainDashboardMenu(),
            entity: Access.acl.matrix.entities.index
        }
    ]);

    return Access;
});
