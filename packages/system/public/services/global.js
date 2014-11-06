'use strict';

//Global service for global variables
angular.module('dolphin.system').factory('Global', ['$rootScope', function ($rootScope) {
    var _this = this;
    _this = {
        user: window.user,
        authenticated: false,
        isAdmin: false
    };
    if (window.user && window.user._id) {
        _this.authenticated = window.user._id ? true : false;
        _this.isAdmin = window.user.roles.indexOf('admin') !== -1;
    }
    $rootScope.Global = _this;
    return _this;
}]);
