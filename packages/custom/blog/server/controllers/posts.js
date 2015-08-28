'use strict';

/**
 * Created by Vadim on 22.09.2014.
 */
var s3 = require('../lib/localStorage');
var Q = require('q');
var fs = require('fs');
var Exift = require('../../../../../lib/exift');

var mongoose = require('mongoose');
var BlogPost = mongoose.model('BlogPost');
var BlogBlog = mongoose.model('BlogBlog');
var BlogUser = mongoose.model('User');

//mongoose.set('debug', true);
exports.list = function (req, res, next) {
    BlogBlog.findOne({slug: req.param('slug')}).exec(function (err, blog) {
        if (!blog) {
            return res.status(404).send('blog not found');
        }

        var query = {
            blog: blog._id,
            released: true
        };

        BlogPost.find(query).sort({'_id': 'desc'}).populate('user','username').exec(function (err, rows) {
            if (err) {
                return res.status(400).send(err);
            }
            var allowed = datePermittedPosts(rows);
            res.send(allowed);
        });
    });
};

//added by jackson, used to generate the links for the archive category of the blog-post.html page
exports.getMonthsOfPublicationsOfBlog = function (req, res, next) {
    var results = [];

    BlogBlog.findOne({slug: req.params.slug}).exec(function (err, blog) {
        BlogPost.find({blog: blog._id, released: true}).exec(function (err, posts) {
            posts = datePermittedPosts(posts);

            for(var i = 0; i < posts.length; i++)
            {
                var match = false;
                for (var j = 0; j < results.length; j++)
                {
                    if(results[j].month == posts[i].releaseDate.getMonth() && results[j].year == posts[i].releaseDate.getYear())
                    {
                        match = true;
                        break;
                    }
                }
                if(!match)
                {
                    results.push({month: posts[i].releaseDate.getMonth(), year: posts[i].releaseDate.getYear()});
                }
            }
            res.send(results);
        });
    });
};

exports.getCategoriesOfPostsInBlog = function (req, res, next) {
    var results = [];
    BlogBlog.findOne({slug: req.params.slug}).exec(function (err, blog) {
        BlogPost.find({blog: blog._id, released: true}).exec(function (err, posts) {
            posts = datePermittedPosts(posts);
            for(var i = 0; i < posts.length; i++)
            {
                for(var j = 0; j < posts[i].categories.length; j++)
                {
                    var match = false;
                    for (var k = 0; k < results.length; k++)
                    {
                        if(results[k] == posts[i].categories[j])
                        {
                            match = true;
                            break;
                        }
                    }
                    if(!match)
                    {
                        results.push(posts[i].categories[j]);
                    }
                }

            }
            res.send(results);
        });
    });
};

exports.getPostsOfCategory = function (req, res, next) {
    BlogBlog.findOne({slug: req.params.slug}).exec(function (err, blog) {
        BlogPost.find({blog: blog._id, released: true}).exec(function (err, posts) {
            posts = datePermittedPosts(posts);
            var listWithSame = [];
            for(var i = 0; i < posts.length; i++)
           {
               var match = false;
               for(var j = 0; j < posts[i].categories.length; j++)
               {
                   if (posts[i].categories[j] == req.params.category)
                   {
                       match = true;
                       break;
                   }
               }
               if(match)
               {
                   listWithSame.push(posts[i]);
               }
           }
            res.send(listWithSame);
        });
    });
};

exports.getPostInBlogFromSlug = function (req, res, next) {
    BlogBlog.findOne({slug: req.params.slug}).exec(function (err, blog) {
        BlogPost.findOne({blog: blog._id, released: true, slug: req.params.postslug}).populate('user', 'username').exec(function (err, post) {

            var allowedPost = datePermittedPosts([post]);
            res.send(allowedPost[0]);

        });
    });
};

function datePermittedPosts(posts){
    var newList = [];
    var curDate = Date.now();
    for(var j = 0; j < posts.length; j++)
    {
        if(posts[j].releaseDate.getTime() < curDate && posts[j].cancellationDate.getTime() > curDate)
        {
            newList.push(posts[j]);
        }
    }

    return newList;
}
//added by jackson to produce all desired posts when an archive link has been clicked
exports.PostsInBlogFromMonthAndYear =  function (req, res, next) {
    BlogBlog.findOne({slug: req.params.slug}).exec(function (err, blog) {
        BlogPost.find({blog: blog._id, released: true}).exec(function (err, posts) {
            posts = datePermittedPosts(posts);
            var results = [];
            for(var k = 0; k < posts.length; k++)
            {
                if(posts[k].releaseDate.getMonth() == req.params.month && posts[k].releaseDate.getYear() == req.params.year) {
                    results.push(posts[k]);
                }
            }
            res.send(results);
        });
    });
};

exports.searchForStringInBlog =  function (req, res, next) {
    BlogBlog.findOne({slug: req.params.slug}).exec(function (err, blog) {
        BlogPost.find({blog: blog._id, released: true}).exec(function (err, posts) {
            //now have all posts in blog
            posts = datePermittedPosts(posts);
            var target = req.params.searchstring;
            var results = [];
            for(var k = posts.length -1; k >= 0; k--)
            {
                if(posts[k].title.toLowerCase().indexOf(target.toLowerCase()) !== -1) {
                    results.push(posts[k]);
                }
            }
            for(k = posts.length -1; k >= 0; k--)
            {
                if(posts[k].content.toLowerCase().indexOf(target.toLowerCase()) !== -1) {
                    var alreadyIn = false;
                    for(var p = 0; p < results.length; p++)
                    {
                        if(results[p].slug == posts[k].slug)
                        {
                            alreadyIn = true;
                        }

                    }
                    if(!alreadyIn)
                    {results.push(posts[k]);}

                }
            }
            res.send(results);
        });
    });
};


exports.adminList = function (req, res, next) {
    if(req.user.hasRole('Editor'))
    {
        BlogPost.find({}).populate('blog').populate('user','username').sort({'_id': 'desc'}).exec(function (err, rows) {
            res.send(rows);
        });
    }
    else if(req.user.hasRole('Author') || req.user.hasRole('root'))
    {
        BlogPost.find({user: req.user}).populate('blog').populate('user','username').sort({'_id': 'desc'}).exec(function (err, rows) {
            res.send(rows);
        });
    }

};

exports.get = function (req, res, next) {
    BlogPost.findOne({_id: req.params.id}).populate('user','username').populate('blog','comments').exec(function (err, row) {
        if (row) {
            return res.send(row);
        }
        BlogPost.findOne({slug: req.params.id}).populate('user','username').populate('blog','comments').exec(function (err, row) {
            if (!row) {
                return res.status(404).send('Blog not found');
            }
            res.send(row);
        });
    });
};

exports.delete = function (req, res) {
    BlogPost.findOne({_id: req.params.id}, function (err, blog) {
        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        deleteS3File(blog.thumbnail.filename, function () {
            blog.remove(function () {
                return res.send();
            });
        });
    });
};


function getPost(req) {
    var deferred = Q.defer();
    if (req.body.id) {
        BlogPost.findOne({_id: req.body.id}).populate('user','username').populate('blog','comments').exec(function (err, row) {
            if (!row) {
                return deferred.resolve(new BlogPost());
            }
            deferred.resolve(row);
        });
    } else {
        deferred.resolve(new BlogPost());
    }
    return deferred.promise;
}

exports.getPostsForUser = function(req, res) {
    BlogUser.findOne({_id: req.params.user});
};

exports.update = function (req, res) {
    var file = req.files && req.files.file ? req.files.file.path : null;
    getPost(req).then(function (row) {
        validateFile(file, function (err) {
            if (file && err) {
                row.invalidate('thumbnail', 'File is not a image');
            }
            console.log(req.body);
            row.title = req.body.title;
            row.slug = req.body.slug;
            row.blog = req.body.blog;
            row.annonce = req.body.annonce;
            row.tags = JSON.parse(req.body.tags);
            row.keywords = JSON.parse(req.body.keywords);
            row.content = req.body.content;
            row.released = req.body.released;
            row.comments = req.body.comments;
            row.user = req.user.id;
            row.description = req.body.description;
            row.categories = JSON.parse(req.body.categories);
            row.releaseDate = new Date(req.body.releaseDate);
            row.created = new Date(Date.now());
            if(req.body.cancellationDate){
                row.cancellationDate = new Date(req.body.cancellationDate);
            }
            else row.cancellationDate = new Date(2099,1,1,0,0,0);


            row.save(function (err, row) {
                if (err) {
                    deleteFile(file);
                    return res.status(400).send(err);
                }

                if (!file) {
                    return res.send(row);
                }

                deleteS3File(row.thumbnail.filename, function () {
                    var exportFileName = 'blog/images/' + req.files.file.name;
                    s3.upload(req.files.file.path, exportFileName, true, function (amount, total) {
                    }, function (err, result) {
                        console.log(err);
                        if (err) {
                            row.invalidate('thumbnail', 'Export failed');
                            return row.validate(function (err) {
                                res.status(400).send(err);
                            });
                        }
                        row.thumbnail.filename = exportFileName;
                        row.thumbnail.fileURL = result.url;
                        row.save(function (err, row) {
                            if (err) {
                                return res.status(400).send(err);
                            }
                            res.send(row);
                        });
                    });
                });
            });
        });
    });
};

function deleteFile(file) {
    if (!fs.existsSync(file)) {
        return;
    }
    fs.unlinkSync(file);
}

function deleteS3File(fileName, callback) {
    s3.deleteFile(fileName, callback);
}

function validateFile(file, callback) {
    if (!file) {
        return callback('File doesn\'t exists');
    }
    var exift = new Exift();
    exift.readData(file, function (err, metadata) {
        if (err) {
            return callback(err);
        }
        if (metadata.MIMEType.indexOf('image/jpeg') >= 0 || metadata.MIMEType.indexOf('image/jpg') >= 0 || metadata.MIMEType.indexOf('image/png') >= 0) {
            return callback(null, 'image');
        }
        return callback('A bad file', null);
    });
}

exports.uploadImage = function (req, res) {
    var message = '';
    if (!req.files || !req.files.upload || !req.files.upload.path) {
        message = 'File not found';
        return res.send('<script type="text/javascript">window.parent.CKEDITOR.tools.callFunction(' + req.query.CKEditorFuncNum + ', "", "' + message + '");</script>');
    }
    var exportFileName = 'blog/images/' + req.files.upload.name;
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

