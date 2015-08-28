/**
 * Created by Vadim on 22.09.2014.
 */
'use strict';

var config = require('dolphinio').loadConfig();
var Exift = require('../../../../../lib/exift');
var fs = require('fs');
var converter = require('../lib/converter/task');

var mongoose = require('mongoose');
var BlogVideo = mongoose.model('BlogVideo');

//mongoose.set('debug', true);
var UPLOAD_DIR = config.root + '/' + config.uploadVideoPath;

exports.list = function (req, res, next) {
    BlogVideo.find({}).sort({'_id': 'desc'}).exec(function (err, rows) {
        res.send(rows);
    });
};

exports.dropDown = function (req, res) {
    BlogVideo.find({}).exec(function (err, rows) {
        var r = [];
        for (var i in rows) {
            r.push({
                title: rows[i].title,
                _id: rows[i]._id
            });
        }
        res.send(r);
    });
};

exports.get = function (req, res, next) {
    BlogVideo.findOne({_id: req.params.id}).exec(function (err, row) {
        return res.send(row);
    });
};

exports.getAll = function (req, res) {
    BlogVideo.find({_id: {$in: req.body.ids}}, function (err, videos) {
        return res.json(videos);
    });
};

exports.delete = function (req, res) {
    BlogVideo.findOne({_id: req.params.id}).exec(function (err, video) {
        if (!video) {
            return res.status(400).send('Video not found');
        }

        if (fs.existsSync(UPLOAD_DIR + '/' + video.path)) {
            fs.unlinkSync(UPLOAD_DIR + '/' + video.path);
        }

        video.remove(function () {
            return res.json();
        });
    });
};


exports.update = function (req, res, next) {
    if (req.body.id) {
        BlogVideo.findOne({_id: req.body.id}).exec(function (err, video) {
            if (err || !video) {
                return res.status(400).send(err);
            }

            video.title = req.body.title;
            var file = req.files && req.files.file ? req.files.file.path : null;
            if (!file) {
                video.save(function (err) {
                    res.send(video);
                });
            } else {
                validateFile(file, function (err) {
                    if (err) {
                        video.invalidate('file', 'File isn\'t a video');
                    }
                    video.status = 'NEW';
                    video.progress = 0;
                    video.validate(function (err) {
                        if (err) {
                            if (req.files && req.files.file) {
                                fs.unlinkSync(req.files.file.path);
                            }
                            return res.status(400).send(err);
                        }
                        video.save(function (err) {
                            fs.chmodSync(config.root + '/' + req.files.file.path, '0766');
                            var msg = {
                                id: video.id,
                                path: config.root + '/' + req.files.file.path
                            };
                            converter.createBlogTask(msg, function () {
                                res.send(video);
                            });
                        });
                    });
                });
            }
        });
    } else {
        var video = new BlogVideo();
        video.title = req.body.title;
        var file = req.files && req.files.file ? req.files.file.path : null;
        validateFile(file, function (err) {
            if (err) {
                video.invalidate('file', 'File isn\'t a video');
            }
            video.validate(function (err) {
                if (err) {
                    if (req.files && req.files.file) {
                        fs.unlinkSync(req.files.file.path);
                    }
                    return res.status(400).send(err);
                }
                video.save(function (err) {
                    fs.chmodSync(config.root + '/' + req.files.file.path, '0766');
                    var msg = {
                        id: video.id,
                        path: config.root + '/' + req.files.file.path
                    };
                    converter.createBlogTask(msg, function () {
                        res.send(video);
                    });
                });
            });
        });
    }
};


exports.getVideo = function (id, callback) {
    BlogVideo.findOne({_id: id}).exec(function (err, video) {
        callback(err, video);
    });
};

function validateFile(file, callback) {
    if (!file) {
        return callback('File doesn\'t exists');
    }
    var exift = new Exift();
    exift.readData(file, function (err, metadata) {
        if (err) {
            return callback(err);
        }
        return callback(metadata.MIMEType.indexOf('video/') == -1 ? 'A bad file' : null);
    });
}

exports.player = function (Package, req, res) {
    BlogVideo.findOne({_id: req.params.id}).exec(function (err, media) {
        if(!media) {
            return Package.render('404', params, function (err, html) {
                res.send(html);
            });
        }

        var autostart = req.query.autostart && req.query.autostart == 1 ? true : false;
        var repeat = req.query.repeat && req.query.repeat == 1 ? true : false;
        var params = {
            media: media,
            width: req.params.width,
            height: req.params.height,
            autostart: autostart,
            repeat: repeat,
            userMediaId: req.params.id
        };
        Package.render('video', params, function (err, html) {
            res.send(html);
        });
    });
};