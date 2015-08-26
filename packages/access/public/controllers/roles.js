/**
 * Created by Vadim on 26.08.2015.
 */
'use strict';

angular.module('dolphin.access').controller('AccessRolesController', ['$scope', 'Global', '$state', 'rows', 'AccessRolesService', 'Flash',
    function ($scope, Global, $state, rows, AccessRolesService, Flash) {
        $scope.global = Global;
        $scope.rows = rows;

        $scope.edit = function (_id) {
            $state.go('.form', {_id: _id});
        };

        $scope.delete = function (_id) {
            if (!confirm('Are you sure?')) {
                return;
            }

            AccessRolesService.deleteRole(_id).then(function () {
                Flash.info('The role has been deleted');
                $state.forceReload();
            }).catch(function (err) {
                Flash.showError(err);
            });
        };

        $scope.toogleRegistrationRole = function (key, value) {
            AccessRolesService.setRegistrationRole(key).then(function () {
                Flash.showInfo('The changes have been saved');
            }).catch(function (err) {
                Flash.showError(err);
            });
        };
    }
]).controller('AccessRoleFormController', ['$scope', '$rootScope', 'Global', 'role', 'AccessRolesService', 'ErrorMapService', '$state', 'Flash',
    function ($scope, $rootScope, Global, role, AccessRolesService, ErrorMapService, $state, Flash) {
        $scope.global = Global;
        $rootScope.pageH1 = $scope.label = 'Role';
        $scope.form = role;
        $scope.errors = {};

        $scope.togglePermission = function (row, method) {
            var idx = row.permissions.indexOf(method);
            if (idx == -1) {
                row.permissions.push(method);
            } else {
                row.permissions.splice(idx, 1);
            }
        };

        $scope.submit = function () {
            var role = $scope.form.role || {};
            var entities = [];
            for (var i in $scope.form.modules) {
                for (var j in $scope.form.modules[i].entities) {
                    entities.push({
                        entity: $scope.form.modules[i].entities[j].entity,
                        module: $scope.form.modules[i].entities[j].module,
                        permissions: $scope.form.modules[i].entities[j].permissions
                    });
                }
            }

            AccessRolesService.updateRole({role: role, entities: entities}).then(function () {
                if ($scope.form.role) {
                    Flash.info('The role has been updated');
                } else {
                    Flash.info('The role has been created');
                }
                $state.forceReload('^');
            }).catch(function (err) {
                $scope.errors = ErrorMapService.mapArrayErrors(err);
            });
        };
    }
]);

