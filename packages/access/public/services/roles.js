/**
 * Created by Vadim on 26.08.2015.
 */
'use strict';

angular.module('dolphin.access').factory('AccessRolesService', ['$q', '$http',
    function ($q, $http) {
        return {
            getAll: function () {
                var deferred = $q.defer();
                $http.get('/access/dashboard/roles').success(function (res) {
                    deferred.resolve(res);
                }).error(function () {
                    deferred.resolve({});
                });
                return deferred.promise;
            },
            setRegistrationRole: function (role) {
                var deferred = $q.defer();
                $http.put('/access/dashboard/registration-role', {role: role}).success(function () {
                    deferred.resolve();
                }).error(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            getRole: function (_id) {
                var deferred = $q.defer();
                $http.get('/access/dashboard/role', {
                    params: {
                        _id: _id
                    }
                }).success(function (res) {
                    deferred.resolve(res);
                }).error(function () {
                    deferred.resolve({});
                });
                return deferred.promise;
            },
            updateRole: function (form) {
                var deferred = $q.defer();
                $http.put('/access/dashboard/role', form).success(function () {
                    deferred.resolve();
                }).error(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            deleteRole: function (_id) {
                var deferred = $q.defer();
                $http.delete('/access/dashboard/role', {
                    params: {
                        _id: _id
                    }
                }).success(function () {
                    deferred.resolve();
                }).error(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        };
    }
]);
