'use strict';

/*
 * Defining the Package
 */
var dolphinio = require('dolphinio');
var Module = dolphinio.Module;
var Dashboard = new Module('dashboard');
var mongoose = require('mongoose');
var Menu = mongoose.model('Menu');

Dashboard.register(function (app, auth, database, passport) {

    //We enable routing. By default the Package Object is passed to the routes
    Dashboard.routes(app, auth, database, passport);

    Dashboard.aggregateAsset('css', 'dashboard.css');
    Dashboard.aggregateAsset('js', 'dashboard.js');

    /**
     //include static
     Dashboard.putJsFiles(['file']);
     Dashboard.putCssFiles(['file']);

     // Another save settings example this time with no callback
     // This writes over the last settings.
     Dashboard.settings({
        'anotherSettings': 'some value'
    });

     // Get settings. Retrieves latest saved settigns
     Dashboard.settings(function(err, settings) {
        //you now have the settings object
    });
     */

    Dashboard.registerMenu([
        {
            title: 'Dashboard',
            state: 'dashboard.index',
            menu: Menu.getMainDashboardMenu(),
            entity: Dashboard.acl.matrix.entities.index,
            sort: -1//always first
        }
    ]);

    return Dashboard;
});
