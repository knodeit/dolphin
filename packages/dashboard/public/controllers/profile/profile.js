'use strict';

angular.module('dolphin.dashboard').controller('AccountController', ['$rootScope', '$scope', 'Global', '$http', '$state', 'growl', 'ProfileService', 'ErrorMapService',
    function ($rootScope, $scope, Global, $http, $state, growl, ProfileService, ErrorMapService) {
        $scope.global = Global;
        Global.profileMenuActive = 'account';
        $scope.form = {};
        $scope.form.username = Global.user.username;

        $scope.submit = function () {
            $scope.errors = {};
            ProfileService.updateProfile($scope.form).success(function (response) {
                $rootScope.user = response;
                Global.user = $rootScope.user;
                growl.info('The profile was successfully updated');
            }).error(function (err) {
                $scope.errors = ErrorMapService.mapArrayErrors(err);
            });
        };
    }
]);
