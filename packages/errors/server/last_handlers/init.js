/**
 * Created by Vadim on 26.06.2015.
 */
'use strict';
var mongoHandler = require('../config/mongoHandler');
var customHandler = require('../config/customHandler');
var httpHandler = require('../config/httpHandler');

module.exports = function (app) {
    app.use(mongoHandler);
    app.use(customHandler);
    app.use(httpHandler);
};