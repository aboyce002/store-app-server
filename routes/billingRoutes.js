const keys = require('../config/prodKeys');
const stripe = require('stripe')(keys.stripeSecretKey);
const authorize = require('../middlewares/authorize');

module.exports = app => {
  app.post('/api/stripe', authorize, async (req, res) => {

    const token = req.body.data.token;
    const amount = req.body.data.amount;

    try {
        const charge = await stripe.charges.create({
            amount: amount,
            currency: 'usd',
            description: '$15 for a plushie',
            source: token
        });

        req.user.credits += 5;

        const user = await req.user.save();

        res.send(user);
    } catch (err) {
        console.log(err);
    }
  });
};
