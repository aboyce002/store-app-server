require('dotenv').config();
require('./services/passport');
const express = require('express');
const app = express();
const {Client} = require('pg')
const client = new Client()
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/prodKeys');

app.use(express.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Origin",
      "http://warm-inlet-43569.herokuapp.com"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.use(express.static("client/build"));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
