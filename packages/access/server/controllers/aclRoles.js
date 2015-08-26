/**
 * Created by Vadim on 25.12.2014.
 */
'use strict';
var dolphin = require('dolphinio');

var mongoose = require('mongoose');
var Acl = mongoose.model('Acl');
var AclRole = mongoose.model('AclRole');
var AclLabel = mongoose.model('AclLabel');

exports.getAll = function (req, res, next) {
    AclRole.find({'auditing.deleted': false}).exec(function (err, roles) {
        var access = {};
        for (var i in roles) {
            access[roles[i].role] = {};
            access[roles[i].role]._id = roles[i]._id;
            access[roles[i].role].name = roles[i].name;
            access[roles[i].role].canbedeleted = roles[i].auditing.canbedeleted;
            access[roles[i].role].registrationRole = roles[i].registrationRole;
            access[roles[i].role].modules = {};
            access[roles[i].role].entities = {};
        }
        AclLabel.find({'auditing.deleted': false}).exec(function (err, labels) {
            Acl.find({'auditing.deleted': false}).sort({module: 1, entity: 1, role: 1}).exec(function (err, acls) {
                for (var i in acls) {
                    var role = acls[i].role;
                    var module = acls[i].module;
                    var entity = acls[i].entity;

                    access[role].modules[module] = getModuleName(module, labels);
                    access[role].entities[entity] = getEntityName(module, entity, labels);
                }
                res.send(access);
            });
        });
    });
};

function getModuleName(module, labels) {
    for (var i in labels) {
        if (labels[i].module == module) {
            return labels[i].moduleName;
        }
    }
    return 'No set';
}

function getEntityName(module, entity, labels) {
    for (var i in labels) {
        if (labels[i].module == module) {
            for (var j in labels[i].labels) {
                var label = labels[i].labels[j];
                if (label.key == entity) {
                    return label.value;
                }
            }
        }
    }
    return 'No set';
}

exports.setRegRole = function (req, res, next) {
    AclRole.setRegRole(req.body.role).then(function () {
        res.send();
    }).catch(function (err) {
        next(err);
    });
};

exports.getRole = function (req, res, next) {
    AclRole.findOne({_id: req.query._id}).exec(function (err, currentRole) {
        var query = {
            'auditing.deleted': false
        };
        AclLabel.find(query).exec(function (err, labels) {
            Acl.find(query).sort({module: 1, entity: 1}).exec(function (err, acls) {
                var access = {
                    role: currentRole ? currentRole : null,
                    modules: {}
                };
                var entitiesSkip = [];
                for (var i in acls) {
                    var module = acls[i].module;
                    var entity = acls[i].entity;

                    //remove duplicates
                    if (entitiesSkip.indexOf(entity) > -1) {
                        continue;
                    }

                    if (!access.modules[module]) {
                        access.modules[module] = {};
                        access.modules[module].name = getModuleName(module, labels);
                        access.modules[module].entities = [];
                    }

                    access.modules[module].entities.push({
                        entity: entity,
                        module: module,
                        name: getEntityName(module, entity, labels),
                        permissions: []
                    });
                    entitiesSkip.push(entity);
                }

                putCurrentValues(currentRole, acls, access);
                res.send(access);
            });
        });
    });
};

function putCurrentValues(currentRole, acls, access) {
    if (!currentRole) {
        return;
    }
    for (var i in acls) {
        var role = acls[i].role;
        var module = acls[i].module;
        var entity = acls[i].entity;
        var permissions = acls[i].permissions;
        if (currentRole.role != role) {
            continue;
        }

        for (var j in access.modules[module].entities) {
            if (access.modules[module].entities[j].entity != entity) {
                continue;
            }
            access.modules[module].entities[j].permissions = permissions;
        }
    }
}

function getModuleName(module, labels) {
    for (var i in labels) {
        if (labels[i].module == module) {
            return labels[i].moduleName;
        }
    }
    return 'No set';
}

function getEntityName(module, entity, labels) {
    for (var i in labels) {
        if (labels[i].module == module) {
            for (var j in labels[i].labels) {
                var label = labels[i].labels[j];
                if (label.key == entity) {
                    return label.value;
                }
            }
        }
    }
    return 'No set';
}

exports.updateRole = function (req, res, next) {
    var MongoValidationError = dolphin.load('errors').getMongoalidationError();
    AclRole.updateRole(req.body).then(function () {
        res.send();
    }).catch(function (err) {
        next(new MongoValidationError(err));
    });
};

exports.deleteRole = function (req, res, next) {
    AclRole.findOne({_id: req.query._id}).exec(function (err, row) {
        if (!row) {
            return next(new Error('Row not found'));
        }

        row.delete().then(function () {
            res.send();
        }).catch(function (err) {
            next(err);
        });
    });
};