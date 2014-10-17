'use strict';

angular.module('dolphin.users').controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$state', 'Global', function ($scope, $rootScope, $http, $state, Global) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function () {
        $scope.errors = {};
        $http.post('/login', {email: $scope.user.email, password: $scope.user.password}).success(function (response) {
            //ok
            $rootScope.user = response.user;
            Global.authenticated = !!$rootScope.user;
            Global.user = $rootScope.user;
            $state.go('home');
        }).error(function () {
            //TODO $scope.errors = {};
        });
    };
}]).controller('RegisterCtrl', ['$scope', '$rootScope', '$http', '$state', 'Global', function ($scope, $rootScope, $http, $state, Global) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function () {
        $scope.errors = {};
        $http.post('/register', {
            email: $scope.user.email,
            password: $scope.user.password,
            confirmPassword: $scope.user.confirmPassword,
            username: $scope.user.username,
            name: $scope.user.name
        }).success(function () {
            // authentication OK
            $scope.registerError = 0;
            $rootScope.user = $scope.user;
            $state.go('home');
        }).error(function (error) {
            // Error: authentication failed
            //TODO $scope.errors = {};
        });
    };
}
]).controller('ForgotPasswordCtrl', ['$scope', '$rootScope', '$http', '$state', 'Global',
    function ($scope, $rootScope, $http, $state, Global) {
        $scope.user = {};
        $scope.errors = {};
        //TODO
        /*$scope.forgotpassword = function () {
            $http.post('/forgot-password', {text: $scope.text}).success(function (response) {
                $scope.response = response;
            }).error(function (error) {
                $scope.response = error;
            });
        };*/
    }
]).controller('ResetPasswordCtrl', ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'Global', function ($scope, $rootScope, $http, $state, $stateParams, Global) {
    $scope.user = {};

    $scope.resetpassword = function () {
        $http.post('/reset/' + $stateParams.tokenId, {password: $scope.user.password, confirmPassword: $scope.user.confirmPassword}).success(function (response) {
            $rootScope.user = response.user;
            Global.authenticated = !!$rootScope.user;
            Global.user = $rootScope.user;
            $state.go('home');
        }).error(function (error) {
            //TODO $scope.errors = {};
        });
    };
}]);
