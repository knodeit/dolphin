/**
 * Created by Vadim on 22.09.2014.
 */
'use strict';

var dolphin = require('dolphinio');

exports.createBlogTask = function (message, callback) {
    var config = dolphin.load('blog').config;
    dolphin.getService('rabbit').then(function (conn) {
        return conn.createChannel().then(function (ch) {
            var msg = JSON.stringify(message);
            var ok = ch.assertQueue(config.queues.blogProcessing, {durable: true, noAck: false});
            ch.bindQueue(config.queues.blogProcessing, 'amq.direct');

            return ok.then(function (_qok) {
                ch.sendToQueue(config.queues.blogProcessing, new Buffer(msg), {deliveryMode: true});
                console.log(' [x] Sent "%s"', msg);
                return ch.close().then(function () {
                    callback();
                });
            });
        });
    }).then(null, console.warn);
};