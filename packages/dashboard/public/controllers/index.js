'use strict';

angular.module('dolphin.dashboard').controller('DashboardController', ['$rootScope', '$scope', 'Global', '$http', function ($rootScope, $scope, Global, $http) {
    $scope.global = Global;
}]);
