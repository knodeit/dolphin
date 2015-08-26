'use strict';

//Global service for global variables
angular.module('dolphin.system').factory('Global', [function () {
    this.user = window.user;
    this.authenticated = window.user && window.user._id;
    return this;
}]);
