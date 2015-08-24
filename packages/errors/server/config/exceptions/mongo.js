/**
 * Created by Vadim on 26.06.2015.
 */
'use strict';

function MongoValidationError(err) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.err = err;

    this.getErrors = function () {
        var errors = [];

        if (this.err.errors) {
            for (var index in this.err.errors) {
                if (!this.err.errors[index].path) {
                    continue;
                }
                errors.push({
                    param: this.err.errors[index].path,
                    msg: this.err.errors[index].message,
                    value: this.err.errors[index].value
                });
            }
        }

        return errors;
    };
}

module.exports = MongoValidationError;
require('util').inherits(module.exports, Error);
