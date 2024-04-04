const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

module.exports = app => {
  app.get('/api/product/:id', async (req, res) => {
    let id = parseInt(req.params.id)
    await Product.query()
      .findById(id)
      .then(product => {
        res.json(product)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while fetching the product."
        })
      })
  });

  app.get('/api/products', async (req, res) => {
    await Product.query()
      // Sorts products by largest to smallest id so newer products(higher ids) are first
      // Implement pagination once amount of products increases
      .orderBy('id', 'desc')
      .then(product => {
        res.json(product)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while fetching products."
        })
      })
  });

  // Maybe a backend filter? Fine on the frontend for now
  app.get('/api/products/filter', async (req, res) => {
    const filters = req.query;
    const data = await Product.query()
      // do filtering here
      .orderBy('id', 'desc')
      .catch(err => {
        res.status(500).send({
          filteredProducts,
          message:
            err.message || "An error occurred while fetching products."
        })
      })

    const filteredProducts = data.filter(product => {
      let isValid = true;
      for (key in filters) {
        console.log(key, product[key], filters[key]);
        isValid = isValid && product[key] == filters[key];
      }
      return isValid;
    })

    res.json(filteredProducts)
  });

  app.post('/api/products', async (req, res) => {
    const { title, description, category, image, price, quantity, condition, availability } = req.body;
    await Product.query()
      .insert({
        title: title,
        description: description,
        category: category,
        image: image,
        price: price,
        quantity: quantity,
        condition: condition,
        availability: availability
      })
      .then(product => {
        res.json(product)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while creating the product."
        })
      })
  });

  app.put('/api/product/:id', async (req, res) => {
    const { id, title, description, category, image, price, quantity, condition, availability } = req.body;
    await Product.query()
      .update({
        id: id,
        title: title,
        description: description,
        category: category,
        image: image,
        price: price,
        quantity: quantity,
        condition: condition,
        availability: availability
      })
      .then(product => {
        res.json(product)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while editing the product."
        });
      });
  });
};
