'use strict';

angular.module('dolphin.access').controller('AccessController', ['$scope', 'Global', 'MenuService', '$state',
    function ($scope, Global, MenuService, $state) {
        $scope.global = Global;
        $scope.tabs = [
            {
                title: 'Access control list',
                state: 'dashboard.access.acl'
            },
            {
                title: 'Roles',
                state: 'dashboard.access.roles'
            },
            {
                title: 'Access packages',
                state: 'dashboard.access.packages'
            }
        ];

        $scope.isActive = MenuService.highlight;

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
]).controller('AccessPackagesController', ['$scope', 'Global', 'AccessAclService', 'Flash', 'rows', '$state',
    function ($scope, Global, AccessAclService, Flash, rows, $state) {
        $scope.global = Global;
        $scope.rows = rows;

        $scope.save = function (row) {
            AccessAclService.savePackage(row.name, row.active).then(function () {
                Flash.info('The changes have been saved');
                $state.forceReload();
            }).catch(function (err) {
                Flash.showError(err);
            });
        };
    }
]).controller('AccessAclRoleFormController', ['$scope', 'Global',
    function ($scope, Global) {
        $scope.global = Global;

    }
]);

