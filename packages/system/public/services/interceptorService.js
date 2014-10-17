'use strict';

angular.module('dolphin-factory-interceptor', []).factory('httpInterceptor', ['$q', '$location', function ($q, $state) {
    return {
        'response': function (response) {
            if (response.status === 401) {
                $state.go('auth.login');
                return $q.reject(response);
            }
            return response || $q.when(response);
        },
        'responseError': function (rejection) {
            if (rejection.status === 401) {
                $state.go('auth.login');
                return $q.reject(rejection);
            }
            return $q.reject(rejection);
        }
    };
}]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
}
]);
