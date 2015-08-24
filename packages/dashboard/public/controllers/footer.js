'use strict';

angular.module('dolphin.dashboard').controller('FooterController', ['$scope', 'Global', 'Dashboard',
    function ($scope, Global, Dashboard) {
        $scope.global = Global;
        $scope.today = Date.now();
    }
]);
