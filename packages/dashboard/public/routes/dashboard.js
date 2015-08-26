'use strict';

angular.module('dolphin.dashboard').config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('dashboard', {
            abstract: true,
            url: '/dashboard',
            templateUrl: '/dashboard/views/index.html',
            controller: function ($scope, $state, Global) {
                $scope.global = Global;

                if ($state.current.name === 'dashboard') {
                    return $state.go('dashboard.index');
                }
            },
            ncyBreadcrumb: {
                skip: true
            },
            resolve: {
                loggedin: function (UsersService, $q, $state) {
                    var deferred = $q.defer();
                    UsersService.isLoginIn().then(function (res) {
                        if (res) {
                            return deferred.resolve();
                        }

                        deferred.reject();
                        $state.go('front.login');
                    });
                    return deferred.promise;
                }
            }
        })
        .state('dashboard.index', {
            url: '',
            templateUrl: '/dashboard/views/dashboard.html',
            controller: 'DashboardController',
            ncyBreadcrumb: {
                label: 'Dashboard'
            },
            pageSettings: {
                h1: 'Dashboard'
            }
        });
}]);
