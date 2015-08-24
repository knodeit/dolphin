'use strict';

//Global service for global variables
angular.module('dolphin.system').factory('Global', ['$rootScope', 'AclService',
    function ($rootScope, AclService) {
        this.user = window.user;
        this.authenticated = window.user && window.user._id;

        this.attachRoles = function (user) {
            var userRoles = user.roles;
            if (!angular.isArray(userRoles)) {
                userRoles = [userRoles];
            }
            userRoles.forEach(function (role) {
                AclService.attachRole(role);
            });
        };

        //init if user refresh a page
        if (this.user) {
            this.attachRoles(this.user);
        }
        return this;
    }
]);
