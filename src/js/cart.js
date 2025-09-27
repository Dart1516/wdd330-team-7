import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

async function init() {
    await loadHeaderFooter();             
    const cart = new ShoppingCart(".product-list", "so-cart");
    cart.init();                          
}
init();
