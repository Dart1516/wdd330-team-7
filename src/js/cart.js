// cart.js
// This file is now super simple because all the cart logic is inside ShoppingCart.mjs.
// I only import what I need and start the process here.

import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter();

async function init() {
    // First, I make sure the header and footer are loaded dynamically
    await loadHeaderFooter();

    // Then, I create a new ShoppingCart instance.
    // - '.product-list' is the place in the HTML where my cart items will go
    // - 'so-cart' is the key I use in localStorage to store the cart
    const cart = new ShoppingCart(".product-list", "so-cart");

    // Finally, I initialize the cart so it renders everything on the page
    cart.init();
}

// I call init() to make sure everything runs when the page loads
init();
