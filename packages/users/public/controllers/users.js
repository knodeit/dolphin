'use strict';

angular.module('dolphin.users').controller('UsersLoginCtrl', ['$scope', 'UsersService', '$state', 'ErrorMapService',
    function ($scope, UsersService, $state, ErrorMapService) {
        $scope.user = {};
        $scope.errors = {};

        $scope.login = function () {
            UsersService.login($scope.user).then(function (user) {
                UsersService.auth(user);
                $state.go('dashboard.index');
            }).catch(function (err) {
                $scope.errors = ErrorMapService.mapArrayErrors(err);
            });
        };
    }
]).controller('UsersRegisterCtrl', ['$scope', '$state', 'UsersService', 'ErrorMapService',
    function ($scope, $state, UsersService, ErrorMapService) {
        $scope.user = {};
        $scope.errors = {};

        $scope.register = function () {
            UsersService.signup($scope.user).then(function (user) {
                UsersService.auth(user);
                $state.go('dashboard.index');
            }).catch(function (err) {
                $scope.errors = ErrorMapService.mapArrayErrors(err);
            });
        };
    }
]).controller('UsersForgotPasswordCtrl', ['$scope', '$state', 'UsersService', 'ErrorMapService', 'Flash',
    function ($scope, $state, UsersService, ErrorMapService, Flash) {
        $scope.user = {};
        $scope.errors = {};

        $scope.forgotpassword = function () {
            UsersService.forgotPassword($scope.user).then(function (user) {
                Flash.showInfo('The email has been sent');
                $scope.user = {};
            }).catch(function (err) {
                $scope.errors = ErrorMapService.mapArrayErrors(err);
                if (!(err instanceof Array)) {
                    Flash.showError(err);
                }
            });
        };
    }
]).controller('UsersResetPasswordCtrl', ['$scope', '$state', '$stateParams', 'UsersService', 'ErrorMapService',
    function ($scope, $state, $stateParams, UsersService, ErrorMapService) {
        $scope.user = {};
        $scope.user.tokenId = $stateParams.tokenId;
        $scope.errors = {};

        $scope.resetpassword = function () {
            UsersService.resetPassword($scope.user).then(function (user) {
                UsersService.auth(user);
                $state.go('dashboard.index');
            }).catch(function (err) {
                $scope.errors = ErrorMapService.mapArrayErrors(err);
            });
        };
    }
]).controller('UsersListCtrl', ['$scope', '$state', 'Global', 'UsersAclService', 'GridReader', 'UsersService', 'Flash',
    function ($scope, $state, Global, UsersAclService, GridReader, UsersService, Flash) {
        $scope.UsersAclService = UsersAclService;
        $scope.GridReader = GridReader;
        $scope.Global = Global;
        $scope.edit = function (_id) {
            $state.go('.form', {_id: _id});
        };

        $scope.delete = function (_id) {
            if (!confirm('Are you sure?')) {
                return;
            }

            UsersService.deleteUser(_id).then(function () {
                Flash.info('The user has been deleted');
                $state.forceReload();
            }).catch(function (err) {
                Flash.showError(err);
            });
        };
    }
]).controller('UsersFormCtrl', ['$rootScope', '$scope', '$state', 'UsersService', 'ErrorMapService', 'user', 'roles', 'Flash',
    function ($rootScope, $scope, $state, UsersService, ErrorMapService, user, roles, Flash) {
        $scope.user = user;
        $scope.roles = roles;
        $scope.label = 'Create a User';
        if (user._id) {
            $scope.label = 'Update a User';
        }
        $rootScope.pageH1 = $scope.label;

        $scope.toggleRole = function (role) {
            var idx = $scope.user.roles.indexOf(role);
            if (idx == -1) {
                $scope.user.roles.push(role);
            } else {
                $scope.user.roles.splice(idx, 1);
            }
        };

        $scope.submit = function () {
            UsersService.updateUser($scope.user).then(function (user) {
                Flash.info('The changes have been saved');
                $state.forceReload('^');
            }).catch(function (err) {
                $scope.errors = ErrorMapService.mapArrayErrors(err);
            });
        };
    }
]);
