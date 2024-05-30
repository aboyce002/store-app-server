require('dotenv').config();
require('./services/passport');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const passport = require('passport');
const flash = require('express-flash');
const keys = require('./config/prodKeys');
const dbSetup = require('./config/dbSetup');
const compression = require("compression");
const helmet = require("helmet");

const app = express();
const http = require('http').Server(app);
const socketIO = require('socket.io')(http, {
  cors: {
    origin: "https://store-app-client-beige.vercel.app"
  }
});
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
});
// Apply rate limiter to all requests
app.use(limiter);

app.use(cors());
app.use('/api/stripe/webhooks', bodyParser.raw({ type: "*/*" }))
app.use(bodyParser.json({ type: 'application/json' }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(express.json());
app.use(compression());
app.use(session({
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: keys.cookieKey,
  resave: false,
  saveUninitialized: false
}));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);
app.use(flash());
dbSetup();
// Initialize passport session with cookieSession
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/orderRoutes')(app);
require('./routes/productRoutes')(app);
require('./routes/userAddressRoutes')(app);
require('./routes/userRoutes')(app);

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Origin",
      "https://store-app-client-beige.vercel.app/"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.use(express.static("client/build"));
}

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });
});

const PORT = process.env.PORT || 5000;
http.listen(PORT);
