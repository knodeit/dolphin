'use strict';

// Home route
var systemController = require('../controllers/system');

module.exports = function (System, app, auth, database, passport) {
    app.route('/').get(systemController.render);

    app.route('/api/version').get(systemController.getVersion);
    app.get('/api/test', passport.authenticate('localapi', { session: false}), systemController.test);
    app.post('/api/test', passport.authenticate('localapi', { session: false}), systemController.test);
};
