'use strict';

angular.module('dolphin.dashboard').controller('PasswordController', ['$rootScope', '$scope', 'Global', '$http', '$state', 'growl', 'ProfileService', 'ErrorMapService',
    function ($rootScope, $scope, Global, $http, $state, growl, ProfileService, ErrorMapService) {
        $scope.global = Global;
        Global.profileMenuActive = 'password';
        $scope.form = {};

        $scope.submit = function () {
            $scope.errors = {};
            ProfileService.updatePassword($scope.form).success(function (response) {
                $rootScope.user = response;
                Global.user = $rootScope.user;
                growl.info('The password was successfully updated');
            }).error(function (err) {
                $scope.errors = ErrorMapService.mapArrayErrors(err);
            });

            /*$http.post('/dashboard/profile/password/update', {
                currentPassword: $scope.form.currentPassword,
                password: $scope.form.password,
                repeatPassword: $scope.form.repeatPassword
            }).success(function (res) {
                growl.info('The password was successfully updated');
                $state.forceReload();
            }).error(function (err) {
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
            });*/
        };
    }
]);
