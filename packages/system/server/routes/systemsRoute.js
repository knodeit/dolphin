'use strict';

module.exports = function (System, app, auth, database, passport) {

    // Home route
    var index = require('../controllers/systemsController');
    app.route('/').get(index.render);
};
