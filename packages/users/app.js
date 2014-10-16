'use strict';

/*
 * Defining the Package
 */
var Module = require('dolphinio').Module;

var MeanUser = new Module('users');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
MeanUser.register(function (app, auth, passport, database) {

    //We enable routing. By default the Package Object is passed to the routes
    MeanUser.routes(app, auth, database, passport);
    MeanUser.aggregateAsset('js', 'meanUser.js');

    /**
     // Another save settings example this time with no callback
     // This writes over the last settings.
     MeanUser.settings({
        'anotherSettings': 'some value'
    });

     // Get settings. Retrieves latest saved settigns
     MeanUser.settings(function(err, settings) {
        //you now have the settings object
    });
     */

    return MeanUser;
});
