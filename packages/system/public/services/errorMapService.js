'use strict';

angular.module('dolphin.system').factory('ErrorMapService', [function () {
    return {
        mapArrayErrors: function (array) {
            return array.reduce(function (o, v, i) {
                o[v.param] = v.msg;
                return o;
            }, {});
        }
    };
}]);
