'use strict';

angular.module('dolphin.setup').config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('front.setup', {
            url: '/setup',
            templateUrl: '/setup/views/index.html',
            controller: 'SetupController',
            resolve: {
                checkAccess: function ($state, $q) {
                    var deferred = $q.defer();
                    setTimeout(function () {
                        if (window.dolphinInit) {
                            deferred.reject();
                            $state.go('front.index');
                        } else {
                            deferred.resolve();
                        }
                    });
                    return deferred.promise;
                }
            }
        });
}]);
