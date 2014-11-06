'use strict';

angular.module('dolphin.users').controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$state', 'Global', function ($scope, $rootScope, $http, $state, Global) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function () {
        $scope.errors = {};
        if (!$scope.user.email) {
            $scope.errors.email = 'Email is required';
        }
        if (!$scope.user.password) {
            $scope.errors.password = 'Password is required';
        }

        if (Object.keys($scope.errors).length === 0) {
            $http.post('/login', {
                email: $scope.user.email,
                password: $scope.user.password
            }).success(function (response) {
                //ok
                $rootScope.user = response.user;
                Global.authenticated = !!$rootScope.user;
                Global.user = $rootScope.user;
                $state.go('home');
            }).error(function (error, status) {
                console.log(error, status);
                if (status === 400) {
                    $scope.errors.global = 'Invalid data';
                } else {
                    if (status === 401) {
                        $scope.errors.global = 'Incorrect login or password';
                    } else {
                        $scope.errors.global = error;
                    }
                }
            });
        }
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
        }).success(function (response) {
            // authentication OK
            $rootScope.user = response.user;
            Global.authenticated = !!$rootScope.user;
            Global.user = $rootScope.user;
            $state.go('home');
        }).error(function (error) {
            // Error: authentication failed
            for (var i in error) {
                $scope.errors[error[i].param] = error[i].msg;
            }
        });
    };
}
]).controller('ForgotPasswordCtrl', ['$scope', '$rootScope', '$http', '$state', 'Global',
    function ($scope, $rootScope, $http, $state, Global) {
        $scope.user = {};
        $scope.errors = {};

        $scope.forgotpassword = function () {
            $scope.errors = {};
            if (Object.keys($scope.errors).length === 0) {
                $http.post('/forgot-password', {
                    email: $scope.user.email
                }).success(function (response) {
                    $scope.errors.global = response.message;
                    $scope.user = {};
                }).error(function (error) {
                    // Error: authentication failed
                    for (var i in error) {
                        $scope.errors[error[i].param] = error[i].msg;
                    }
                });
            }
        };
    }
]).controller('ResetPasswordCtrl', ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'Global', function ($scope, $rootScope, $http, $state, $stateParams, Global) {
    $scope.user = {};
    $scope.errors = {};

    $scope.resetpassword = function () {
        $scope.errors = {};

        $http.post('/reset/' + $stateParams.tokenId, {
            password: $scope.user.password,
            confirmPassword: $scope.user.confirmPassword
        }).success(function (response) {
            $rootScope.user = response.user;
            Global.authenticated = !!$rootScope.user;
            Global.user = $rootScope.user;
            $state.go('home');
        }).error(function (error) {
            // Error: authentication failed
            for (var i in error) {
                $scope.errors[error[i].param] = error[i].msg;
            }
        });
    };
}]);
