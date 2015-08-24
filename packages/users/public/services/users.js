'use strict';

angular.module('dolphin.users').factory('UsersService', ['$http', '$q',
    function ($http, $q, $state) {
        return {
            isLoginIn: function () {
                var deferred = $q.defer();
                $http.get('/loggedin').success(function (user) {
                    if (user) {
                        return deferred.resolve(true);
                    }
                    deferred.resolve(false);
                });
                return deferred.promise;
            }
        };
    }
]);
