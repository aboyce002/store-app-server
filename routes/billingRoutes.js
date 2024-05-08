const express = require("express");
const { STRIPE_SECRET_KEY, STRIPE_ENDPOINT_SECRET, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const stripe = require('stripe')(STRIPE_SECRET_KEY);
const validatePrices = require('../middlewares/validatePrices');
const baseURL = {
  sandbox: "https://api-m.sandbox.paypal.com",
  production: "https://api-m.paypal.com"
};

module.exports = app => {
  //////////////////////
  // Stripe
  //////////////////////

  app.get('/api/stripe/secret', async (req, res) => {
    // const intent = // ... Fetch or create the PaymentIntent
    res.json({ client_secret: intent.client_secret });
  });

  app.post('/api/stripe/create-payment-intent', validatePrices, async (req, res) => {
    // Print a msg saying prices changed if they were different from client
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        // Price is converted to cents for Stripe to accept it
        amount: Math.round(req.price * 100),
        currency: 'usd',
        //payment_method_types: ['card'],
        //source: token,
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Failed to create payment intent."
      })
    }
  });

  // Implement ability to update whenever price gets recalculated i.e. tax, fees, discounts, etc
  app.get('/api/stripe/update-payment-intent', async (req, res) => {
    const intent = await stripe.paymentIntents.update(
      '{{PAYMENT_INTENT_ID}}',
      { amount: 1499 }
    );
    res.json({ status: intent.status });
  });

  // Use stripe webhooks to make things happen at a specific step in the transaction process
  app.post('/api/stripe/webhooks', express.raw({ type: 'application/json' }), async (req, res) => {
    // Verify Stripe signature
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = await stripe.webhooks.constructEvent(req.body, sig, STRIPE_ENDPOINT_SECRET);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      // Create order in db after the payment has succeeded
      case 'payment_intent.succeeded':
        const checkout = event.data.object;
        console.log("Payment succeeded :)");
        console.log("Post-payment stuff: ", event.data.object);
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  });

  //////////////////////
  // Paypal
  //////////////////////
  //// For a fully working example, please see:
  //// https://github.com/paypal-examples/docs-examples/tree/main/standard-integration

  // create a new order
  app.post("/api/paypal/create-paypal-order", validatePrices, async (req, res) => {
    try {
      const order = await createOrder(req.price.toFixed(2));
      res.json(order);
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to create order." });
    }
  });

  // capture payment & store order information or fullfill order
  app.post("/api/paypal/capture-paypal-order", async (req, res) => {
    try {
      const { orderID } = req.body;
      const captureData = await capturePayment(orderID);
      // TODO: store payment information such as the transaction ID
      res.json(captureData);
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to capture order." });
    }
  });

  //////////////////////
  // PayPal API helpers
  //////////////////////

  // use the orders api to create an order
  async function createOrder(price) {
    const accessToken = await generateAccessToken();
    const url = `${baseURL.sandbox}/v2/checkout/orders`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: price,
            },
          },
        ],
      }),
    });
    const data = await response.json();
    return data;
  }

  // use the orders api to capture payment for an order
  async function capturePayment(orderID) {
    const accessToken = await generateAccessToken();
    const url = `${baseURL.sandbox}/v2/checkout/orders/${orderID}/capture`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data;
  }

  // generate an access token using client id and app secret
  async function generateAccessToken() {
    const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64")
    const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    const data = await response.json();
    return data.access_token;
  }
};
