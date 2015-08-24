'use strict';

angular.module('dolphin.menu').factory('MenuService', ['$http',
    function ($http) {
        return {
            get: function (name) {
                return $http.get('/menu/tree/' + name);
            }
        };
    }

]).constant('MenuConstants', window.constantPackages.menu);
