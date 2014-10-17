'use strict';

/*
 * Defining the Package
 */
var Module = require('dolphinio').Module,
  favicon = require('serve-favicon'),
  express = require('express');

var System = new Module('system');

System.register(function(app, auth, database, passport) {

  //We enable routing. By default the Package Object is passed to the routes
  System.routes(app, auth, database, passport);

  System.aggregateAsset('css', 'system.css');

  // The middleware in config/express will run before this code

  // Set views path, template engine and default layout
  app.set('views', __dirname + '/server/views');

  // Setting the favicon and static folder
  app.use(favicon(__dirname + '/public/assets/img/favicon.ico'));

  // Adding robots and humans txt
  app.use(express.static(__dirname + '/public/assets/static'));

  return System;
});
