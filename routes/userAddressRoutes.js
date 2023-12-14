const authorize = require('../middlewares/authorize');
const User = require("../models/User");
const UserAddress = require("../models/User_Address");

module.exports = app => {

  // Get an address via address id
  app.get('/api/userAddresses/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    await UserAddress.query()
      .findById(id)
      .then(address => {
        res.json(address)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while fetching the address."
        })
      })
  });

  // Get all addresses for a user via user id
  app.get('/api/userAddresses/user/:user_id', async (req, res) => {
    let userId = parseInt(req.params.user_id);
    await User.relatedQuery('addresses')
      .for(userId)
      .then(addresses => {
        res.json(addresses)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while fetching the addresses for a user."
        })
      })
  });

  // Create a new address
  app.post('/api/userAddresses', async (req, res) => {
    const { user_id, street, street2, street3, city, state, zip, country } = req.body;
    await UserAddress.query()
      .insert({
        user_id: user_id,
        street: street,
        street2: street2,
        street3: street3,
        city: city,
        state: state,
        zip: zip,
        country: country
      })
      .then(address => {
        res.json(address)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while creating the user address."
        })
      })
  });

  // Update an address via address id
  app.patch('/api/userAddress/:id', authorize, async (req, res) => {
    const { user_id, street, street2, street3, city, state, zip, country } = req.body;
    await UserAddress.query()
      .findById(id)
      .patch({
        user_id: user_id,
        street: street,
        street2: street2,
        street3: street3,
        city: city,
        state: state,
        zip: zip,
        country: country
      })
      .then(address => {
        res.json(address)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while updating address information."
        })
      })
  });

  // Delete an address via address id
  app.delete('/api/userAddress/:id', async (req, res) => {
    let id = parseInt(req.params.id)
    await UserAddress.query()
      .findById(id)
      .then(address => {
        res.json(address)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while fetching the address."
        })
      })
  });
};
