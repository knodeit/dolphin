'use strict';

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var LocalApiStrategy = require('../../../../lib/passport-localapi').Strategy;
var AccessToken = mongoose.model('AccessToken');
var User = mongoose.model('User');

module.exports = function (passport) {

    // Serialize the user id to push into the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // Deserialize the user object based on a pre-serialized token
    // which is the user id
    passport.deserializeUser(function (id, done) {
        User.findOne({
            _id: id
        }, '-salt -hashed_password', function (err, user) {
            done(err, user);
        });
    });

    // Use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            User.findOne({
                email: email
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
                return done(null, user);
            });
        }
    ));

    //use api strategy
    passport.use(new LocalApiStrategy(
        function (token, done) {
            AccessToken.findOne({token: token}).populate('user').exec(function (err, row) {
                if (err) {
                    return done(err);
                }
                if (!row || row.blocked || !row.user) {
                    return done(null, false);
                }
                return done(null, row.user);
            });
        }
    ));
};
