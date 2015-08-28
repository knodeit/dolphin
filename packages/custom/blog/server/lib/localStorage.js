/**
 * Created by Vadim on 28.07.2014.
 */
'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');

var UPLOAD_DIR = 'public/images';
var UPLOAD_URL = 'blog/images';

function getConfig() {
    return require('dolphinio').load('blog').config;
}

exports.upload = function (file, filename, clean, progress, callback) {
    if (!fs.existsSync(file)) {
        return callback({message: 'File not found'}, null);
    }

    if (!fs.existsSync(file)) {
        return callback('file does not exist');
    }

    var folder = getConfig().root + '/' + UPLOAD_DIR;
    if (fs.existsSync(folder + '/' + filename)) {
        return callback('filename exists');
    }

    createPath(folder + '/' + filename, function (err) {
        if (err) {
            return callback(err);
        }

        fs.rename(file, folder + '/' + filename, function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, {
                url: '/' + UPLOAD_URL + '/' + filename
            });
        });
    });
};

exports.deleteFile = function (fileName, callback) {
    var folder = getConfig().root + '/' + UPLOAD_DIR;
    if (fs.existsSync(folder + '/' + fileName)) {
        fs.unlinkSync(folder + '/' + fileName);
        return callback();
    }
    callback('File not found');
};

function createPath(path, callback) {
    var folders = path.substring(0, path.lastIndexOf('/'));
    if (fs.existsSync(folders)) {
        return callback();
    }
    mkdirp(folders, function (err) {
        if (err) {
            return callback(err);
        }
        callback();
    });
}
