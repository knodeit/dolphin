'use strict';

module.exports = {
    db: 'mongodb://localhost/dolphin-dev',
    debug: 'true',
    mongoose: {
        debug: false
    },
    facebook: {
        clientID: 'DEFAULT_APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    twitter: {
        clientID: 'DEFAULT_CONSUMER_KEY',
        clientSecret: 'CONSUMER_SECRET',
        callbackURL: 'http://localhost:3000/auth/twitter/callback'
    },
    github: {
        clientID: 'DEFAULT_APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
        clientID: 'DEFAULT_APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    linkedin: {
        clientID: 'DEFAULT_API_KEY',
        clientSecret: 'SECRET_KEY',
        callbackURL: 'http://localhost:3000/auth/linkedin/callback'
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
