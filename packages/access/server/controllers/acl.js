/**
 * Created by Vadim on 25.12.2014.
 */
'use strict';
var dolphin = require('dolphinio');

var mongoose = require('mongoose');
var Acl = mongoose.model('Acl');
var AclLabel = mongoose.model('AclLabel');

exports.getAclAll = function (req, res, next) {
    AclLabel.find({}).exec(function (err, labels) {
        Acl.find({}).sort({module: 1, entity: 1, role: 1}).exec(function (err, acls) {
            var access = {};
            for (var i in acls) {
                var _id = acls[i]._id;
                var module = acls[i].module;
                var entity = acls[i].entity;
                var role = acls[i].role;
                var permissions = acls[i].permissions;

                //hide access
                if (module == 'access') {
                    continue;
                }

                if (!access[module]) {
                    access[module] = {};
                    access[module].name = getModuleName(module, labels);
                    access[module].entities = {};
                }

                if (!access[module].entities[entity]) {
                    access[module].entities[entity] = {};
                    access[module].entities[entity].name = getEntityName(module, entity, labels);
                    access[module].entities[entity].roles = [];
                }

                access[module].entities[entity].roles.push({
                    _id: _id,
                    role: role,
                    permissions: permissions
                });
            }
            res.send(access);
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

exports.update = function (req, res, next) {
    Acl.updateRow(req.body._id, req.body.permissions).then(function () {
        res.send();
    }).catch(function (err) {
        next(err);
    });
};

exports.getPackages = function (req, res, next) {
    dolphin.getCustomPackages().then(function (packages) {
        var result = packages.map(function (item) {
            var isDisabled = false;
            if (item.settings && item.settings.disabled) {
                isDisabled = true;
            }

            return {
                name: item.name,
                active: !isDisabled
            };
        });
        res.send(result);
    });
};

exports.updatePackage = function (req, res, next) {
    var pack = dolphin.load(req.body.name);
    var exceptions = dolphin.load('errors');
    var HttpError = exceptions.getHttpError();
    if (!pack) {
        return new HttpError(400, 'Package not found');
    }

    pack.setStatus(req.body.active).then(function () {
        res.send();
    }).catch(function (err) {
        next(new HttpError(400, err));
    });
};