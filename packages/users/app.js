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

    /**
     // Another save settings example this time with no callback
     // This writes over the last settings.
     User.settings({
        'anotherSettings': 'some value'
    });

     // Get settings. Retrieves latest saved settigns
     User.settings(function(err, settings) {
        //you now have the settings object
    });
     */

    return User;
});
