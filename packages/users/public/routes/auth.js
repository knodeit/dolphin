'use strict';

//Setting up route
angular.module('dolphin.users').config(['$stateProvider', function ($stateProvider) {
    // Check if the user is not connected
    var checkLoggedOut = function ($q, $http, $state) {
        // Initialize a new promise
        var deferred = $q.defer();

        // Make an AJAX call to check if the user is logged in
        $http.get('/loggedin').success(function (user) {
            // Authenticated
            if (user) {
                deferred.reject();
                $state.go('front.index');
            }
            // Not Authenticated
            else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    };

    // states for my app
    $stateProvider
        .state('front.login', {
            url: '/login',
            templateUrl: 'users/views/login.html',
            resolve: {
                loggedin: checkLoggedOut
            }
        });
}]);
