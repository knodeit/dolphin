'use strict';

module.exports = {
    db: 'mongodb://localhost/dolphin-prod',
    /**
     * Database options that will be passed directly to mongoose.connect
     * Below are some examples.
     * See http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connect-options
     * and http://mongoosejs.com/docs/connections.html for more information
     */
    dbOptions: {
        /*
         server: {
         socketOptions: {
         keepAlive: 1
         },
         poolSize: 5
         },
         replset: {
         rs_name: 'myReplicaSet',
         poolSize: 5
         },
         db: {
         w: 1,
         numberOfRetries: 2
         }
         */
    },
    facebook: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    twitter: {
        clientID: 'CONSUMER_KEY',
        clientSecret: 'CONSUMER_SECRET',
        callbackURL: 'http://localhost:3000/auth/twitter/callback'
    },
    github: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    linkedin: {
        clientID: 'API_KEY',
        clientSecret: 'SECRET_KEY',
        callbackURL: 'http://localhost:3000/auth/linkedin/callback'
    },
    mailer: {
        emailFrom: '',
        host: '',
        port: 0,
        auth: {
            user: '',
            pass: ''
        }
    }
};
