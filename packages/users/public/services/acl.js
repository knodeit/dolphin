'use strict';

angular.module('dolphin.users').factory('UsersAclService', ['$q', '$http', 'AclService',
    function ($q, $http, AclService) {
        return {
            canRead: function (action) {
                return AclService.can('users_' + action + '_view');
            },
            canCreate: function (action) {
                return AclService.can('users_' + action + '_create');
            },
            canEdit: function (action) {
                return AclService.can('users_' + action + '_edit');
            },
            canDelete: function (action) {
                return AclService.can('users_' + action + '_delete');
            }
        };
    }
]);
