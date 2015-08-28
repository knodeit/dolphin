/**
 * Created by jacksonstone1 on 7/24/15.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var BlogCommentSchema = new Schema({

    user: {
        type: Schema.ObjectId,
        ref: 'User',
        default: undefined
    },
    post: {
        type: Schema.ObjectId,
        ref: 'BlogPost'
    },
    content: {
        type: String,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    //added by Jackson
    parent: {
        type: Schema.ObjectId,
        ref: 'BlogComment',
    },

    email: {
            type: String,
            // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
            match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
    },
    name: {
        type: String,
        default: 'Anonymous'
    }
});

/**
 * Validations
 */
BlogCommentSchema .path('content').validate(function (Comment) {
    return !!Comment;
}, 'Comment cannot be blank');

mongoose.model('BlogComment', BlogCommentSchema);