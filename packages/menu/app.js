'use strict';

/*
 * Defining the Package
 */
var Module = require('dolphinio').Module;
var Menu = new Module('menu');
var mongoose = require('mongoose');
var MenuModel = mongoose.model('Menu');

Menu.angularAppConfigFetcher = function () {
    return {
        mainFront: MenuModel.getMainFrontMenu(),
        mainDashboard: MenuModel.getMainDashboardMenu()
    };
};

Menu.register(function (app, auth, database, passport) {

    //We enable routing. By default the Package Object is passed to the routes
    Menu.routes(app, auth, database, passport);

    Menu.aggregateAsset('css', 'menu.css');
    Menu.aggregateAsset('js', 'menu.js');

    /**
     //include static
     Menu.putJsFiles(['file']);
     Menu.putCssFiles(['file']);

     // Another save settings example this time with no callback
     // This writes over the last settings.
     Menu.settings({
        'anotherSettings': 'some value'
    });

     // Get settings. Retrieves latest saved settigns
     Menu.settings(function(err, settings) {
        //you now have the settings object
    });
     */

    return Menu;
});
