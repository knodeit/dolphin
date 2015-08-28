'use strict';

angular.module('dolphin.blog').controller('BlogHomeCategoriesAdminController', ['$scope', 'Global', '$state', 'Blog',
    function ($scope, Global, $state, Blog) {
        $scope.global = Global;

        $scope.initPage = function () {
            $scope.rows = Blog.query();

        };
        $scope.initPage();

        /*$scope.rows = [];
         $scope.ids = [];
         $scope.currentPage = 1;
         $scope.maxSize = 5;
         $scope.itemsPerPage = 15;
         $scope.totalPages = 1;

         $scope.list = function () {
         $scope.pageChanged();
         };

         $scope.pageChanged = function () {
         $http.get('/api/blogs', {
         params: {
         page: $scope.currentPage,
         itemsPerPage: $scope.itemsPerPage
         }
         }).success(function (data) {
         $scope.rows = [];
         $scope.totalItems = data.count;
         $scope.totalPages = data.totalPages === 0 ? 1 : data.totalPages;
         $scope.rows = data.rows;
         }).error(function (err) {
         console.log(err);
         });
         };
         $scope.pageChanged();

         $scope.checkAll = function () {
         if ($scope.checkboxAll) {
         for (var i in $scope.rows) {
         $scope.ids.push($scope.rows[i]._id);
         }
         } else {
         $scope.ids.splice(0, $scope.ids.length);
         }
         };
         $scope.deleteAll = function () {
         if (!confirm('Are you sure?')) {
         return;
         }
         //grid
         $http.post('/blog-home/dashboard/blogs/delete', {ids: $scope.ids}).success(function (data) {
         $scope.list();
         $scope.ids.splice(0, $scope.ids.length);
         $scope.checkboxAll = false;
         }).error(function (err) {
         console.log(err);
         });
         };*/

        $scope.edit = function (id) {
            $state.go('dashboard.blog.blogs.form', {id: id});
        };

        $scope.delete = function (row) {
            if (!confirm('Really delete this?')) {
                return;
            }

            row.$delete(function () {
                $scope.initPage();
            });
        };
    }
]);
angular.module('dolphin.blog').controller('BlogHomeCategoriesAdminFormController', ['$scope', 'Global', '$state', '$http', 'blog',
    function ($scope, Global, $state, $http, blog) {
        $scope.global = Global;
        $scope.form = {};
        $scope.form.authors = [];
        $scope.form.isPublic = true;
        $scope.form.isActive = true;
        $scope.form.categories = [];
        $scope.form.allowComments = true;


        if (blog) {
            $scope.form.id = blog._id;
            $scope.form.title = blog.title;
            $scope.form.slug = blog.slug;
            $scope.form.isPublic = blog.isPublic;
            $scope.form.isActive = blog.isActive;
            $scope.form.authors = blog.authors;
            $scope.form.categories = blog.categories;
            $scope.form.description = blog.description;
            $scope.form.allowComments = blog.comments;
            $scope.form.commentLifespan = blog.commentLifespan;
            $scope.form.commentsExpire = blog.commentsExpire;
        }

        $scope.submit = function () {
            $scope.errors = {};
            console.log('submitting: ');
            console.log($scope.form);

       /* for(var l = 0; l < $scope.form.authors.length; l++)
        {
            console.log('This is what\'s in thumbnail: ' + $scope.form.authors[l].thumbnail);
            $scope.params = {};
            $scope.params = {
                url:'/api/blogs',

                fields: {
                    id: $scope.form.id,
                    title: $scope.form.title,
                    slug: $scope.form.slug,
                    isPublic: $scope.form.isPublic,
                    isActive: $scope.form.isActive,
                    description: $scope.form.description,
                    categories: $scope.form.categories,
                    authors: $scope.form.authors
                },
                method: 'POST',
                //file: $scope.form.authors[l].thumbnail

            };

            console.log($scope.params.file);

            $upload.upload($scope.params).progress(function (evt) {
                if ($scope.params.file.thumbnail && evt) {
                    console.log('everything checks out');
                    $scope.percent = Math.ceil((100 * evt.loaded) / evt.total);
                }
            }).success(function (data, status, jobid, jobstatus, etag) {
                $scope.percent = 0;
                $state.forceReload('^');
                console.log('everything checked Out And it uploaded');
            }).error(function (err) {
                console.log('there was an error');
                $scope.percent = 0;
                if (err.errors) {
                    for (var index in err.errors) {
                        if (!err.errors[index].path) {
                            continue;
                        }
                        $scope.errors[err.errors[index].path] = err.errors[index].message;
                    }
                } else {
                    $scope.errors.global = 'Mongo validation error';
                }
            });


        }*/



            $http.post('/api/blogs', {
                id: $scope.form.id,
                title: $scope.form.title,
                slug: $scope.form.slug,
                isPublic: $scope.form.isPublic,
                isActive: $scope.form.isActive,
                description: $scope.form.description,
                categories: $scope.form.categories,
                authors: $scope.form.authors,
                comments: $scope.form.allowComments,
                commentLifespan: $scope.form.commentLifespan,
                commentsExpire: $scope.form.commentsExpire,
            }).success(function (data) {
                console.log(data);
                $state.forceReload('^');
            }).error(function (err) {
                if (err.errors) {
                    for (var index in err.errors) {
                        if (!err.errors[index].path) {
                            continue;
                        }
                        $scope.errors[err.errors[index].path] = err.errors[index].message;
                    }
                }
            });
        };

        $scope.toBeAddedAuthor = {};
        $scope.addAuthor = function () {
            console.log('got in the add Author Function');
            if($scope.toBeAddedAuthor.name !== undefined && $scope.toBeAddedAuthor.bio !== undefined)
            $scope.form.authors.push({name: $scope.toBeAddedAuthor.name.toString(), bio: $scope.toBeAddedAuthor.bio.toString(), thumbnail: $scope.toBeAddedAuthor.thumbnail});
            $scope.toBeAddedAuthor = {};

        };
    }

]);

