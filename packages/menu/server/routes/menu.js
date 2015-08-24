'use strict';

var menuCtrl = require('../controllers/menu');

// The Package is past automatically as first parameter
module.exports = function (Menu, app, auth, database, passport) {

    app.get('/menu/tree/:name', menuCtrl.tree);
};
