'use strict';

angular.module('dolphin.pages').controller('PagesController', ['$scope', 'Global', 'Pages',
    function ($scope, Global, Pages) {
        $scope.global = Global;
        $scope.package = {
            name: 'pages'
        };
    }
]);
