'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SiteSettingSchema = new Schema({
    title: {type: String, default: ''},
    logoPath: {type: String, default: ''}
});

/**
 * Validations
 */
SiteSettingSchema.path('title').validate(function (title) {
    return !!title;
}, 'Title cannot be blank');

SiteSettingSchema.statics.isInitialized = function (callback) {
    var SiteSetting = mongoose.model('SiteSetting');
    SiteSetting.count({}).exec(function (err, count) {
        callback(count > 0);
    });
};

SiteSettingSchema.statics.getSettings = function (callback) {
    var SiteSetting = mongoose.model('SiteSetting');
    SiteSetting.findOne({}).exec(function (err, row) {
        callback(row);
    });
};

SiteSettingSchema.plugin(require('../../../../lib/mongo_plugins/auditing'));
mongoose.model('SiteSetting', SiteSettingSchema);