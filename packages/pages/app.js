'use strict';

/*
 * Defining the Package
 */
var Module = require('dolphinio').Module;

var Pages = new Module('pages');


Pages.register(function (app, auth, database, passport) {

    //We enable routing. By default the Package Object is passed to the routes
    Pages.routes(app, auth, database, passport);

    Pages.aggregateAsset('css', 'pages.css');
    Pages.aggregateAsset('js', 'pages.js');

    /**
     //include static
     Pages.putJsFiles(['file']);
     Pages.putCssFiles(['file']);

     // Another save settings example this time with no callback
     // This writes over the last settings.
     Pages.settings({
        'anotherSettings': 'some value'
    });

     // Get settings. Retrieves latest saved settigns
     Pages.settings(function(err, settings) {
        //you now have the settings object
    });
     */

    return Pages;
});
