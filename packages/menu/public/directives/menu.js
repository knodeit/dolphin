'use strict';
/**
 * Created by Vadim on 30.06.2015.
 */

angular.module('dolphin.menu').directive('mainMenu', function (Global, SetupService, MenuService, $state) {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment
        scope: {
            menu: '=',
            items: '=',
            css: '@'
        },
        templateUrl: 'menu/views/menu.html',
        controller: function ($scope) {
            $scope.setupService = SetupService;
            $scope.global = Global;
            $scope.menus = [];

            if ($scope.items) {
                $scope.menus = $scope.items;
            } else {
                MenuService.get($scope.menu).success(function (res) {
                    for (var i in res) {
                        if (!res[i].params) {
                            continue;
                        }
                        res[i].params = JSON.parse(res[i].params);
                    }
                    $scope.menus = res;
                }).error(function (err) {
                    console.log(err);
                });
            }

            $scope.isActive = MenuService.highlight;
        },
        link: function ($scope, element, attrs) {

        } //DOM manipulation
    };
});