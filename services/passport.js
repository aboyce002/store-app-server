const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const keys = require('../config/prodKeys');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  await User.query()
    .findById(id)
    .then(user => {
      done(null, user);
    });
});

passport.use(new GoogleStrategy(
  {
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
