'use strict';

//Setting up route
angular.module('dolphin.users').config(['$stateProvider', function ($stateProvider) {

    function checkAccess(UsersService, $q, $state) {
        var deferred = $q.defer();
        UsersService.isLoginIn().then(function (res) {
            if (res) {
                deferred.reject();
                return $state.go('front.login');
            }
            return deferred.resolve();
        });
        return deferred.promise;
    }

    $stateProvider
        .state('front.users', {
            abstract: true,
            url: '/auth',
            template: '<ui-view/>'
        })
        .state('front.users.login', {
            url: '/login',
            templateUrl: 'users/views/login.html',
            controller: 'UsersLoginCtrl',
            resolve: {
                loggedin: checkAccess
            }
        })
        .state('front.users.signup', {
            url: '/signup',
            templateUrl: 'users/views/register.html',
            controller: 'UsersRegisterCtrl',
            resolve: {
                loggedin: checkAccess
            }
        })
        .state('front.users.forgot-password', {
            url: '/forgot-password',
            templateUrl: 'users/views/forgot-password.html',
            controller: 'UsersForgotPasswordCtrl',
            resolve: {
                loggedin: checkAccess
            }
        })
        .state('front.users.reset-password', {
            url: '/reset-password/:tokenId',
            templateUrl: 'users/views/reset-password.html',
            controller: 'UsersResetPasswordCtrl',
            resolve: {
                loggedin: checkAccess
            }
        });
}]);
