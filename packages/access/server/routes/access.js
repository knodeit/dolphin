'use strict';
var aclCtrl = require('../controllers/acl');

module.exports = function (Access, app) {
    app.get('/access/dashboard/acl', Access.acl.checkAccess(Access.acl.matrix.entities.acl), aclCtrl.getAclAll);
    app.put('/access/dashboard/acl', Access.acl.checkAccess(Access.acl.matrix.entities.acl), aclCtrl.update);
    app.get('/access/dashboard/packages', Access.acl.checkAccess(Access.acl.matrix.entities.packages), aclCtrl.getPackages);
    app.put('/access/dashboard/packages', Access.acl.checkAccess(Access.acl.matrix.entities.packages), aclCtrl.updatePackage);
};
