'use strict';

angular.module('dolphin.blog').controller('BlogPostController', ['$scope', 'Global', '$state', 'Post', '$http', '$timeout', '$modal', '$location',
    function ($scope, Global, $state, Post, $http, $timeout, $modal, $location) {
        $scope.global = Global;
        $scope.package = {
            name: 'blog-home'
        };

        $scope.initPage = function () {
            $scope.rows = Post.query();
            $scope.isPublic = function (post) {
                return post.released && new Date(post.releaseDate).getTime() < Date.now() && new Date(post.cancellationDate).getTime() > Date.now();
            };
        };
        $scope.initPage();

        $scope.delete = function (row) {
            if (!confirm('Really delete this?')) {
                return;
            }

            row.$delete(function () {
                $scope.initPage();
            });
        };

        $scope.edit = function (id) {
            $state.go('dashboard.blog.posts.form', {id: id});
        };

        $scope.videos = function () {
            $state.go('dashboard.blog.video');
        };

        $scope.blogs = function () {
            $state.go('dashboard.blog.blogs');
        };

        $scope.imageShow = function (url) {
            $.fancybox.open(url);
        };
    }
]);
angular.module('dolphin.blog').controller('BlogPostFormController', ['$scope', 'Global', '$state', 'Upload', '$http', 'post', 'blogs',
    function ($scope, Global, $state, Upload, $http, post, blogs) {
        $scope.global = Global;
        $scope.form = {};
        $scope.form.tags = [];
        $scope.form.keywords = [];
        $scope.form.blogs = blogs;
        $scope.allowComments = true;
        $scope.slugDefault = 'Custom';
        $scope.slugDefaultOptions = ['SEO name', 'Month, Day and name', 'Month and name', 'ID', 'Full name', 'Custom'];

        //these are used for updating categories
        //namesOfSelected is the string rep. of which categories have been selected. This is pushed to db
        $scope.namesOfSelectedCategories = [];

        //this is a list of bools that corrispond to the selected categories (Elements matching with the below $scope.categories)
        //it is used to generate a list of names of Selected categories, and it ng-modeled to checkboxes
        $scope.form.selectedCategories = [];

        //categories is all possible categories
        $scope.categories = [];

        $scope.newCategory = '';

        $scope.addCategory = function () {
            if ($scope.newCategory !== '') {
                $http.post('/api/blog/add/category/' + $scope.form.blog + '/' + $scope.newCategory).success(function (result) {
                    $scope.categories.push($scope.newCategory);
                    $scope.newCategory = '';
                });

            }
        };

        function convertBoolListToStringsForCategories() {

            $scope.namesOfSelectedCategories = [];
            for (var i = 0; i < $scope.form.selectedCategories.length; i++) {
                if ($scope.form.selectedCategories[i]) {
                    $scope.namesOfSelectedCategories.push($scope.categories[i]);
                }
            }
        }

        function convertStringsToBoolListForCategories() {
            $scope.form.selectedCategories = [];
            for (var i = 0; i < $scope.categories.length; i++) {
                $scope.form.selectedCategories.push(false);
                for (var j = 0; j < $scope.namesOfSelectedCategories.length; j++) {
                    if ($scope.categories[i] === $scope.namesOfSelectedCategories[j]) {
                        $scope.form.selectedCategories[i] = true;
                        break;
                    }
                }
            }


        }


        $scope.updateOptionsCauseBlogChanged = function () {
            $http.get('/api/blogs/' + $scope.form.blog).then(function (result) {
                $scope.categories = [];
                for (var j = 0; j < result.data.categories.length; j++) {
                    $scope.categories.push(result.data.categories[j].text);
                }

                if (post && post.blog == $scope.form.blog) {
                    $scope.namesOfSelectedCategories = post.categories;
                }
                convertStringsToBoolListForCategories();

            });
        };

        if (post) {
            $scope.form.id = post._id;
            $scope.form.title = post.title;
            $scope.form.blog = post.blog._id;
            $scope.form.slug = post.slug;
            $scope.form.annonce = post.annonce;
            $scope.form.description = post.description || '';
            console.log('the field of post.blog is: ');
            console.log(post.blog);
            console.log(post.blog.comments);
            if(post.comments  === undefined)
            {
                $scope.allowComments = post.blog.comments;
            }
            else
            {
                $scope.allowComments = post.comments;
            }

            $scope.namesOfSelectedCategories = post.categories;
            if (new Date(post.releaseDate) == new Date(0)) {
                var cur = Date.now();
                $scope.form.releaseDate = new Date(cur.getYear() + 1900, cur.getMonth() + 1, cur.getUTCDate(), 0, 0, 0);
            }
            else {
                $scope.form.releaseDate = new Date(post.releaseDate);
            }
            if (new Date(post.cancellationDate).toDateString() != new Date(2099, 1, 1, 0, 0, 0).toDateString()) {
                $scope.publishEnding = true;
                $scope.form.cancellationDate = new Date(post.cancellationDate);
            }
            else {
                $scope.publishEnding = false;
            }

            for (var i in post.tags) {
                $scope.form.tags.push({
                    text: post.tags[i]
                });
            }
            for (i in post.keywords) {
                $scope.form.keywords.push({
                    text: post.keywords[i]
                });
            }
            $scope.form.content = post.content;
            $scope.form.released = post.released;
            $scope.updateOptionsCauseBlogChanged();
        }

        $scope.submit = function () {
            $scope.errors = {};
            var tags = [];
            var keywords = [];
            for (var i in $scope.form.tags) {
                tags.push($scope.form.tags[i].text);
            }
            for (i in $scope.form.keywords) {
                keywords.push($scope.form.keywords[i].text);
            }

            convertBoolListToStringsForCategories();
            $scope.params = {
                url: '/api/posts',
                method: 'POST',
                file: $scope.form.thumbnail,
                fields: {}
            };
            if ($scope.form.id) {
                $scope.params.fields.id = $scope.form.id;
            }
            if ($scope.form.slug) {
                $scope.params.fields.slug = $scope.form.slug;
            }
            if ($scope.form.blog) {
                $scope.params.fields.blog = $scope.form.blog;
            }
            if ($scope.form.title) {
                $scope.params.fields.title = $scope.form.title;
            }
            if ($scope.form.annonce) {
                $scope.params.fields.annonce = $scope.form.annonce;
            }
            if ($scope.form.content) {
                $scope.params.fields.content = $scope.form.content;
            }
            if ($scope.form.released) {
                $scope.params.fields.released = $scope.form.released;
            }
            if ($scope.namesOfSelectedCategories) {
                $scope.params.fields.categories = $scope.namesOfSelectedCategories;
            }
            if ($scope.form.description) {
                $scope.params.fields.description = $scope.form.description;
            }
            if ($scope.publishEnding && $scope.form.cancellationDate) {
                $scope.params.fields.cancellationDate = $scope.form.cancellationDate.toString();
            }
            if ($scope.form.releaseDate) {
                var cur = $scope.form.releaseDate;
                $scope.params.fields.releaseDate = new Date(cur.getYear() + 1900, cur.getMonth(), cur.getUTCDate(), 0, 0, 0, 0).toString();
            }
                $scope.params.fields.comments = $scope.allowComments;


            $scope.params.fields.tags = tags;
            $scope.params.fields.keywords = keywords;

            Upload.upload($scope.params).progress(function (evt) {
                if ($scope.form.thumbnail && evt) {
                    $scope.percent = Math.ceil((100 * evt.loaded) / evt.totalSize);
                }
            }).success(function (data, status, jobid, jobstatus, etag) {
                $scope.percent = 0;
                $state.forceReload('^');
            }).error(function (err) {
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
        };

        /* jshint ignore:start */
        CKEDITOR.plugins.addExternal('iframe', '/blog/assets/js/ckeditor/iframe/', 'plugin.js');
        /* jshint ignore:end */

        $scope.editorOptions = {
            language: 'en',
            filebrowserUploadUrl: '/api/blog/ck/uploads',
            extraPlugins: 'iframe',
            skin: 'kama',
            toolbar: 'full',
            toolbar_full: [
                {
                    name: 'basicstyles',
                    items: ['Bold', 'Italic', 'Strike', 'Underline']
                },
                {name: 'paragraph', items: ['BulletedList', 'NumberedList', 'Blockquote']},
                {name: 'editing', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
                {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
                {name: 'tools', items: ['SpellChecker', 'Maximize']},
                '/',
                {name: 'styles', items: ['Format', 'FontSize', 'TextColor', 'PasteText', 'PasteFromWord', 'RemoveFormat']},
                {name: 'insert', items: ['Image', 'Table', 'SpecialChar', 'Iframe']},
                {name: 'forms', items: ['Outdent', 'Indent']},
                {name: 'clipboard', items: ['Undo', 'Redo']},
                {name: 'document', items: ['PageBreak', 'Source']}
            ]
        };

        var hyphenate = function (startingName) {
            return startingName.replace(/\s/g, '-').toLowerCase();
        };

        var crunchTitle = function (startingName) {
            var pointlessWords = ['a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'];
            var lowerName = startingName.toLowerCase();
            if (lowerName.includes(' ')) {
                for (var i = 0; i < pointlessWords.length; i++) {
                    var re = new RegExp(' ' + pointlessWords[i] + ' ', 'g');
                    lowerName = lowerName.replace(re, ' ');
                }
                var firstWord = lowerName.substr(0, lowerName.indexOf(' '));
                //tests first word
                if (firstWord) {
                    for (var j = 0; j < pointlessWords.length; j++) {
                        if (firstWord.includes(pointlessWords[j])) {
                            lowerName = lowerName.substr(firstWord.length + 1);
                            break;
                        }
                    }
                }
                var lastWord = lowerName.substr(lowerName.lastIndexOf(' ') + 1);
                if (lastWord) {
                    //test last word
                    for (var k = 0; k < pointlessWords.length; k++) {
                        if (lastWord.includes(pointlessWords[k])) {
                            lowerName = lowerName.substr(0, lowerName.lastIndexOf(' '));
                            break;
                        }
                    }
                }
            }

            return hyphenate(lowerName);
        };


        $scope.slugMaker = function (typeOfSlug) {

            var formattedName = hyphenate($scope.form.title);
            var newName = $scope.form.slug;

            if (typeOfSlug === 'Month, Day and name' || typeOfSlug === 'Month and name') {
                var monthNames = [
                    'Jan', 'Feb', 'Mar',
                    'Apr', 'May', 'June', 'July',
                    'Aug', 'Sept', 'Oct',
                    'Nov', 'Dec'
                ];
                var originalDate = new Date();
                var month = monthNames[originalDate.getMonth()];
                var day = originalDate.getDate();
                if (typeOfSlug === 'Month, Day and name') {
                    newName = month + '/' + day + '/' + formattedName;
                }
                else if (typeOfSlug === 'Month and name') {
                    newName = month + '/' + formattedName;
                }

            }

            else if (typeOfSlug === 'SEO name') {
                newName = crunchTitle($scope.form.title);
                if (newName.length === 0) {
                    //if title is all meaningless words, will default to full name, formatted with hyphens
                    newName = formattedName;
                }
            }
            else if (typeOfSlug === 'ID') {
                newName = 'archive/' + $scope.form.id;
            }
            else if (typeOfSlug === 'Full name') {
                newName = formattedName;
            }
            $scope.form.slug = newName;
        };
    }
]);

