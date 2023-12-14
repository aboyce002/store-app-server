const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const OrderDetails = require("../models/Order_Details");
const User = require("../models/User");

module.exports = app => {
  // Get an order via id
  app.get('/api/order/:id', async (req, res) => {
    let id = parseInt(req.params.id)
    await Order.query()
      .findById(id)
      .then(order => {
        res.json(order)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while fetching the order."
        })
      })
  });

  // Get all orders
  app.get('/api/orders', async (req, res) => {
    await Order.query()
      // Sorts orders by largest to smallest id so newer orders(higher ids) are first
      // Implement pagination once amount of orders increases
      .orderBy('id', 'desc')
      .then(order => {
        res.json(order)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while fetching orders."
        })
      })
  });

  // Get all orders for a user via user id
  app.get('/api/orders/user/:user_id', async (req, res) => {
    let userId = parseInt(req.params.user_id)
    await User.relatedQuery('orders')
      .for(userId)
      .then(orders => {
        res.json(orders)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while fetching the orders for a user."
        })
      })
  });

    // Get all details for an order via order id
    app.get('/api/orders/details/:order_id', async (req, res) => {
      let orderId = parseInt(req.params.order_id)
      await Order.relatedQuery('orderDetails')
        .for(orderId)
        .then(orderDetails => {
          res.json(orderDetails)
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "An error occurred while fetching the orders for a user."
          })
        })
    });

  // Create an order
  app.post('/api/orders', async (req, res) => {
    const { title, description, category, image, price, quantity, condition, availability } = req.body;
    await Order.query()
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
      .then(order => {
        res.json(order)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "An error occurred while creating the order."
        })
      })
  });

  // Maybe a backend filter? Fine on the frontend for now
  app.get('/api/orders/filter', async (req, res) => {
    const filters = req.query;
    const data = await Order.query()
      // do filtering here
      .orderBy('id', 'desc')
      .catch(err => {
        res.status(500).send({
          filteredOrders,
          message:
            err.message || "An error occurred while fetching orders."
        })
      })

    const filteredOrders = data.filter(order => {
      let isValid = true;
      for (key in filters) {
        console.log(key, order[key], filters[key]);
        isValid = isValid && order[key] == filters[key];
      }
      return isValid;
    })

    res.json(filteredOrders)
  });
};
