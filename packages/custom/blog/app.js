'use strict';

/*
 * Defining the Package
 */
var dolphin = require('dolphinio');
var Module = dolphin.Module;
var Blog = new Module('blog');
var blogWorker = require('./server/lib/converter/worker');

var mongoose = require('mongoose');
var Menu = mongoose.model('Menu');

Blog.register(function (app, auth, database, passport) {

    //We enable routing. By default the Package Object is passed to the routes
    Blog.routes(app, auth, database, passport);

    Blog.aggregateAsset('css', 'blog.css');
    Blog.aggregateAsset('js', 'blog.js');

    Blog.putCssFiles([
        'bower_components/fancybox/source/jquery.fancybox.css',
        'bower_components/ng-tags-input/ng-tags-input.min.css'
    ]);

    Blog.putJsFiles([
        'bower_components/jwplayer-mirror/jwplayer.js',
        'bower_components/fancybox/source/jquery.fancybox.pack.js',
        'bower_components/ng-tags-input/ng-tags-input.min.js',
        'bower_components/ckeditor/ckeditor.js',
        'bower_components/angular-ckeditor/angular-ckeditor.min.js',
        'bower_components/angular-sanitize/angular-sanitize.min.js',
        'bower_components/angular-facebook/lib/angular-facebook.js'

    ]);

    /**
     //include static
     Blog.putJsFiles(['file']);
     Blog.putCssFiles(['file']);

     // Another save settings example this time with no callback
     // This writes over the last settings.
     Blog.settings({
        'anotherSettings': 'some value'
    });

     // Get settings. Retrieves latest saved settigns
     Blog.settings(function(err, settings) {
        //you now have the settings object
    });
     */

    blogWorker.initBlogWorker(Blog);

    Blog.registerMenu([
        {
            title: 'Blog',
            state: 'dashboard.blog.posts',
            menu: Menu.getMainDashboardMenu(),
            entity: Blog.acl.matrix.entities.index
        }
    ]);

    return Blog;
});