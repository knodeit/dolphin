'use strict';

angular.module('dolphin.access').factory('AccessAclService', ['$q', '$http', 'AclService',
    function ($q, $http, AclService) {
        return {
            canRead: function (action) {
                return AclService.can('access_' + action + '_view');
            },
            canCreate: function (action) {
                return AclService.can('access_' + action + '_create');
            },
            canEdit: function (action) {
                return AclService.can('access_' + action + '_edit');
            },
            canDelete: function (action) {
                return AclService.can('access_' + action + '_delete');
            },
            getAclAll: function () {
                var deferred = $q.defer();
                $http.get('/access/dashboard/acl').success(function (res) {
                    deferred.resolve(res);
                }).error(function () {
                    deferred.resolve({});
                });
                return deferred.promise;
            },
            savePermissions: function (rowId, permissions) {
                var deferred = $q.defer();
                $http.put('/access/dashboard/acl', {_id: rowId, permissions: permissions}).success(function () {
                    deferred.resolve();
                }).error(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            getPackages: function () {
                var deferred = $q.defer();
                $http.get('/access/dashboard/packages').success(function (res) {
                    deferred.resolve(res);
                }).error(function () {
                    deferred.resolve([]);
                });
                return deferred.promise;
            },
            savePackage: function (name, active) {
                var deferred = $q.defer();
                $http.put('/access/dashboard/packages', {name: name, active: active}).success(function () {
                    deferred.resolve();
                }).error(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            attachRoles: function (user) {
                if (!user) {
                    user = window.user;
                }
                if (!user || !user.roles) {
                    return;
                }

                var userRoles = user.roles;
                if (!angular.isArray(userRoles)) {
                    userRoles = [userRoles];
                }
                userRoles.forEach(function (role) {
                    AclService.attachRole(role);
                });
                //by default
                AclService.attachRole('authenticated');
            }
        };
    }
]);
