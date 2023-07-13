const User = require("../models/User");

module.exports = async (req, res, next) => {
  console.log("email: ", req.body.email);
  req.password = "";
  await User.query()
    .select('password')
    .where('email', '=', req.body.email)
    .limit(1)
    .then(dbPass => {
      req.password = dbPass;
      console.log("dbpass: ", dbPass);
      console.log("password: ", req.user.password);
      next();
    })
    .catch(err => {
      res.status(400).send({
        message:
          err.message || "Couldn't find a user with that email."
      })
    })
};
