'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
    blocked: {type: Boolean, default: false},
    auditing: {
        createdAt: {type: Date, default: Date.now},
        createdBy: {type: Schema.ObjectId, ref: 'User'},
        lastUpdateAt: {type: Date, default: Date.now},
        lastUpdateBy: {type: Schema.ObjectId, ref: 'User'},
        deleted: {type: Boolean, default: false}
    }
});

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

mongoose.model('AccessToken', AccessTokenSchema);
