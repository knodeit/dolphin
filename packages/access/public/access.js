'use strict';

angular.module('dolphin.access', ['mm.acl']);

angular.module('dolphin.access').run(['AclService', 'AccessAclService', function (AclService, AccessAclService) {
    //init ACL
    AclService.setAbilities(window.aclMatrix);
    AccessAclService.attachRoles();
}]);