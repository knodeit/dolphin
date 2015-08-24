'use strict';

/*
 * Defining the Package
 */
var Module = require('dolphinio').Module;
var Setup = new Module('setup');
var Q = require('q');
var mongoose = require('mongoose');
var SiteSetting = mongoose.model('SiteSetting');

Setup.register(function (app, auth, database, passport) {

    //We enable routing. By default the Package Object is passed to the routes
    Setup.routes(app, auth, database, passport);

    Setup.aggregateAsset('css', 'setup.css');
    Setup.aggregateAsset('js', 'setup.js');

    /**
     //include static
     Setup.putJsFiles(['file']);
     Setup.putCssFiles(['file']);

     // Another save settings example this time with no callback
     // This writes over the last settings.
     Setup.settings({
        'anotherSettings': 'some value'
    });

     // Get settings. Retrieves latest saved settigns
     Setup.settings(function(err, settings) {
        //you now have the settings object
    });
     */

    Setup.checkInitialization = function () {
        var deferred = Q.defer();
        SiteSetting.isInitialized(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    Setup.getSettings = function () {
        var deferred = Q.defer();
        SiteSetting.getSettings(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    return Setup;
});
