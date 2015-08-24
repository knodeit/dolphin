'use strict';
var dolphin = require('dolphinio');

// Home route
var systemController = require('../controllers/system');

module.exports = function (System, app, auth, database, passport) {
    dolphin.defaultRender = systemController.render;
    app.route('/').get(systemController.render);

    app.post('/api/test', passport.authenticate('localapi', {session: false}), systemController.test);
    app.get('/api/version', systemController.getVersion);
};
