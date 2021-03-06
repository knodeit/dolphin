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
