'use strict';

angular.module('dolphin.blog').factory('Post', ['$resource', function ($resource) {
    return $resource('/api/posts/:id', {id: '@_id'}, {
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
}]).factory('Blog', ['$resource', function ($resource) {
    return $resource('/api/blogs/:id', {id: '@_id'}, {
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
