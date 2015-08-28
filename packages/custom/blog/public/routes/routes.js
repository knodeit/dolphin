'use strict';

angular.module('dolphin.blog').config(['$stateProvider',
    function ($stateProvider) {

        /*var getVideo = function ($q, $timeout, $http, $location, $state, $stateParams) {
         if (!$stateParams.id) {
         return null;
         }
         var deferred = $q.defer();
         $http.get('/blog/dashboard/video/get', {
         params: {
         id: $stateParams.id
         }
         }).success(function (video) {
         deferred.resolve(video);
         }).error(function (err) {
         deferred.reject(null);
         $state.go('dashboard.home');
         });
         return deferred.promise;
         };*/

        var getPost = function ($q, $timeout, $http, $location, $state, $stateParams) {
            if (!$stateParams.id) {
                return null;
            }

            var deferred = $q.defer();
            $http.get('/api/posts/' + $stateParams.id).success(function (res) {
                deferred.resolve(res);
            }).error(function (err) {
                deferred.resolve(null);
            });
            return deferred.promise;
        };

        /*var getPostBySlug = function ($q, $timeout, $http, $location, $state, $stateParams) {
         if (!$stateParams.postslug) {
         return null;
         }
         var deferred = $q.defer();
         $http.get('/blog-home/post/get', {
         params: {
         slug: $stateParams.postslug
         }
         }).success(function (blog) {
         deferred.resolve(blog);
         }).error(function (err) {
         deferred.reject(null);
         $state.go('home');
         });
         return deferred.promise;
         };*/

        var getBlog = function ($q, $timeout, $http, $location, $state, $stateParams) {
            if (!$stateParams.id) {
                return null;
            }
            var deferred = $q.defer();
            $http.get('/api/blogs/' + $stateParams.id, {}).success(function (res) {
                deferred.resolve(res);
            }).error(function (err) {
                deferred.resolve(null);
            });
            return deferred.promise;
        };

        var getBlogs = function ($q, $timeout, $http, $location, $state, $stateParams) {
            var deferred = $q.defer();
            $http.get('/api/blogs/dropdown', {
                params: {}
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function (err) {
                deferred.reject([]);
            });
            return deferred.promise;
        };

        $stateProvider
            .state('dashboard.blog', {
                abstract: true,
                template: '<ui-view>',
                url: '/blog',
                ncyBreadcrumb: {
                    skip: true
                }
            })
            //posts
            .state('dashboard.blog.posts', {
                url: '/posts',
                templateUrl: '/blog/views/dashboard/posts/list.html',
                controller: 'BlogPostController',
                ncyBreadcrumb: {
                    label: 'Posts'
                },
                pageSettings: {
                    h1: 'Posts'
                }
            })
            .state('dashboard.blog.posts.form', {
                url: '/form/:id',
                templateUrl: '/blog/views/dashboard/posts/form.html',
                resolve: {
                    post: getPost,
                    blogs: getBlogs
                },
                controller: 'BlogPostFormController',
                ncyBreadcrumb: {
                    parent: 'dashboard.blog.posts',
                    label: 'Post'
                }
            })
            //blogs
            .state('dashboard.blog.blogs', {
                url: '/blogs',
                templateUrl: '/blog/views/dashboard/blogs/list.html',
                controller: 'BlogHomeCategoriesAdminController',
                ncyBreadcrumb: {
                    parent: 'dashboard.blog.posts',
                    label: 'Blogs'
                },
                pageSettings: {
                    h1: 'Blogs'
                }
            })
            .state('dashboard.blog.blogs.form', {
                url: '/form/:id',
                templateUrl: 'blog/views/dashboard/blogs/form.html',
                resolve: {
                    blog: getBlog
                },
                controller: 'BlogHomeCategoriesAdminFormController',
                pageSettings: {
                    h1: 'Blog'
                }
            })
            .state('dashboard.blog.video', {
                url: '/video',
                templateUrl: 'blog/views/dashboard/video/list.html',
                controller: 'VideoController',
                ncyBreadcrumb: {
                    parent: 'dashboard.blog.posts',
                    label: 'Videos'
                },
                pageSettings: {
                    h1: 'Videos'
                }
            }).state('dashboard.blog.video.edit', {
                url: '/edit/:id',
                templateUrl: 'blog/views/dashboard/video/form.html',
                resolve: {
                    video: function ($stateParams, Video) {
                        if ($stateParams.id) {
                            return Video.get({id: $stateParams.id});
                        }
                        return null;
                    }
                },
                controller: 'VideoFormController',
                ncyBreadcrumb: {
                    parent: 'dashboard.blog.video',
                    label: 'Video'
                },
                pageSettings: {
                    h1: 'Video'
                }
            })
            .state('front.blog', {
                url: '/blog/:slug',
                templateUrl: 'blog/views/front/bloghome.html',
                controller: 'FrontBlogController'
            })
            .state('front.postslug', {
                url: '/blog/:slug/:postslug',
                templateUrl: 'blog/views/front/blog-post.html',
                controller: 'FrontBlogController'
            })
            .state('front.posts-from-month', {
                url: '/blog/:slug/archive/monthly/:year/:month',
                templateUrl: 'blog/views/front/blog-archive.html',
                controller: 'FrontBlogController'
            })
            .state('front.posts-from-category', {
                url: '/blog/:slug/archive/category/:category',
                templateUrl: 'blog/views/front/blog-archive.html',
                controller: 'FrontBlogController'
            })
            .state('front.searching', {
                url: '/blog/:slug/search/:searchstring',
                templateUrl: 'blog/views/front/blog-archive.html',
                controller: 'FrontBlogController'
            })
            ;
    }
]);
