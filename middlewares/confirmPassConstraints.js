module.exports = (req, res, next) => {
  var password = req.body.password.toString();

  if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/) && (password.length >= 8 && password.length <= 72)) {
    next();
  }
  else {
    return res.status(400).send({
      message:
        "Password does not fulfill password constraints."
    })
  }
};
