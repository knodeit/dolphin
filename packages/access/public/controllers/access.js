'use strict';

angular.module('dolphin.access').controller('AccessController', ['$scope', 'Global', '$state',
    function ($scope, Global, $state) {
        $scope.global = Global;
        $scope.tabs = [
            {
                title: 'Access control list',
                state: 'dashboard.access.acl',
            },
            {
                title: 'Access packages',
                state: 'dashboard.access.packages'
            }
        ];

        $scope.isActive = function (state) {
            if (state == $state.current.name) {
                return true;
            }
        };

        if ($state.current.name == 'dashboard.access') {
            $state.go('dashboard.access.acl');
        }
    }
]).controller('AccessAclController', ['$scope', 'Global', 'AccessAclService', 'Flash', 'rows',
    function ($scope, Global, AccessAclService, Flash, rows) {
        $scope.global = Global;
        $scope.rows = rows;

        $scope.togglePermission = function (row, method) {
            var idx = row.permissions.indexOf(method);
            if (idx == -1) {
                row.permissions.push(method);
            } else {
                row.permissions.splice(idx, 1);
            }

            AccessAclService.savePermissions(row._id, row.permissions).then(function () {
                Flash.showInfo('The changes have been saved');
            }).catch(function (err) {
                Flash.showError(err);
            });
        };
    }
]).controller('AccessPackagesController', ['$scope', 'Global', 'AccessAclService', 'Flash', 'rows',
    function ($scope, Global, AccessAclService, Flash, rows) {
        $scope.global = Global;
        $scope.rows = rows;

        $scope.save = function (row) {
            AccessAclService.savePackage(row.name, row.active).then(function () {
                Flash.showInfo('The changes have been saved');
            }).catch(function (err) {
                Flash.showError(err);
            });
        };
    }
]);
