'use strict';

//Setting up route
angular.module('dolphin.system').config(['$urlRouterProvider', '$stateProvider',
    function ($urlRouterProvider, $stateProvider) {
        // For unmatched routes:
        $urlRouterProvider.otherwise('/');
    }
]).config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('!');
}]);
