'use strict';
var aclCtrl = require('../controllers/acl');
var aclRolesCtrl = require('../controllers/aclRoles');

module.exports = function (Access, app) {
    //acl
    app.get('/access/dashboard/acl', Access.acl.checkAccess(Access.acl.matrix.entities.acl), aclCtrl.getAclAll);
    app.put('/access/dashboard/acl', Access.acl.checkAccess(Access.acl.matrix.entities.acl), aclCtrl.update);
    app.get('/access/dashboard/packages', Access.acl.checkAccess(Access.acl.matrix.entities.packages), aclCtrl.getPackages);
    app.put('/access/dashboard/packages', Access.acl.checkAccess(Access.acl.matrix.entities.packages), aclCtrl.updatePackage);

    //roles
    app.get('/access/dashboard/roles', Access.acl.checkAccess(Access.acl.matrix.entities.roles), aclRolesCtrl.getAll);
    app.put('/access/dashboard/registration-role', Access.acl.checkAccess(Access.acl.matrix.entities.roles), aclRolesCtrl.setRegRole);
    app.get('/access/dashboard/role', Access.acl.checkAccess(Access.acl.matrix.entities.roles), aclRolesCtrl.getRole);
    app.put('/access/dashboard/role', Access.acl.checkAccess(Access.acl.matrix.entities.roles), aclRolesCtrl.updateRole);
    app.delete('/access/dashboard/role', Access.acl.checkAccess(Access.acl.matrix.entities.roles), aclRolesCtrl.deleteRole);
};
