require('dotenv').config();
require('./services/passport');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const keys = require('./config/prodKeys');
const dbSetup = require('./config/dbSetup');

const app = express();
const http = require('http').Server(app);
const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});

app.use(cors());
app.use('/api/stripe/webhooks', bodyParser.raw({ type: "*/*" }))
app.use(bodyParser.json({ type: 'application/json' }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(express.json());
app.use(session({
  secret: keys.cookieKey,
  resave: false,
  saveUninitialized: false
}));
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
      "http://warm-inlet-43569.herokuapp.com"
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
