/**
 * Created by Vadim on 25.12.2014.
 */

'use strict';

angular.module('dolphin.dashboard').controller('ProfileIndexController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;
    Global.menuActive = '';
    $scope.tabs = [
        {
            title: 'Profile',
            state: 'dashboard.profile.account',
            slug: 'account'
        },
        {
            title: 'Change password',
            state: 'dashboard.profile.password',
            slug: 'password'
        }
    ];
}]);
