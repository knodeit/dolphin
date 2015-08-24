'use strict';

angular.module('dolphin.users').controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$state', 'Global', function ($scope, $rootScope, $http, $state, Global) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function () {
        $scope.errors = {};
        $http.post('/login', {
            email: $scope.user.email,
            password: $scope.user.password
        }).success(function (user) {
            Global.authenticated = !!user;
            Global.user = user;
            Global.attachRoles(user);
            $state.go('dashboard.index');
        }).error(function (error, status) {
            for (var i in error) {
                $scope.errors[error[i].param] = error[i].msg;
            }
        });
    };
}]);
