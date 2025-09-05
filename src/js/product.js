import { setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  
  // my notes:
  // I'm using JSON.parse(...)
//  because this will transfor everythin into a valid JSON array that I can use array methods on
  // so-carty is the key I'm using to store the cart in local storage
  //  I retrieve the cart from local storage and parse it into a JavaScript array
  let cart = JSON.parse(localStorage.getItem("so-cart"));
  //  if I don't do this and try to use array methods on null it will throw an error
  //  so I check if it's an array using Array.isArray()
  //  if it's not an array I set it to an empty array
  //  then I can safely use array methods on it
  

  if (!Array.isArray(cart)) cart = [];   // <-- IF this is not an array it will set it to an empty array
  // add the product to the cart array
  cart.push(product);
  //  finally I push the new product to the array and save it back to local storage
  //  using the setLocalStorage function from utils.mjs
  //  this function stringifies the array and saves it to local storage
  //  under the key "so-cart"
  setLocalStorage("so-cart", product); 
  //  so now the cart in local storage is updated with the new product
  //  I can retrieve it later and it will include the new product
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
