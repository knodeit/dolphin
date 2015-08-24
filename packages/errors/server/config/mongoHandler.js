/**
 * Created by Vadim on 26.06.2015.
 */
'use strict';

var MongoValidationError = require('./exceptions/mongo');

module.exports = function (err, req, res, next) {
    if (err && err instanceof MongoValidationError) {
        res.status(400).send(err.getErrors());
    } else {
        next(err);
    }
};