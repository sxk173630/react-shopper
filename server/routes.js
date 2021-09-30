require('dotenv').config();
//Creating all the endpoints for the node API.
const express = require("express");
//Since the products are stored in products.json, this Requires the products to come from products.json as well.
const products = require('./products.json');
//Stripe package requirement.
const stripe = require('stripe')(process.env.STRIPE_API_SECRET)
//Validate the items agaisnt the products.
const {validateCartItems} = require("use-shopping-cart/src/serverUtil");

module.exports = function getRoutes() {
  const router = express.Router();
  //A get funciton and a call back funciton for getting and then recieving request.(ROUTES)
  //And resonse data that we use to respond back with product data back to the client.
  router.get("/products", getProducts);
  router.get("/products/:productId", getProduct);

  router.post("/checkout-sessions", createCheckoutSession);
  router.get("/checkout-sessions/:sessionId", getCheckoutSession);

  return router;
};

//Controllers for routes.
function getProducts(req, res) {
  //Sends JSON data back as JSON data to the client. 
  //Success code 200 and a .json with includes the array of products in const products.
  res.status(200).json({ products });
}
//ProductId is gotten from the request parameters in Product.js.
function getProduct(req, res) {
  const { productId } = req.params;
  //Find method is used to find for each product, the one whos ID is equal to the one provided in the req.
  const product = products.find((product) => product.id === productId);
  //Try catch for If the product cannot be found, then a 404 status code is given otherwise status 200 is returned.
  try{
  if(!product){
    throw Error(`No product found for id: ${productId}`);
  }
  //Then it will be sent back to the user and a status 200 is given.
  res.status(200).json({ product });
} catch (error) {
  return res.status(404).json({ statusCode: 404, message: error.message });
}
}

//Controller to handle checkout request and actually send a request out to Stripe and grab the session ID to send back to the client.
//Also a source of validation when try catching products vs items in cart.
async function createCheckoutSession(req, res) {
  try{
    const cartItems = req.body;
    const line_items = validateCartItems(products, cartItems);

    //Specifying the origin where the req is coming from. Redirecting back to React app.
    const origin = process.env.NODE_ENV === 'production' ? req.headers.origin : 'http://localhost:3000';

    //Stripe documentation values/params.
    const params = {
      submit_type: "pay",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      line_items,
      success_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: origin,
      mode: "payment",
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    res.status(200).json(checkoutSession);
  } catch(error){
    res.status(500).json({ statusCode: 500, message: error.message });
  }
}
//The async and await keywords enable asynchronous, promise-based behavior to be written in a cleaner style, avoiding the need to explicitly configure promise chains.
async function getCheckoutSession(req, res){
  const { sessionId } = req.params;
  try{
    if(!sessionId.startsWith("cs_")){
      throw Error("Incorrect checkout session id")
    }
    const checkout_session = await stripe.checkout.sessions.retrieve(
      sessionId,
      { expand: ["payment_intent"]}
    )
    res.status(200).json(checkout_session)
  } catch(error){
    res.status(500).json({statusCode: 500, message: error.message})
  }
}