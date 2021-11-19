const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dbSetup = require('../config/dbSetup');
const User = require('../models/user');
const keys = require('../config/prodKeys');

dbSetup();

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.query().findById(id).then(user => {
    done(null, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  },
    async (accessToken, refreshToken, profile, done) => {
       console.log('access token: ', accessToken);
       console.log('refresh token: ', refreshToken);
       console.log('profile: ', profile);
       console.log('profile ID: ', profile.id);
       const existingUser = await User.query().findOne({ google_id: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const user = await User.query().insert({ google_id: profile.id });
        done(null, user);
    }
  )
);
