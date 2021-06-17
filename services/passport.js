const passport = require('passport');
const keys = require('../config/prodKeys');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const express = require('express');
const app = express();

passport.use(
  new GoogleStrategy(
  {
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  }, 
    (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
    }
  )
);

app.get(
  '/auth/google',
  passport.authenticate('google', {
      scope: ['profile', 'email']
  })
);
