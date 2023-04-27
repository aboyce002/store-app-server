const keys = require('../config/prodKeys');
const stripe = require('stripe')(keys.stripeSecretKey);
const authorize = require('../middlewares/authorize');
const validatePrices = require('../middlewares/validatePrices');

module.exports = app => {
  app.get('/api/stripe/secret', async (req, res) => {
    //const intent = // ... Fetch or create the PaymentIntent
    res.json({client_secret: intent.client_secret});
  });

  app.post('/api/stripe/create-payment-intent', authorize, validatePrices, async (req, res) => {
    // Get token for product data, cross-check ids from client to db and print a msg saying prices changed if they were different
    const { price } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price,
            currency: 'usd',
            //payment_method_types: ['card'],
            //source: token,
            automatic_payment_methods: {
              enabled: true,
            },
        });
        //req.user.credits += 5;
        res.send({
          clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        console.log(err);
    }
  });
};
