'use strict';

module.exports = {
    db: 'mongodb://localhost/dolphin-dev',
    debug: true,
    mongoose: {
        debug: false
    },
    baseUrl: '192.168.1.99:3066',
    mailer: {
        emailFrom: '',
        host: 'localhost',
        port: 25,
        auth: {
            user: '',
            pass: ''
        }
    }
};
