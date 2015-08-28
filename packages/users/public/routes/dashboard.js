'use strict';

angular.module('dolphin.users').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('dashboard.users', {
                url: '/users',
                templateUrl: 'users/views/dashboard/users/list.html',
                controller: 'UsersListCtrl',
                ncyBreadcrumb: {
                    label: 'Users'
                },
                pageSettings: {
                    h1: 'Users'
                },
                resolve: {
                    canRead: function ($q, UsersAclService) {
                        if (UsersAclService.canRead('users')) {
                            return true;
                        } else {
                            return $q.reject('403');
                        }
                    },
                    GridReader: function (UsersService) {
                        return UsersService.getUserReader();
                    }
                }
            })
            .state('dashboard.users.form', {
                url: '/form?:_id',
                templateUrl: 'users/views/dashboard/users/form.html',
                controller: 'UsersFormCtrl',
                ncyBreadcrumb: {
                    label: '{{label}}'
                },
                resolve: {
                    user: function (UsersService, $stateParams) {
                        return UsersService.getUser($stateParams._id);
                    },
                    roles: function (UsersService) {
                        return UsersService.getRoles();
                    }
                }
            })
        ;
    }
]);
