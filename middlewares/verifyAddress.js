const User_Address = require("../models/User_Address");

module.exports = async (req, res, next) => {
  var id = parseInt(req.params.id);
  var main_address = parseInt(req.body.main_address);

  if (main_address) {
    await User_Address.query().findById(main_address)
      .then(address => {
        if (address.user_id !== id)
          return res.status(403).send({
            message:
              "Cannot edit another user's address!"
          })
        next();
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "An error occurred while retrieving user address."
        })
      })
  }
  else next();
};
