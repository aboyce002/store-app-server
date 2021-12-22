const express = require("express");
const router = express.Router();
const productModel = require("../models/product");

module.exports = app => { 
  app.get('/product/:id', (req, res) => {
    let id = parseInt(req.params.id)
    productModel.query()
        .where('id', id)
        .then(user => {
            res.json(user)
        })
  });

  app.get('/products', (req, res) => {
    productModel.query((error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
      }
    });
  });
};