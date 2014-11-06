'use strict';

/**
 * Module dependencies.
 */
var dolphin = require('dolphinio');
var compression = require('compression');
var morgan = require('morgan');
var consolidate = require('consolidate');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var assetmanager = require('assetmanager');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var helpers = require('view-helpers');
var flash = require('connect-flash');
var config = dolphin.loadConfig();
var multer = require('multer');

module.exports = function (app, passport, db) {

    app.set('showStackError', true);

    // Prettify HTML
    app.locals.pretty = true;

    // cache=memory or swig dies in NODE_ENV=production
    app.locals.cache = 'memory';

    // Should be placed before express.static
    // To ensure that all assets and data are compressed (utilize bandwidth)
    app.use(compression({
        // Levels are specified in a range of 0 to 9, where-as 0 is
        // no compression and 9 is best compression, but slowest
        level: 9
    }));

    // Only use logger for development environment
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // assign the template engine to .html files
    app.engine('html', consolidate[config.templateEngine]);

    // set .html as the default extension
    app.set('view engine', 'html');

    // The cookieParser should be above session
    app.use(cookieParser());

    // Request body parsing middleware should be above methodOverride
    app.use(expressValidator());
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '50mb'
    }));
    app.use(methodOverride());
    app.use(multer({
        dest: './uploads/',
        limits: {
            fieldNameSize: 1024 * 1024 * 1000 // 1GB
        }
    }));

    // Import the assets file and add to locals
    var assets = assetmanager.process({
        assets: require('./assets.json'),
        debug: process.env.NODE_ENV !== 'production',
        webroot: /packages\/custom\//g
    });

    // Add assets to local variables
    app.use(function (req, res, next) {
        res.locals.assets = assets;

        dolphin.aggregated('js', 'header', function (data) {
            res.locals.headerJs = data;
            next();
        });
    });

    // Express/Mongo session storage
    app.use(session({
        secret: config.sessionSecret,
        store: new mongoStore({
            db: db.connection.db,
            collection: config.sessionCollection
        }),
        cookie: config.sessionCookie,
        name: config.sessionName,
        resave: true,
        saveUninitialized: true
    }));

    // Use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    //dolphin middleware from modules before routes
    app.use(dolphin.chainware.before);

    // Connect flash for flash messages
    app.use(flash());
};
