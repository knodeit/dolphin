'use strict';

/**
 * Created by Vadim on 17.03.2015.
 */
var dolphin = require('dolphinio');
var Q = require('q');
var s3 = require('../lib/localStorage');

var mongoose = require('mongoose');
var BlogBlog = mongoose.model('BlogBlog');
var BlogPost = mongoose.model('BlogPost');
var Menu = mongoose.model('Menu');

exports.list = function (req, res, next) {
    BlogBlog.find({}).sort({'_id': 'desc'}).exec(function (err, rows) {
        res.send(rows);
    });
};

//added by jackson for public blog page
exports.getBlogWithSlug = function (req, res, next) {
    BlogBlog.findOne({slug: req.params.slug}).exec(function (err, rows) {
        res.send(rows);
    });
};

exports.get = function (req, res, next) {
    BlogBlog.findOne({_id: req.params.id}).exec(function (err, row) {
        return res.send(row);
    });
};

exports.delete = function (req, res) {
    req.body.ids = [req.params.id];
    BlogBlog.find({_id: {$in: req.body.ids}}, function (err, blogs) {
        if (err) {
            return res.status(400).send(err);
        }

        BlogPost.find({blog: {$in: req.body.ids}}).exec(function (err, posts) {
            for (var i in posts) {
                var post = posts[i];
                s3.deleteFile(post.thumbnail.filename, function (err) {
                });
                post.remove();
            }

            for (var j in blogs) {
                var blog = blogs[j];
                blog.remove();
            }
            return res.send();
        });
    });
};

function getBlog(req) {
    var deferred = Q.defer();
    if (req.body.id) {
        BlogBlog.findOne({_id: req.body.id}).exec(function (err, row) {
            if (!row) {
                return deferred.resolve(new BlogBlog());
            }
            deferred.resolve(row);
        });
    } else {
        deferred.resolve(new BlogBlog());
    }
    return deferred.promise;
}

exports.update = function (req, res) {
    var Blog = dolphin.load('blog');
    getBlog(req).then(function (row) {

        if (!req.body.title) {
            row.invalidate('title', 'Title cannot be blank');
        }
        if (!req.body.slug) {
            row.invalidate('slug', 'Slug cannot be blank');
        }

        row.title = req.body.title;
        row.slug = req.body.slug;
        row.isPublic = req.body.isPublic;
        row.isActive = req.body.isActive;
        row.categories = req.body.categories;
        row.description = req.body.description;
        row.comments = req.body.comments;
        row.commentLifespan = req.body.commentLifespan;
        row.commentsExpire = req.body.commentsExpire;
        row.save(function (err, row) {
            if (err) {
                return res.status(400).send(err);
            }
            var state = 'front.blog';
            Blog.delItemMenu(state, function () {
                var item = {
                    title: row.title,
                    state: state,
                    menu: Menu.getMainFrontMenu(),
                    roles: [],
                    params: {slug: row.slug}
                };
                if (row.isPublic && row.isActive) {
                    Blog.addItemMenu(item);
                }
                res.send(row);
            });
        });
    });
};

exports.addCategory = function (req, res) {

    console.log('tried to add category');
    if (typeof req.params.category === 'string' && req.params.category.length > 0) {
        console.log('evaluated as string, with length greater than 0');
        BlogBlog.update({_id: req.params.slug}, {$push: {categories: {text: req.params.category}}}).exec(function (err, row) {
            if (err) {
                return res.status(400).send(err);
            }
            res.send({result: 'success'});
        });
    }

};

exports.dropDown = function (req, res) {
    BlogBlog.find({}).sort({title: 1}).exec(function (err, rows) {
        res.send(rows);
    });
};

exports.uploadImage = function (req, res) {
    var message = '';
    if (!req.files || !req.files.upload || !req.files.upload.path) {
        message = 'File not found';
        return res.send('<script type="text/javascript">window.parent.CKEDITOR.tools.callFunction(' + req.query.CKEditorFuncNum + ', "", "' + message + '");</script>');
    }

    var exportFileName = req.files.upload.name;
    s3.upload(req.files.upload.path, exportFileName, true, function (amount, total) {
    }, function (err, result) {
        if (err) {
            console.error(err);
            message = err;
            return res.send('<script type="text/javascript">window.parent.CKEDITOR.tools.callFunction(' + req.query.CKEditorFuncNum + ', "", "' + message + '");</script>');
        }
        return res.send('<script type="text/javascript">window.parent.CKEDITOR.tools.callFunction(' + req.query.CKEditorFuncNum + ', "' + result.url + '", "");</script>');
    });
};
