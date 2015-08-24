'use strict';

angular.module('dolphin.setup').controller('SetupController', ['$scope', 'Global', 'SetupService', 'ErrorMapService',
    function ($scope, Global, SetupService, ErrorMapService) {
        $scope.global = Global;
        $scope.package = {
            name: 'setup'
        };

        $scope.form = {};
        $scope.errors = {};
        $scope.submit = function () {
            //TODO: send a logo
            SetupService.save($scope.form, null).success(function () {
                document.location = '/';
            }).error(function (err) {
                $scope.errors = ErrorMapService.mapArrayErrors(err);
            });
        };
    }
]);
