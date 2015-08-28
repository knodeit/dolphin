'use strict';

var postsCtrl = require('../controllers/posts');
var blogsCtrl = require('../controllers/blogs');
var videosCtrl = require('../controllers/videos');
var commentsCtrl = require('../controllers/comments');

// The Package is past automatically as first parameter
module.exports = function (BlogHome, app, auth, database) {

    app.get('/api/posts', postsCtrl.adminList);
    //added by jackson, :user should be the _id of the user
    app.get('/api/posts/based/on/user/:user', postsCtrl.getPostsForUser);
    app.get('/api/posts/:id', postsCtrl.get);
    app.post('/api/posts', auth.requiresAdmin, postsCtrl.update);
    app.delete('/api/posts/:id', auth.requiresAdmin, postsCtrl.delete);


    //added by jackson
    //':slug' refers to the slug of the blog
    app.get('/api/blog/posts/:slug', postsCtrl.list);
    app.get('/api/blog/get/:slug', blogsCtrl.getBlogWithSlug);
    app.get('/api/blog/getmonths/:slug', postsCtrl.getMonthsOfPublicationsOfBlog);
    app.get('/api/blog/getposts/fromdate/:slug/:month/:year', postsCtrl.PostsInBlogFromMonthAndYear);
    app.get('/api/blog/getpost/:slug/:postslug', postsCtrl.getPostInBlogFromSlug);
    app.get('/api/blog/getCategories/:slug', postsCtrl.getCategoriesOfPostsInBlog);
    app.get('/api/blog/getPostsOfCategory/:slug/:category', postsCtrl.getPostsOfCategory);
    app.get('/api/blog/search/:slug/:searchstring', postsCtrl.searchForStringInBlog);
    app.post('/api/blog/add/category/:slug/:category', blogsCtrl.addCategory);
    app.post('/api/blog/ck/uploads', auth.requiresAdmin, blogsCtrl.uploadImage);

    app.post('/api/add/comment', commentsCtrl.updateComment);
    app.get('/api/comments/of/post', commentsCtrl.listComments);
    app.delete('/api/delete/comment', auth.requiresAdmin, commentsCtrl.delete);
    //front
    app.get('/front/blog/posts', postsCtrl.list);
    app.get('/front/blog/post/:id', postsCtrl.get);

    app.post('/blog/image/upload', auth.requiresAdmin, postsCtrl.uploadImage);

    app.get('/api/blogs', blogsCtrl.list);
    app.get('/api/blogs/dropdown', blogsCtrl.dropDown);
    app.get('/api/blogs/:id', blogsCtrl.get);
    app.post('/api/blogs', auth.requiresAdmin, blogsCtrl.update);
    app.delete('/api/blogs/:id', auth.requiresAdmin, blogsCtrl.delete);

    //front
    app.get('/front/blogs/dropdown', blogsCtrl.dropDown);

    app.get('/api/blog/video/dropdown', auth.requiresAdmin, videosCtrl.dropDown);
    app.get('/api/video', videosCtrl.list);
    app.get('/api/video/:id', videosCtrl.get);
    app.post('/api/video', auth.requiresAdmin, videosCtrl.update);
    app.delete('/api/video/:id', auth.requiresAdmin, videosCtrl.delete);
    app.post('/api/video/get', auth.requiresAdmin, videosCtrl.getAll);

    app.get('/blog/player/:id/:width/:height', function (req, res) {
        videosCtrl.player(BlogHome, req, res);
    });
};
