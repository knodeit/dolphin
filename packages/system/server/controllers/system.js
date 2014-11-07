'use strict';

var dolphin = require('dolphinio');
var config = require('dolphinio').loadConfig();

exports.render = function (req, res) {

    var modules = [];
    // Preparing angular modules list with dependencies
    for (var name in dolphin.modules) {
        modules.push({
            name: name,
            module: 'dolphin.' + name,
            angularDependencies: dolphin.modules[name].angularDependencies
        });
    }

    // Send some basic starting info to the view
    res.render('index', {
        user: req.user ? req.user : null,
        modules: modules
    });
};

exports.getVersion = function (req, res) {
    res.json({
        version: config.version
    });
};

exports.test = function (req, res) {
    res.json({
        username: req.user.username,
        roles: req.user.roles
    });
};
