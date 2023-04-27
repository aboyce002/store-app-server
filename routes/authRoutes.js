const passport = require('passport');

module.exports = app => {
  // Login url
  app.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // Callback after authentication is completed
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }), (req, res) => {
    res.redirect('/');
  });
};
