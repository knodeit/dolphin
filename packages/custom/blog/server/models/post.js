'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var BlogPostSchema = new Schema({
    title: {
        type: String,
        trim: true,
        index: true
    },
    slug: {
        type: String,
        trim: true,
        index: true,
        unique: true
    },
    annonce: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        trim: true
    },
    thumbnail: {
        filename: {
            type: String,
            trim: true
        },
        fileURL: {
            type: String,
            trim: true
        }
    },
    tags: {
        type: Array,
        trim: true
    },
    keywords: {
        type: Array,
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    blog: {
        type: Schema.ObjectId,
        ref: 'BlogBlog'
    },
    released: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    //added by Jackson
    categories: {
        type: [],
        default: ['Uncategorized']
    },
    description: {
        type: String,
        trim: true,
        default:'no description available'
    },
    cancellationDate: {
        type: Date,
        default: new Date(2099,1,1,0,0,0)
    },
    releaseDate: {
        type: Date,
        default: Date(0)
    },
    comments: {
        type: Boolean,
        default: true
    }


});

/**
 * Validations
 */
BlogPostSchema.path('title').validate(function (title) {
    return !!title;
}, 'Title cannot be blank');

BlogPostSchema.path('slug').validate(function (title) {
    return !!title;
}, 'Slug cannot be blank');

BlogPostSchema.path('annonce').validate(function (content) {
    return !!content;
}, 'Annonce cannot be blank');

BlogPostSchema.path('content').validate(function (content) {
    return !!content;
}, 'Content cannot be blank');

BlogPostSchema.path('blog').validate(function (title) {
    return !!title;
}, 'Blog cannot be blank');

//validates
BlogPostSchema.path('slug').validate(function (value, callback) {
    var BlogPost = mongoose.model('BlogPost');
    BlogPost.find({slug: value, _id: {$ne: this._id}}).exec(function (err, rows) {
        callback(err || rows.length === 0);
    });
}, 'Slug already exists');


mongoose.model('BlogPost', BlogPostSchema);
