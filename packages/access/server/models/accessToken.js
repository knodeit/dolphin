'use strict';

var dolphin = require('dolphinio');
var Q = require('q');
var uuid = require('node-uuid');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function validateMax(value, max) {
    if (!value || value.length < max) {
        return true;
    }
    return false;
}

// Client
var AccessTokenSchema = new Schema({
    user: {type: Schema.ObjectId, ref: 'User'},
    name: {type: String},
    token: {type: String},
    default: {type: Boolean, default: false},
    blocked: {type: Boolean, default: false}
});
AccessTokenSchema.plugin(require('../../../../lib/mongo_plugins/auditing'));

//validates
AccessTokenSchema.path('name').validate(function (value) {
    if (value) {
        return true;
    } else {
        return false;
    }
}, 'Name is required');

AccessTokenSchema.path('name').validate(function (value) {
    return validateMax(value, 50);
}, 'Max characters cannot be < 50');

AccessTokenSchema.path('token').validate(function (value) {
    if (value) {
        return true;
    } else {
        return false;
    }
}, 'c is required');

AccessTokenSchema.path('token').validate(function (value, callback) {
    if (!value || this.auditing.deleted) {
        return callback(true);
    }
    var AccessToken = mongoose.model('AccessToken');
    var $this = this;
    var query = {
        token: value
    };
    if (!this.isNew) {
        query._id = {$ne: $this._id};
    }
    AccessToken.findOne(query).exec(function (err, row) {
        if (row) {
            callback(false);
        } else {
            callback(true);
        }
    });
}, 'Token already exist');

AccessTokenSchema.statics.createAccess = function (params) {
    var deferred = Q.defer();
    var MongoValidationError = dolphin.load('errors').getMongoalidationError();
    var AccessToken = mongoose.model('AccessToken');
    params.token = uuid.v4();
    var row = new AccessToken(params);
    row.save(function (err, row) {
        if (err) {
            return deferred.reject(new MongoValidationError(err));
        }
        deferred.resolve(row);
    });
    return deferred.promise;
};

mongoose.model('AccessToken', AccessTokenSchema);
