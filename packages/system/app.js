'use strict';
/*jshint -W079 */

/*
 * Defining the Package
 */
var Module = require('dolphinio').Module,
    favicon = require('serve-favicon'),
    express = require('express');

var System = new Module('system');

System.register(function (app, auth, database, passport) {

    //We enable routing. By default the Package Object is passed to the routes
    System.routes(app, auth, database, passport);

    // Set views path, template engine and default layout
    app.set('views', __dirname + '/server/views');

    // Setting the favicon and static folder
    app.use(favicon('favicon.ico'));

    // Adding robots and humans txt
    app.use(express.static('static'));

    return System;
});
