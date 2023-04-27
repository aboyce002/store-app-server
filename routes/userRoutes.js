const keys = require('../config/prodKeys');
const authorize = require('../middlewares/authorize');
const verifyPass = require('../middlewares/encryptedPassVerify');
const encryptPass = require('../middlewares/encryptPass');
const User = require("../models/User");

module.exports = app => {
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/user/login', encryptPass, verifyPass, async (req, res) => {
    await User.query()
      .where('email', '=', req.body.email)
      .where('password', '=', req.hash)
      .limit(1)
      .then(user => {
        req.session.loggedIn = true;
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while fetching the product."
        })
      })
    res.json(req.result);
  });

  app.post('/api/user/register', encryptPass, async (req, res) => {
    // return error if email is taken
    await User.query()
      .insert({
        email: email,
        password: req.hash
      })
      .then(user => {
        console.log("password: ", req.hash)
        res.json(user)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while creating a user account."
        })
      })
  });

  app.post('/api/user/update/:id', authorize, async (req, res) => {
    const { email, password, phone } = req.body;
    await Product.query()
      .insert({
        email: email,
        // Encrypt this
        password: password,
        phone: phone,
        //addresses: addresses,
      })
      .then(product => {
        res.json(product)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while updating account information."
        })
      })
  });
};
