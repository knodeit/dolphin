'use strict';

angular.module('dolphin.dashboard').config(['$stateProvider', function ($stateProvider) {

    return $stateProvider
        //profile
        .state('dashboard.profile', {
            abstract: true,
            url: '/profile',
            templateUrl: 'dashboard/views/profile/index.html',
            ncyBreadcrumb: {
                skip: true
            },
            controller: 'ProfileIndexController'
        })
        //account
        .state('dashboard.profile.account', {
            url: '/account',
            templateUrl: 'dashboard/views/profile/profile.html',
            ncyBreadcrumb: {
                parent: 'dashboard.index',
                label: 'Profile'
            },
            controller: 'AccountController',
            pageSettings: {
                h1: 'Profile'
            }
        })
        //password
        .state('dashboard.profile.password', {
            url: '/password',
            templateUrl: 'dashboard/views/profile/password.html',
            ncyBreadcrumb: {
                parent: 'dashboard.index',
                label: 'Change password'
            },
            controller: 'PasswordController',
            pageSettings: {
                h1: 'Profile'
            }
        });
}]);