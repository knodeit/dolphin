/**
 * Created by Vadim on 26.06.2015.
 */
'use strict';

function CustomValidationError(param, message, value) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.param = param;
    this.message = message;
    this.value = value;

    this.getErrors = function () {
        var errors = [
            {
                param: this.param,
                msg: this.message,
                value: this.value
            }
        ];
        return errors;
    };
}

module.exports = CustomValidationError;
require('util').inherits(module.exports, Error);
