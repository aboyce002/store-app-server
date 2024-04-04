const User = require("../models/User");

module.exports = async (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  await User.query()
    .select('password')
    .findOne('email', '=', email)
    .then(dbPass => {
      req.password = dbPass;
      next();
    })
    .catch(err => {
      res.status(404).send({
        message:
          err.message || "Couldn't find a user with that email."
      })
    })
};
