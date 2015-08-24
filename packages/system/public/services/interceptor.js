'use strict';

angular.module('dolphin-factory-interceptor', []).factory('httpInterceptor', ['$q', '$location', function ($q, $location) {
    return {
        'response': function (response) {
            if (response.status === 403) {
                $location.path('/auth/login');
                return $q.reject(response);
            }
            if (response.status === 404) {
                $location.path('/');
                return $q.reject(response);
            }
            return response || $q.when(response);
        },
        'responseError': function (rejection) {
            if (rejection.status === 403) {
                $location.path('/auth/login');
                return $q.reject(rejection);
            }
            if (rejection.status === 404) {
                $location.path('/');
                return $q.reject(rejection);
            }
            return $q.reject(rejection);
        }
    };
}]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
}]);
