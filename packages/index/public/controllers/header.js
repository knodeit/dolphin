/**
 * Created by Vadim on 26.06.2015.
 */

'use strict';

angular.module('dolphin.index').controller('HeaderController', ['$scope', 'Global', 'Index', 'SetupService', 'MenuConstants',
    function ($scope, Global, Index, SetupService, MenuConstants) {
        $scope.global = Global;
        $scope.setupService = SetupService;
        $scope.menuConstants = MenuConstants;
        $scope.notAuthMenu = [
            {
                title: 'Sign in',
                state: 'front.users.login',
                submenu: [],
                roles:[]
            },
            {
                title: 'Sign up',
                state: 'front.users.signup',
                submenu: [],
                roles:[]
            }
        ];
        $scope.authMenu = [
            {
                title: 'Dashboard',
                state: 'dashboard.index',
                submenu: [],
                roles:[]
            },
            {
                title: 'Sign out',
                url: '/logout',
                submenu: [],
                roles:[]
            }
        ];
    }
]);

