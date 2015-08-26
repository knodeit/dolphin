'use strict';

angular.module('dolphin.menu').factory('MenuService', ['$http', '$state',
    function ($http, $state) {
        return {
            get: function (name) {
                return $http.get('/menu/tree/' + name);
            },
            highlight: function (state) {
                if (state == $state.current.name) {
                    return true;
                }

                var parts = $state.current.name.split('.');
                var isFound = false;
                while (parts.length) {
                    parts.pop();
                    if (parts.join('.') == state) {
                        isFound = true;
                        break;
                    }
                }

                //if extends
                return isFound;
            }
        };
    }

]).constant('MenuConstants', window.constantPackages.menu);
