'use strict';

angular.module('dolphin.blog').controller('VideoController', ['$scope', 'Global', '$state', '$http', '$timeout', '$modal', '$location', 'Video',
    function ($scope, Global, $state, $http, $timeout, $modal, $location, Video) {
        $scope.global = Global;
        $scope.package = {
            name: 'blog-home'
        };

        var idTimer;
        $scope.refreshTable = function () {
            $scope.rows.$promise.then(function (rows) {
                var ids = [];
                for (var i in rows) {
                    var row = rows[i];
                    if (!row._id) {
                        continue;
                    }
                    if (row.status == 'NEW' || row.status == 'WORK') {
                        ids.push(row._id);
                    }
                }
                if (ids.length > 0) {
                    $http.post('/api/video/get', {ids: ids}).success(function (data) {
                        for (var i in data) {
                            var newRow = data[i];
                            for (var j in rows) {
                                var oldRow = rows[j];
                                if (!oldRow._id) {
                                    continue;
                                }

                                if (newRow._id == oldRow._id) {
                                    oldRow.width = newRow.width;
                                    oldRow.height = newRow.height;
                                    oldRow.duration = newRow.duration;
                                    oldRow.status = newRow.status;
                                    oldRow.path = newRow.path;
                                    oldRow.progress = newRow.progress;
                                    break;
                                }
                            }
                        }
                        idTimer = $timeout(function () {
                            $scope.refreshTable();
                        }, 2000);
                    }).error(function (err) {
                        console.log(err);
                    });
                }
            });
        };

        $scope.initPage = function () {
            $scope.rows = Video.query();
            $scope.refreshTable();
        };
        $scope.initPage();

        $scope.$on('$destroy', function () {
            if (idTimer) {
                $timeout.cancel(idTimer);
            }
        });

        $scope.delete = function (row) {
            if (!confirm('Really delete this?')) {
                return;
            }

            row.$delete(function () {
                $scope.initPage();
            });
        };

        $scope.edit = function (id) {
            $state.go('.edit', {id: id});
        };

        $scope.watch = function (id) {
            $.fancybox.open({
                padding: 0,
                width: 800,
                height: 450,
                href: '/blog/player/' + id + '/800/450?autostart=1',
                type: 'iframe',
                autoSize: false
            });
        };
    }
]).controller('VideoFormController', ['$scope', 'Global', '$state', 'Upload', '$http', 'video',
    function ($scope, Global, $state, Upload, $http, video) {
        $scope.global = Global;
        $scope.package = {
            name: 'blog-home'
        };
        $scope.form = {};

        if (video) {
            $scope.form.id = video._id;
            $scope.form.title = video.title;

            //HACK
            video.$promise.then(function () {
                $scope.form.id = video._id;
                $scope.form.title = video.title;
            });
        }

        $scope.percent = 0;
        $scope.submit = function () {
            $scope.errors = {};
            $scope.params = {
                url: '/api/video',
                method: 'POST',
                file: $scope.form.file,
                fields: {}
            };
            if ($scope.form.id) {
                $scope.params.fields.id = $scope.form.id;
            }
            if ($scope.form.title) {
                $scope.params.fields.title = $scope.form.title;
            }
            Upload.upload($scope.params).progress(function (evt) {
                if ($scope.form.file && evt) {
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
    }
]);

