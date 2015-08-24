'use strict';

var setupCtrl = require('../controllers/setup');
// The Package is past automatically as first parameter
module.exports = function (Setup, app, auth, database, passport) {
    app.post('/setup/front/init', setupCtrl.update);
};
