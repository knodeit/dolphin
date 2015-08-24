'use strict';

angular.module('dolphin.access').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('dashboard.access', {
                url: '/access',
                templateUrl: 'access/views/index.html',
                controller: 'AccessController',
                ncyBreadcrumb: {
                    skip: true
                }
            })
            .state('dashboard.access.acl', {
                url: '/acl',
                templateUrl: 'access/views/acl.html',
                controller: 'AccessAclController',
                ncyBreadcrumb: {
                    label: 'Access control list'
                },
                pageSettings: {
                    h1: 'Access'
                },
                resolve: {
                    rows: function (AccessAclService) {
                        return AccessAclService.getAclAll();
                    }
                }
            })
            .state('dashboard.access.packages', {
                url: '/packages',
                templateUrl: 'access/views/packages.html',
                controller: 'AccessPackagesController',
                ncyBreadcrumb: {
                    label: 'Access packages'
                },
                pageSettings: {
                    h1: 'Access'
                },
                resolve: {
                    rows: function (AccessAclService) {
                        return AccessAclService.getPackages();
                    }
                }
            })
        ;
    }
]);
