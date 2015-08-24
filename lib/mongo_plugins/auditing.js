'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function auditingPlugin(schema, options) {
    schema.add({
        auditing: {
            createdAt: {type: Date, default: Date.now},
            createdBy: {type: Schema.ObjectId, ref: 'User'},
            lastUpdateAt: {type: Date, default: Date.now},
            lastUpdateBy: {type: Schema.ObjectId, ref: 'User'},
            deleted: {type: Boolean, default: false}
        }
    });

    /**
     *  Added index on field // vadim
     */
    schema.index({'auditing.deleted': 1});

    /**
     * Pre-save hook
     */
    schema.pre('save', function (next, params, callback) {
        if (this.isNew) {
            this.createdAt = new Date().toISOString();

            if (params && params._id) {
                this.auditing.createdBy = params._id;
            }
        }

        if (params && params._id) {
            this.auditing.lastUpdateBy = params._id;
        }

        this.auditing.lastUpdateAt = new Date().toISOString();
        next(callback);
    });
};