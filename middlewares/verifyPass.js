const bcrypt = require('bcrypt');

module.exports = (req, res, next) => {
  var hash = req.password.password.toString();
  var password = req.body.password.toString();

  console.log("Verify hash: ", hash);
  console.log("Verify pass: ", password);

  bcrypt.compare(password, hash, function (err, result) {
    if (result) {
      console.log("verify pass result: ", result);
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
