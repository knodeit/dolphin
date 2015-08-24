/**
 * Created by Vadim on 26.06.2015.
 */
'use strict';

var HttpError = require('./exceptions/http');

module.exports = function (err, req, res, next) {
    if (err && err instanceof HttpError) {
        res.status(err.getStatus()).send(err.getError());
    } else {
        next(err);
    }
};