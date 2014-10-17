'use strict';

//Setting up route
angular.module('dolphin.system').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // For unmatched routes:
    $urlRouterProvider.otherwise('/');

    // states for my app
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'system/views/index.html'
    });
}
]).config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('!');
}
]);
