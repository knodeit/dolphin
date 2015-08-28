/**
 * Created by Vadim on 22.09.2014.
 */
'use strict';

var dolphin = require('dolphinio');
var utils = require('util');
var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
var Q = require('q');
var crypto = require('crypto');
var config = '';

var mongoose = require('mongoose');
var BlogVideo = mongoose.model('BlogVideo');

var UPLOAD_DIR = '';
var UPLOAD_URL = '/blog/videos';
function initFolder() {
    UPLOAD_DIR = config.root + '/public/videos';
    if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, '0777');
    }
}

exports.initBlogWorker = function (Blog) {
    config = Blog.config;
    initFolder();

    dolphin.getService('rabbit').then(function (conn) {
        return conn.createChannel().then(function (ch) {
            var ok = ch.assertQueue(config.queues.blogProcessing, {durable: true, noAck: false});
            ok = ok.then(function () {
                ch.prefetch(1);
            });
            ch.bindQueue(config.queues.blogProcessing, 'amq.direct');

            ok = ok.then(function () {
                ch.consume(config.queues.blogProcessing, doWork, {noAck: false});
                console.log(' [*] Waiting for Blog Video messages. To exit press CTRL+C');
            });
            return ok;

            function doWork(msg) {
                var task = JSON.parse(msg.content);
                console.log('Received task of video "%s"', utils.inspect(task));
                BlogVideo.findById(task.id, function (err, doc) {
                    BlogVideo.update({_id: doc.id}, {status: 'WORK'}).exec();
                    var file = task.path;
                    if (!fs.existsSync(file)) {
                        return catchVideoCallback(task, ch, msg, doc, 'File was not found');
                    }

                    var outFile;
                    var absoluteFilePath;
                    while (true) {
                        var hash = crypto.createHash('md5').update((new Date()).valueOf().toString() + (Math.random().toString())).digest('hex');
                        outFile = hash + '.mp4';
                        absoluteFilePath = UPLOAD_DIR + '/' + outFile;
                        if (!fs.existsSync(absoluteFilePath)) {
                            break;
                        }
                    }

                    var lastPercent = 0;
                    makeVideo(file, absoluteFilePath, function (percent) {
                        if (lastPercent != Math.ceil(percent)) {
                            BlogVideo.update({_id: doc.id}, {progress: Math.ceil(percent)}).exec();
                            lastPercent = Math.ceil(percent);
                        }
                    }).then(function (metadata) {
                        BlogVideo.update({_id: doc.id}, {progress: 100}).exec();

                        if (fs.existsSync(UPLOAD_DIR + '/' + doc.path)) {
                            console.log('remove current file');
                            fs.unlinkSync(UPLOAD_DIR + '/' + doc.path);
                        }

                        doc.width = metadata.width;
                        doc.height = metadata.height;
                        doc.duration = Math.ceil(metadata.duration);
                        doc.path = outFile;
                        doc.fileUrl = UPLOAD_URL + '/' + outFile;
                        doneVideoCallback(task, ch, msg, doc);
                    }).fail(function (err) {
                        if (fs.existsSync(absoluteFilePath)) {
                            console.log('remove tmp file');
                            fs.unlinkSync(absoluteFilePath);
                        }
                        catchVideoCallback(task, ch, msg, doc, err);
                    });
                });
            }
        });
    }).then(null, console.warn);
};

function doneVideoCallback(task, ch, msg, doc) {
    if (fs.existsSync(task.path)) {
        console.log('remove origin file');
        fs.unlinkSync(task.path);
    }
    doc.status = 'DONE';
    doc.save(function (err) {
        ch.ack(msg); // done
    });
}
function catchVideoCallback(task, ch, msg, doc, message) {
    console.log('Task\'s Error: ', message);
    if (fs.existsSync(task.file)) {
        fs.unlinkSync(task.file);
    }
    if (doc) {
        doc.status = 'ERROR';
        doc.save(function (err) {
            ch.ack(msg); // done
        });
    } else {
        ch.ack(msg); // done
    }
}

function makeVideo(inputFile, outFile, percent) {
    var deferred = Q.defer();

    ffmpeg.ffprobe(inputFile, function (err, metadata) {
        var width = metadata.streams[0].width;
        var height = metadata.streams[0].height;
        if (width % 2 !== 0) {
            width++;
        }
        if (height % 2 !== 0) {
            height++;
        }
        var vSize = width + 'x' + height;

        var vBitrate = metadata.streams[0].bit_rate ? metadata.streams[0].bit_rate + 'k' : -1;
        var vFps = -1;
        if (metadata.streams[0].r_frame_rate.indexOf('/') != -1) {
            var p1 = parseInt(metadata.streams[0].r_frame_rate.substr(0, metadata.streams[0].r_frame_rate.indexOf('/')));
            var p2 = parseInt(metadata.streams[0].r_frame_rate.substr(metadata.streams[0].r_frame_rate.indexOf('/') + 1, metadata.streams[0].r_frame_rate.length));
            vFps = Math.ceil(p1 / p2);
        }
        if (vFps == -1) {
            vFps = 30;
        }

        var aBitrate = -1;
        var aSampleRate = -1;
        if (metadata.streams[1]) {
            aBitrate = metadata.streams[1].bit_rate ? metadata.streams[1].bit_rate + 'k' : -1;
            aSampleRate = metadata.streams[1].sample_rate ? metadata.streams[1].sample_rate : -1;
        }
        console.log(' [w] FFmpeg arguments: vSize: %s, vBitrate: %s, vFps: %s, aBitrate: %s, aSampleRate: %s', vSize, vBitrate, vFps, aBitrate, aSampleRate);

        var command = ffmpeg(inputFile);
        command.videoCodec('libx264');
        if (vBitrate > 0) {
            command.videoBitrate(500);
        }
        if (vFps > 0) {
            command.fps(vFps);
        }
        command.format('mp4');
        command.size(vSize);

        //meta
        command.outputOptions('-movflags', 'faststart');

        if (aBitrate > 0) {
            command.audioCodec('libvo_aacenc');
            command.audioBitrate(aBitrate);
            command.audioFrequency(aSampleRate);
        }
        command.on('progress', function (progress) {
            percent(progress.percent);
        });
        command.on('error', function (err, stdout, stderr) {
            deferred.reject(err.message);
        });
        command.on('end', function () {
            ffmpeg.ffprobe(outFile, function (err, metadata) {
                var result = {
                    width: metadata.streams[0].width,
                    height: metadata.streams[0].height,
                    duration: metadata.format ? metadata.format.duration : 0
                };
                deferred.resolve(result);
            });
        });
        command.save(outFile);
    });
    return deferred.promise;
}