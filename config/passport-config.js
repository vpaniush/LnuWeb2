var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var keys = require('./keys');
var User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/auth/google/callback'
},
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id }).then((currentUser) => {
            if (currentUser) {
                console.log('------current user is: ' + currentUser + '--------');
                done(null, currentUser);
            } else {
                new User({
                    username: profile.displayName,
                    googleId: profile.id
                }).save().then((newUser) => {
                    console.log('--------new user ' + newUser + '----------');
                    done(null, newUser);
                });
            }
        });
    }
));



