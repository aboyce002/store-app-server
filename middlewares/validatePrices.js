const Product = require("../models/Product");

module.exports = async (req, res, next) => {
  var products = req.body.cartItems;
  var productIds = products.map(product => product.id);
  var productCartQuantities = products.sort((a, b) => (a.price - b.price)).map(product => product.cartQuantity);

  await Product.query()
    .select('price')
    .whereIn('id', productIds)
    .orderBy('price')
    .then(prices => {
      console.log("Product cart quantities: ", productCartQuantities);
      console.log("prices: ", prices);
      req.price = prices.reduce((a, b) => a + parseFloat(b.price * productCartQuantities[prices.indexOf(b)]), 0);
      next();
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "An error occurred while fetching the addresses for a user."
      })
    })
};
