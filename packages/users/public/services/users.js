'use strict';

angular.module('dolphin.users').factory('UsersService', ['$http', '$q', 'Global', 'AccessAclService', 'GridService',
    function ($http, $q, Global, AccessAclService, GridService) {
        return {
            isLoginIn: function () {
                var deferred = $q.defer();
                $http.get('/users/loggedin').success(function (user) {
                    if (user) {
                        return deferred.resolve(true);
                    }
                    deferred.resolve(false);
                });
                return deferred.promise;
            },
            login: function (user) {
                var deferred = $q.defer();
                $http.post('/users/front/login', user).success(function (res) {
                    deferred.resolve(res);
                }).error(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            auth: function (user) {
                Global.authenticated = !!user;
                Global.user = user;
                AccessAclService.attachRoles(user);
            },
            signup: function (user) {
                var deferred = $q.defer();
                $http.post('/users/front/signup', user).success(function (res) {
                    deferred.resolve(res);
                }).error(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            forgotPassword: function (user) {
                var deferred = $q.defer();
                $http.post('/users/front/forgot-password', user).success(function () {
                    deferred.resolve();
                }).error(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            resetPassword: function (user) {
                var deferred = $q.defer();
                $http.post('/users/front/reset-password', user).success(function (res) {
                    deferred.resolve(res);
                }).error(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            getUserReader: function () {
                GridService.prototype.resetFilters = function () {
                    this.filters = {
                        blocked: 'all'
                    };
                    this.nextPage(0);
                };
                return new GridService('/users/dashboard/users', {blocked: 'all'});
            },
            getUser: function (_id) {
                var deferred = $q.defer();
                $http.get('/users/dashboard/user', {
                    params: {
                        _id: _id
                    }
                }).success(function (user) {
                    deferred.resolve(user);
                });
                return deferred.promise;
            },
            getRoles: function (_id) {
                var deferred = $q.defer();
                $http.get('/users/dashboard/roles').success(function (user) {
                    deferred.resolve(user);
                });
                return deferred.promise;
            },
            updateUser: function (user) {
                var deferred = $q.defer();
                $http.put('/users/dashboard/user', user).success(function (res) {
                    deferred.resolve(res);
                }).error(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            deleteUser: function (_id) {
                var deferred = $q.defer();
                $http.delete('/users/dashboard/user', {
                    params: {
                        _id: _id
                    }
                }).success(function (res) {
                    deferred.resolve(res);
                }).error(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        };
    }
]);
