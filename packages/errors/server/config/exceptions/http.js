/**
 * Created by Vadim on 26.06.2015.
 */
'use strict';

function HttpError(status, err) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.status = status;
    this.err = err;

    this.getStatus = function () {
        return this.status;
    };

    this.getError = function () {
        return this.err;
    };
}

module.exports = HttpError;
require('util').inherits(module.exports, Error);
