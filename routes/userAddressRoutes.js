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
    const { user_id, first_name, last_name, street, street2, city, state, zip, country } = req.body;
    await UserAddress.query()
      .insert({
        user_id: user_id,
        first_name: first_name,
        last_name: last_name,
        street: street,
        street2: street2,
        city: city,
        state: state,
        zip: zip,
        country: country
      })
      // Make address main address if it's the user's first address
      .then(address => {
        const user = User.query().findById(user_id);
        if (!user.main_address)
          user.patch({
            main_address: address.id
          });
        res.json(address);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while creating the user address."
        })
      })
  });

  // Update an address via address id
  app.patch('/api/userAddresses/:id', authorize, async (req, res) => {
    let id = parseInt(req.params.id)
    const { user_id, first_name, last_name, street, street2, street3, city, state, zip, country } = req.body;
    await UserAddress.query()
      .patchAndFetchById(id, {
        user_id: user_id,
        first_name: first_name,
        last_name: last_name,
        street: street,
        street2: street2,
        street3: street3,
        city: city,
        state: state,
        zip: zip,
        country: country
      })
      .returning('*')
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
  app.delete('/api/userAddresses/:id', async (req, res) => {
    let id = parseInt(req.params.id)
    await UserAddress.query()
      .deleteById(id)
      .returning('*')
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
