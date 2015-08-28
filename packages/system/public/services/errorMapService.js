'use strict';

angular.module('dolphin.system').factory('ErrorMapService', [function () {
    return {
        mapArrayErrors: function (array) {
            if (array instanceof Array) {
                return array.reduce(function (o, v, i) {
                    o[v.param] = v.msg;
                    return o;
                }, {});
            }
            return array;
        }
    };
}]);
