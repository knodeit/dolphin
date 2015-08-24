'use strict';
var profileCtrl = require('../controllers/profile');

module.exports = function (Dashboard, app, acl, database, passport) {
    app.put('/dashboard/profile', Dashboard.acl.checkAccess(Dashboard.acl.matrix.entities.profile), profileCtrl.updateUser);
    app.put('/dashboard/profile/password',  Dashboard.acl.checkAccess(Dashboard.acl.matrix.entities.password), profileCtrl.updatePassword);
};
