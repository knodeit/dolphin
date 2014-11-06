'use strict';

// Home route
var index = require('../controllers/system');

module.exports = function (System, app, auth, database, passport) {
    app.route('/').get(index.render);
};
