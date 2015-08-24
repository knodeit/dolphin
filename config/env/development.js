'use strict';

module.exports = {
    db: 'mongodb://localhost/dolphin-dev',
    debug: true,
    mongoose: {
        debug: false
    },
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
