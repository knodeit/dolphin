/**
 * Created by Vadim on 26.06.2015.
 */
'use strict';

var CustomValidationError = require('./exceptions/customValidation');

module.exports = function (err, req, res, next) {
    if (err && err instanceof CustomValidationError) {
        res.status(400).send(err.getErrors());
    } else {
        next(err);
    }
};