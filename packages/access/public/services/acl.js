'use strict';

angular.module('dolphin.access').factory('AccessAclService', ['$q', '$http',
    function ($q, $http) {
        return {
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
            }
        };
    }
]);
