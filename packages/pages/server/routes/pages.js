'use strict';

// The Package is past automatically as first parameter
module.exports = function (Pages, app, auth, database, passport) {

    app.get('/pages/example/anyone', function (req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/pages/example/auth', auth.requiresLogin, function (req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/pages/example/admin', auth.requiresAdmin, function (req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/pages/example/render', function (req, res, next) {
        Pages.render('index', {
            package: 'pages'
        }, function (err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });
};
