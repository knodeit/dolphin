'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BlogVideoSchema = new Schema({
    title: {
        type: String,
        trim: true
    },
    path: {
        type: String,
        trim: true
    },
    fileUrl: {
        type: String,
        trim: true
    },
    width: {
        type: Number,
        default: 0
    },
    height: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['NEW', 'WORK', 'DONE', 'ERROR'],
        default: 'NEW'
    },
    progress: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

BlogVideoSchema.path('title').validate(function (value) {
    return !!value;
}, 'Title is required');

mongoose.model('BlogVideo', BlogVideoSchema);
