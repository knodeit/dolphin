/**
 * Created by Vadim on 14.07.2015.
 */
'use strict';

var amqpConn = require('amqplib');

module.exports = function (config) {
    return {
        name: 'rabbit',
        enabled: true,
        resolve: function () {
            return amqpConn.connect(config.amqp);
        }
    };
};