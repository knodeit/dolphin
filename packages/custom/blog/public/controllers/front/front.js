'use strict';

angular.module('dolphin.blog').controller('FrontBlogController', ['$scope', '$state', '$stateParams', '$http', 'Global', '$compile', '$location', '$rootScope', '$timeout', '$window', 'Facebook',
    function ($scope, $state, $stateParams, $http, Global, $compile, $location, $rootScope, $timeout, $window, Facebook) {

        console.log(Facebook);
        $scope.slug = $stateParams.slug;
        $scope.generatedLists = [];
        $scope.loggedIn = Global.user;
        $scope.isAdmin = false;
        var adminRoles = ['root', 'admin'];
        if($scope.loggedIn)
        {
            console.log('evaluated as logged in');
           for(var k = 0; k < adminRoles.length; k++)
           {console.log('gets this: ' + Global.user.roles.indexOf(adminRoles[k]));
               if(Global.user.roles.indexOf(adminRoles[k]) !== -1)
               {
                   $scope.isAdmin = true;
                   break;
               }
           }//{}
        }
        console.log(Global.user);
        //if already has meta stuff appended from previous page, causes those to be removed.
        var head = angular.element(document.querySelector('head'));
        var numOfChildren = head[0].childNodes.length;
        var numOfMetaAppended = 3;
        if(head[0].childNodes[numOfChildren - numOfMetaAppended].localName === 'meta')
        {
            for(var q = numOfMetaAppended; q > 0; q--)
            {
                head[0].removeChild(head[0].childNodes[numOfChildren - numOfMetaAppended]);
            }
        }

        //This adds method calls that need to take place to an array, that all get executed once they're ready.
        $scope.generateMethod = function(targetFunction, theParameters){
            var testThing = {theFunction: targetFunction, parameters: theParameters};
            var match = false;
            for(var q = 0; q < $scope.generatedLists.length; q++)
            {
                if($scope.generatedLists[q].parameters.name === testThing.parameters.name)
                {match = true; break;}
            }
            if(!match)
            {$scope.generatedLists.push(testThing);}

        };

        function getComments(){
            $http.get('/api/comments/of/post', {
                params: {
                    post: $scope.mainPost._id
                }
            }).success(function (res) {
                res.row.splice(0,1);
                $scope.comments = res.row;
                $scope.commentToReply = undefined;
                $scope.form.commentcontent = '';
                //console.log('finished getting the comments');


            }).error(function (err) {
                console.log('error getting comments');
            });
        }

        $http.get('/api/blog/get/' + $scope.slug).then(function(result){
            $scope.blogData = result.data;
        });

        if($stateParams.postslug !== undefined)
        //MEANS IS LOOKING AT A PARTICULAR BLOG
        {

            $scope.thisPost = $stateParams.postslug;
            $http.get('/api/blog/getpost/'+ $scope.slug + '/' + $scope.thisPost).then(function(result){
                $scope.mainPost = result.data;
                $scope.currentPath = $location.path();


                //console.log($scope.mainPost);
                $scope.form = [];
                getComments();

                //console.log(Global);

                $scope.submit = function(targetComment){
                    var parent;

                    if(targetComment)
                    {
                        parent = targetComment.content._id;
                    }

                    console.log($scope.form.commentcontent);
                    console.log('tried to submit');
                    if($scope.FBinfo && !$scope.loggedIn)
                    {
                        $scope.form.commentName = $scope.FBinfo.first_name;
                        $scope.form.commentEmail = $scope.FBinfo.email;
                    }
                    $http.post('api/add/comment', {

                            post: $scope.mainPost._id,
                            content: $scope.form.commentcontent,
                            parent:parent,
                            name: $scope.form.commentName,
                            email: $scope.form.commentEmail

                    }).success(function (res) {
                        console.log(res);
                        getComments();
                    }).error(function (err) {
                        console.log('error getting comments');
                    });
                };

                var metaTitle = $scope.mainPost.title;
                var metaImage = '';
                if($scope.mainPost.thumbnail)
                    metaImage = $scope.mainPost.thumbnail.fileURL;
                var metaDescription = $scope.mainPost.description;
                head.append('<meta property="og:title" content="'+ metaTitle +'"/>' +
                    '<meta property="og:description" content="'+ metaDescription +'"/>' +
                    '<meta property="og:image" content="'+ metaImage +'"/>');

            });

        }

        $scope.delete = function(thing){
            $http.delete('api/delete/comment', {
                params: {id: thing.content._id}
            }).success(function (res) {
                console.log(res);
                getComments();
            }).error(function (err) {
                console.log('error getting comments');
            });
        };

        $http.get('/api/blog/getmonths/'+ $scope.slug).then(function(result){
            $scope.monthsPublished = result.data;
            $scope.monthsPublished.sort(function(a,b){
                //sorts months in descending order... weird comparison, I know, but it works.
                return ((b.year+1) * 365 - (11- b.month)*30)-((a.year+1) * 365 - (11- a.month)*30);
            });
        });

        $http.get('/api/blog/getCategories/'+ $scope.slug).then(function(result){
            $scope.categoriesPublished = result.data;
        });

        $scope.numToMonth = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        $scope.shouldShowContinueReading = [];

        if($stateParams.month !== undefined)//MEANS IS LOOKING AT Month ARCHIVE
        {
            $scope.theMonth = $stateParams.month;
            $scope.theYear = $stateParams.year;
            $http.get('/api/blog/getposts/fromdate/' + $scope.slug +'/'+ $scope.theMonth + '/'+($scope.theYear-1900)).then(function(result){
                $scope.postsInArchive = result.data;
                for(var p = 0; p < $scope.postsInArchive.length; p++)
                {
                    $scope.shouldShowContinueReading.push(false);//initilizes all to false to be used below
                }
                doFunctionQueue();
            });




            $scope.theHeading = '<h4 class="archive-label">MONTHLY ARCHIVE: ' + ($scope.numToMonth[$scope.theMonth]).toUpperCase() + ' ' +  $scope.theYear + '</h4>';
        }


        if ($stateParams.category !== undefined )
        {
            $scope.theCategory = $stateParams.category;
            $http.get('/api/blog/getPostsOfCategory/'+ $scope.slug +'/'+ $scope.theCategory).then(function(result){
                $scope.postsInArchive = result.data;
                for(var p = 0; p < $scope.postsInArchive.length; p++)
                {
                    $scope.shouldShowContinueReading.push(false);//initilizes all to false to be used below
                }
                doFunctionQueue();
            });
            $scope.theHeading = '<h4 class="archive-label">CATEGORY ARCHIVES: ' + $scope.theCategory.toUpperCase() + '</h4>';
        }

        $scope.searchTerm = '';
        $scope.noSearchResults = false;

        if ($stateParams.searchstring !== undefined )
        {

            $scope.searchstring = $stateParams.searchstring;
            $scope.searchTerm = $scope.searchstring;
            $scope.theHeading = '<h3>Nothing Found</h3><div>Sorry, but nothing matched your search criteria. Please try again with some different keywords.</div> ';
            $scope.noSearchResults= true;
            $http.get('/api/blog/search/'+ $scope.slug +'/'+ $scope.searchstring).then(function(result){
                $scope.postsInArchive = result.data;
                for(var p = 0; p < $scope.postsInArchive.length; p++)
                {
                    $scope.shouldShowContinueReading.push(false);//initilizes all to false to be used below
                }
                if($scope.postsInArchive.length > 0)
                {
                    $scope.theHeading = '<h4 class="archive-label">SEARCH ARCHIVES: ' + $scope.searchstring.toUpperCase() + '</h4>';
                    $scope.noSearchResults = false;
                }
                doFunctionQueue();
            });



        }

        $scope.groupPosts = function(params) {
            var result =[];
            var numInGroups = params.number;
            var originalList = $scope[params.originalList];
            var newName = params.name;
            for(var k=0; k < originalList.length; k+=numInGroups)
            {
                var group = [];
                for(var j=0; j < numInGroups; j++)
                {
                    if(originalList.length > k+j)
                    {
                        group.push(originalList[k+j]);
                    }
                }
                result.push(group);
            }
            $scope[newName] = result;
            console.log($scope[newName]);

        };

        function doFunctionQueue()
        {
            for(var p = 0; p < $scope.generatedLists.length; p++)
            {
                var target = $scope.generatedLists[p];
                var params = target.parameters;
                $scope[target.theFunction](params);
            }
        }




        $scope.previewOfBlog = function (original, num) {
            //pass in the content of a blog, and it generates a preview
            if(original.length < 600)
            {
                return original;
                //is short enough to show, so shouldShowContinueReading (above) stays false
            }
            else{
                $scope.shouldShowContinueReading[num] = true;
                if(original.indexOf('</p>') > 500)
                {//first paragraph is enough of summary

                    return original.substr(0,original.indexOf('</p>'))  + '...</p>';

                }
                else
                {
                    //end summary after second paragraph
                    return original.substr(0,original.indexOf('</p>',original.indexOf('</p>') + 4))  + '...</p>';

                }
            }
        };

        $http.get('/api/blog/posts/' + $scope.slug).then(function(result){
            $scope.posts = result.data.sort(function(a, b) {
                //insures it's in descending order of published date
                return new Date(b.releaseDate) - new Date(a.releaseDate);
            });
        });

        $scope.imageShow = function (url) {
            $.fancybox.open(url);
        };

        $scope.replyTo = function(theComment) {
            $scope.commentToReply = theComment;
            console.log($scope.commentToReply);
        };




    //FACEBOOK STUFF

        $scope.loginStatus = 'disconnected';
        $scope.facebookIsReady = false;
        $scope.user = null;
        $scope.login = function () {
            Facebook.login(function(response) {
                $scope.loginStatus = response.status;
                console.log('logged in! ' + $scope.loginStatus);
                $scope.api();
            }, {scope: 'email'});
        };
        $scope.removeAuth = function () {
            Facebook.api({
                method: 'Auth.revokeAuthorization'
            }, function(response) {
                Facebook.getLoginStatus(function(response) {
                    $scope.loginStatus = response.status;
                });
            });
        };
        $scope.api = function () {
            Facebook.api('/me', {fields: ['email', 'first_name']}, function(response) {
                $scope.user = response;
                $scope.FBinfo = response;
                console.log($scope.user);
            });
        };
        $scope.$watch(function() {
                return Facebook.isReady();
            }, function(newVal) {
                if (newVal) {
                    console.log('finally ready!');
                    $scope.facebookIsReady = true;
                    $scope.facebookShare = function () {
                        Facebook.ui({
                            method: 'feed',
                            name: $scope.mainPost.title,
                            link: 'http://google.com',
                            //picture: $scope.mainPost.thumbnail.fileURL,
                            picture: 'http://i.imgur.com/rJ2APxI.jpg?fb',
                            caption: $scope.mainPost.caption,
                            description: $scope.mainPost.description,
                            message: 'great post'
                        });
                    };
                }
            }
        );

    }
]);