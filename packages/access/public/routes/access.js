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
            //acl
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
            //acl form
            .state('dashboard.access.roles', {
                url: '/roles',
                templateUrl: 'access/views/roles/list.html',
                controller: 'AccessRolesController',
                ncyBreadcrumb: {
                    label: 'Roles'
                },
                pageSettings: {
                    h1: 'Roles'
                },
                resolve: {
                    canRead: function ($q, AccessAclService) {
                        if (AccessAclService.canRead('roles')) {
                            return true;
                        } else {
                            return $q.reject('403');
                        }
                    },
                    rows: function (AccessRolesService) {
                        return AccessRolesService.getAll();
                    }
                }
            })
            .state('dashboard.access.roles.form', {
                url: '/form/:_id',
                templateUrl: 'access/views/roles/form.html',
                controller: 'AccessRoleFormController',
                ncyBreadcrumb: {
                    label: '{{label}}'
                },
                resolve: {
                    role: function (AccessRolesService, $stateParams) {
                        return AccessRolesService.getRole($stateParams._id);
                    }
                }
            })
            //packages
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
