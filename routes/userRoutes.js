const { ref, raw } = require('objection');
const passport = require('passport');
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const authorize = require('../middlewares/authorize');
const verifyPass = require('../middlewares/verifyPass');
const encryptPass = require('../middlewares/encryptPass');
const getUserPass = require('../middlewares/getUserPassFromEmail')
const User = require("../models/User");
const confirmPassConstraints = require('../middlewares/confirmPassConstraints');
const User_Address = require('../models/User_Address');
const verifyAddress = require('../middlewares/verifyAddress');

module.exports = app => {
  app.get('/api/users/current_user', (req, res) => {
    if (req.user)
      res.send(req.user);
    else
      res.send(req.session.user);
  });

  app.get('/api/users/logout', (req, res) => {
    // Uses passport logout function
    // delete req.session[self._key].user;
    /*if (req.session.user) {
      req.session = null
    }*/
    req.logout(function (err) {
      if (err) { return next(err); }
    })
    res.redirect('/');
  });

  app.post('/api/users/login', function (req, res, next) {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureMessage: true,
      failureFlash: true
    }, (err, user, info) => {
      if (err) {
        return res.status(400).send({
          message:
            err.message
        })
      }
      //authentication error
      if (!user) { return res.json({ error: info.message || 'Invalid Token' }) }
      //success 
      req.logIn(user, function (err) {
        if (err) {
          return res.status(500).send({
            message:
              err.message
          })
        }
        return res.redirect('/');
      });
    })(req, res, next)
  });

  /* Old JWT login - passport is now used
    app.post('/api/users/login', getUserPass, verifyPass, async (req, res) => {
    const { email, password } = req.body;
    await User.query()
      .findOne('email', '=', email)
      .then(user => {
        req.session.user = user;
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          JWT_SECRET_KEY,
          {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: "24h",
          });
        res.status(200).send({
          message: "Login Successful",
          id: user.id,
          email: user.email,
          token,
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while trying to log the user in."
        })
      })
  });*/

  // Auto log-in after register? Probably not a good idea if email verification is implemented
  app.post('/api/users/register', confirmPassConstraints, encryptPass, async (req, res) => {
    // return error if email is taken
    const { email, password } = req.body;
    await User.query()
      .findOne('email', '=', email)
      .then(user => {
        if (user) {
          res.status(409).send({
            message:
              "Email already exists."
          })
        }
        else {
          User.query().insert({
            email: email,
            password: req.hashedPass
          })
            .then(res.redirect(200, '/register/success'))
            .returning('*')
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || "An error occurred while creating a user account."
              })
            })
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while creating a user account."
        })
      });
  });

  app.patch('/api/users/:id', authorize, verifyAddress, async (req, res, next) => {
    let id = parseInt(req.params.id)
    const { email, password, phone, main_address } = req.body;
    // Verify password if user is changing their password
    if (password) {
      confirmPassConstraints(req, res, next);
      encryptPass(req, res, next);
    }
    await User.query()
      .patchAndFetchById(id, {
        email: email,
        password: req.hashedPass,
        phone: phone,
        main_address: parseInt(main_address)
      })
      .returning('*')
      .then(user => {
        res.json(user);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while updating account information."
        })
      });
  });

  app.delete('/api/users/:id', authorize, async (req, res) => {
    let id = parseInt(req.params.id)
    // Log out user before deleting account
    await User.query()
      .deleteById(id)
      .returning('*')
      .then(user => {
        res.json(user)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while deleting a user account."
        })
      });
  });

  app.get('/api/users/verifyPass', authorize, getUserPass, verifyPass, async (req, res) => {
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
