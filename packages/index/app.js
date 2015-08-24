'use strict';

/*
 * Defining the Package
 */
var dolphinio = require('dolphinio');
var Module = dolphinio.Module;
var Index = new Module('index');

var mongoose = require('mongoose');
var Menu = mongoose.model('Menu');

Index.register(function (app, auth, database, passport) {

    //We enable routing. By default the Package Object is passed to the routes
    Index.routes(app, auth, database, passport);

    Index.aggregateAsset('css', 'index.css');
    Index.aggregateAsset('js', 'index.js');

    /**
     //include static
     Index.putJsFiles(['file']);
     Index.putCssFiles(['file']);

     // Another save settings example this time with no callback
     // This writes over the last settings.
     Index.settings({
        'anotherSettings': 'some value'
    });

     // Get settings. Retrieves latest saved settigns
     Index.settings(function(err, settings) {
        //you now have the settings object
    });
     */

    Index.registerMenu([
        {
            title: 'Home',
            state: 'front.index',
            menu: Menu.getMainFrontMenu(),
            entity: ''
        }
    ]);
    return Index;
});
