const bcrypt = require('bcrypt');

module.exports = (req, res, next) => {
  var hash = req.body.hashedPassword;
  var password = req.body.password;

  bcrypt.compare(password, hash, function(err, result) {
    if (result)
      req.result = result;
    else if (err) {
      return res.status(500).send({
        message:
          err.message || "An error occurred during password verification."
      })
    }
  });

  next();
};
