const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const keys = require('../config/prodKeys');
const bcrypt = require('bcrypt');

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

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async function verify(username, password, cb) {
    const user = await User.query()
      .findOne('email', '=', username)
      .catch(err => {
        return cb(err.message || new Error("Couldn't find a user with that email."));
      });
    if (!user) {
      return cb(new Error("Couldn't find a user with that email."));
    }
    if (!user.password) {
      return cb(new Error("Email belongs to a Google account; please Sign in with Google."));
    }
    bcrypt.compare(password.toString(), user.password.toString(), function (err, result) {
      if (result) {
        return cb(null, user);
      }
      else if (err) {
        return cb(err.message || new Error("An error occurred during password verification."));
      }
      else {
        return cb(new Error("Incorrect username or password."));
      }
    });
  }));

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
    console.log('email: ', profile.emails[0].value);
    const existingUser = await User.query().findOne({ google_id: profile.id });

    if (existingUser) {
      return done(null, existingUser);
    }

    const user = await User.query()
      .insert({
        google_id: profile.id,
        email: profile.emails[0].value
      });
    done(null, user);
  }));
