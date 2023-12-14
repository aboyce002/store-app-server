const authorize = require('../middlewares/authorize');
const verifyPass = require('../middlewares/verifyPass');
const encryptPass = require('../middlewares/encryptPass');
const getUserPass = require('../middlewares/getUserPassFromEmail')
const User = require("../models/User");

module.exports = app => {
  app.get('/api/users/current_user', (req, res) => {
    res.send(req.user);
  });

  app.get('/api/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/users/login', getUserPass, verifyPass, async (req, res) => {
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

  app.post('/api/users/register', encryptPass, async (req, res) => {
    // return error if email is taken
    const { email, password } = req.body;
    await User.query()
      .insert({
        email: email,
        password: req.hashedPass
      })
      .returning('*')
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while creating a user account."
        })
      });
  });

  app.patch('/api/users/:id', authorize, async (req, res) => {
    let id = parseInt(req.params.id)
    const { email, password, phone } = req.body;
    await User.query()
      .findById(id)
      .patch({
        email: email,
        // Encrypt this
        password: password,
        phone: phone,
        //addresses: addresses,
      })
      .returning('*')
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while updating account information."
        })
      });
  });

  app.delete('/api/users/:id', async (req, res) => {
    let id = parseInt(req.params.id)
    // Log out user before deleting account
    await User.query()
      .deleteById(id)
      .returning('*')
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while deleting a user account."
        })
      });
  });

  app.get('/api/users/verifyPass', getUserPass, verifyPass, async (req, res) => {
    if (req.result == true) {
      res.json(req.result);
    }
    else {
      res.json(req.result);
      res.status(400).send(
        "Password does not match."
      )
    }
  });
};
