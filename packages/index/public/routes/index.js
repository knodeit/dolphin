'use strict';

angular.module('dolphin.index').config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('front', {
            abstract: true,
            url: '',
            templateUrl: '/index/views/layouts/front.html'
        })
        .state('front.index', {
            url: '/',
            templateUrl: window.indexPackage + '/views/index.html'
        });
}]);
