'use strict';

angular.module('dolphin.pages').factory('Video', ['$resource', function ($resource) {
    return $resource('/api/video/:id', {id: '@_id'}, {
        update: {
            method: 'PUT'
        },
        get: {
            method: 'GET'
        },
        query: {
            method: 'GET',
            isArray: true
        },
        save: {
            method: 'POST'
        }
    });
}]);
