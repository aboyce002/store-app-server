const bcrypt = require('bcrypt');

module.exports = (req, res, next) => {
  var hash = req.user.password;
  var password = req.body.password;

  bcrypt.compare(password, hash, function (err, result) {
    if (result) {
      req.result = result;
      next();
    }
    else if (err) {
      return res.status(500).send({
        message:
          err.message || "An error occurred during password verification."
      })
    }
  });
};
