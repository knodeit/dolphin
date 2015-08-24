'use strict';

angular.module('dolphin.dashboard').controller('MenuDashboardController', ['$scope', 'Global', 'MenuConstants',
    function ($scope, Global, MenuConstants) {
        $scope.menuConstants = MenuConstants;
    }
]);
