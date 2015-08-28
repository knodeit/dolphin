'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var BlogBlogSchema = new Schema({
    title: {
        type: String,
        trim: true
    },
    slug: {
        type: String,
        trim: true,
        index: true,
        unique: true
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    },


    created: {
        type: Date,
        default: Date.now
    },

    defaultWriter: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    //added by jackson
    description: {
        type: String,
        default: 'No description available',
    },

    categories: {
        type: Array,
        trim: true
    },
    comments: {
        type: Boolean,
        default: true
    },
    commentsExpire: {
        type: Boolean,
        default: true
    },
    commentLifespan: {
        type: Number,
        default: 14
    }
});

//validates
BlogBlogSchema.path('slug').validate(function (value, callback) {
    var BlogBlog = mongoose.model('BlogBlog');
    BlogBlog.find({slug: value, _id: {$ne: this._id}}).exec(function (err, rows) {
        callback(err || rows.length === 0);
    });
}, 'Slug already exists');



mongoose.model('BlogBlog', BlogBlogSchema);
