'use strict';

angular.module('dolphin.access', ['mm.acl']);

angular.module('dolphin.access').run(['AclService', function (AclService) {
    //init ACL
    AclService.setAbilities(window.aclMatrix);
}]);