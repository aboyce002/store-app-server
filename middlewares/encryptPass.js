const bcrypt = require('bcrypt');

module.exports = (req, res, next) => {
  const saltRounds = 11;
  var password = req.body.password;
  
  bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) {
        return res.status(500).send({
          message:
            err.message || "An error occurred during password salting."
        })
      }
    bcrypt.hash(password, salt, function(err, hash) {
      if (hash)
        req.hash = hash;
      else if (err) {
        return res.status(500).send({
          message:
            err.message || "An error occurred during password hashing."
        })
      }
    });
  });

  next();
};
