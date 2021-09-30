import Home from "./pages/Home";
import Product from "./pages/Product";
import Result from "./pages/Result";
import React from "react";
//For routing using react-router-dom.
import { BrowserRouter, Switch, Route } from "react-router-dom";
//Importing QueryClientProvider and QueryClient packages for ProductList.js.
//React-Query's advantage is caching requests(saving requests).
import { QueryClientProvider, QueryClient } from "react-query"; 
//Stripe integration with React.
import { loadStripe } from "@stripe/stripe-js";
//import { CartIcon } from "./components/Icons";
//Gives us useful hooks to build shopping cart and integrates well with Stripe.
import { CartProvider } from "use-shopping-cart";
//Provides a package called toaster that pops up a notification when an item is added to cart.
import {Toaster} from "react-hot-toast";
//Provides the navigation bar at the top of the webapp.
import Navbar from "./components/Navbar";

//Creating a new query client.
const queryClient = new QueryClient();

//Stripe's function to load Stripe's script from their servers using Stripe's test API.
const stripePromise = loadStripe('pk_test_51JcgfXGzdQZpiGbWk2UlAIuNbRHzwjJA0oOpiQiNrwu3rUjA5vGCAWN4Drk9Z3BDMmv5R1m0Mldfn2U5A5Xa7uaB00v0AtTang');

function App() {
  return (
    //Using QueryClientProvider and passing a client prop.
    <QueryClientProvider client={queryClient}>
    <CartProvider
      mode="checkout-session"
      stripe={stripePromise}
      currency="USD"
      >
    {/* router and within the router is the switch component with the exact route that is linked to the component home.
    A route for the result where users are taken after a successful payment. 
    And a route for the product page using a dynamic path according to the product's ID. */}
    <BrowserRouter>
    <Navbar/>
    <Toaster position="bottom-center" />
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route path="/result" component={Result}/>
      <Route path="/:productId" component={Product}/>
    </Switch>
    </BrowserRouter>   
    </CartProvider> 
    </QueryClientProvider>
  );
}

export default App;
