const User = require("../models/User");

module.exports = async (req, res, next) => {
  var email = req.body.email;
  var password = req.user.password;
  console.log("email: ", email);
  req.password = "";
  await User.query()
    .select('password')
    .where('email', '=', email)
    .limit(1)
    .then(dbPass => {
      req.password = dbPass;
      console.log("dbpass: ", dbPass);
      console.log("password: ", password);
      next();
    })
    .catch(err => {
      res.status(400).send({
        message:
          err.message || "Couldn't find a user with that email."
      })
    })
};
