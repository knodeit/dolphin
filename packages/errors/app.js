'use strict';

/*
 * Defining the Package
 */
var Module = require('dolphinio').Module;
var Errors = new Module('errors');
var MongoValidationError = require('./server/config/exceptions/mongo');
var HttpError = require('./server/config/exceptions/http');

Errors.register(function (app, auth, database, passport) {
    Errors.getMongoalidationError = function () {
        return MongoValidationError;
    };
    Errors.getHttpError = function () {
        return HttpError;
    };
    return Errors;
});
