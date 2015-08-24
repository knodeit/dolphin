'use strict';

angular.module('dolphin.index').controller('IndexController', ['$scope', 'Global', 'Index',
    function ($scope, Global, Index) {
        $scope.global = Global;
        $scope.package = {
            name: 'index'
        };
    }
]);
