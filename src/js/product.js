// I’m wiring up the product detail page:
// 1) read ?product=<id>
// 2) create the data source (API-based, empty constructor)
// 3) create the controller (ProductDetails) and initialize it.

import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// I want the header/footer on the detail page as well for a consistent layout.
loadHeaderFooter();

// I grab the product id from the URL, e.g. /product_pages/index.html?product=880RR
const productId = getParam("product");

// IMPORTANT: my ProductData constructor is empty now (API mode).
// I DO NOT pass "tents" anymore. The category is not needed for a single-product fetch.
const dataSource = new ProductData();

// I create the controller for this product page using the id and the data source.
const product = new ProductDetails(productId, dataSource);

// I kick things off: fetch product by id (via getProductById) → render → wire Add to Cart.
product.init();
