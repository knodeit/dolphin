'use strict';

/**
 * Created by Vadim on 22.12.2014.
 */

var mongoose = require('mongoose');
var Menu = mongoose.model('Menu');

exports.tree = function (req, res) {
    Menu.getTreeByName(req.params.name, req.user, function (tree) {
        res.send(tree);
    });
};
