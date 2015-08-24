'use strict';

angular.module('dolphin.dashboard').factory('ProfileService', ['$http', function ($http) {
    return {
        updateProfile: function (form) {
            return $http.put('/dashboard/profile', form);
        },
        updatePassword: function (form) {
            return $http.put('/dashboard/profile/password', form);
        }
    };
}]);
