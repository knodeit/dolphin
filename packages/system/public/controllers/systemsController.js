'use strict';

angular.module('dolphin.system').controller('IndexController', ['$scope', 'Global',
    function ($scope, Global) {
        $scope.global = Global;
    }
]);
