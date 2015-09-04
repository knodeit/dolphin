'use strict';

/**
 * Module dependencies.
 */
var dolphin = require('dolphinio');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

/**
 * MyFeed Schema
 */
var MenuSchema = new Schema({
    module: {
        type: String,
        trim: true,
        index: true
    },
    menu: {
        type: String,
        trim: true,
        index: true
    },
    title: {
        type: String,
        trim: true
    },
    parent: {
        type: Schema.ObjectId, ref: 'Menu',
        index: true
    },
    state: {
        type: String,
        trim: true
    },
    entity: {
        type: String,
        trim: true
    },
    params: {
        type: String,
        trim: true
    },
    sort: {
        type: Number,
        trim: true,
        default: 0
    }
});
MenuSchema.plugin(require('../../../../lib/mongo_plugins/auditing'));

/**
 * Validations
 */
MenuSchema.path('title').validate(function (title) {
    return !!title;
}, 'Title cannot be blank');

MenuSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};

MenuSchema.statics.getMainFrontMenu = function () {
    return 'main-front';
};

MenuSchema.statics.getMainDashboardMenu = function () {
    return 'main-dashboard';
};

MenuSchema.statics.getTreeByName = function (name, user, callback) {
    var acl = dolphin.load('menu').acl;
    var result = [];
    var Menu = mongoose.model('Menu');

    Menu.find({menu: name, parent: {$exists: false}}).sort({sort: 1}).lean(true).exec(function (err, rows) {
        var funcs = [];
        for (var i in rows) {
            funcs.push(acl.checkAccessMenu(user, rows[i].entity));
        }
        Q.all(funcs).then(function (access) {
            funcs = [];
            for (var i in rows) {
                var row = rows[i];
                if (!access[i]) {
                    continue;
                }

                result.push(row);
                funcs.push(findSubmenu(user, row));
            }

            Q.all(funcs).then(function () {
                callback(result);
            });
        });
    });
};

function findSubmenu(user, menu) {
    var acl = dolphin.load('menu').acl;
    var deferred = Q.defer();
    menu.submenu = [];
    var Menu = mongoose.model('Menu');
    Menu.find({parent: menu._id}).sort({parent: 1, sort: 1}).lean(true).exec(function (err, rows) {
        var funcs = [];
        for (var i in rows) {
            funcs.push(acl.checkAccessMenu(user, rows[i].entity));
        }
        Q.all(funcs).then(function (access) {
            funcs = [];
            for (var i in rows) {
                var row = rows[i];
                if (!access[i]) {
                    continue;
                }
                menu.submenu.push(row);
                funcs.push(findSubmenu(user, row));
            }
            Q.all(funcs).then(function () {
                deferred.resolve();
            });
        });
    });
    return deferred.promise;
}

mongoose.model('Menu', MenuSchema);
