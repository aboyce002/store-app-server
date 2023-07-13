const keys = require('../config/prodKeys');
const authorize = require('../middlewares/authorize');
const verifyPass = require('../middlewares/encryptedPassVerify');
const encryptPass = require('../middlewares/encryptPass');
const getUserPass = require('../middlewares/getPassFromEmail')
const User = require("../models/User");

module.exports = app => {
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/user/login', getUserPass, verifyPass, async (req, res) => {
    if (req.result == true) {
      res.json(req.result);
      res.redirect('/');
    }
    else {
      res.json(req.result);
      res.status(400).send(
        "Username and password do not match."
      )
    }
  });

  app.post('/api/user/register', encryptPass, async (req, res) => {
    // return error if email is taken
    await User.query()
      .insert({
        email: req.body.email,
        password: req.hashedPass
      })
      .then(user => {
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
