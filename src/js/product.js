// I’m wiring up the product detail page:
// 1) read ?product=<id>
// 2) create the data source (API-based, empty constructor)
// 3) create the controller (ProductDetails) and initialize it.

import { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

// I want the header/footer on the detail page as well for a consistent layout.
loadHeaderFooter();

// I grab the product id from the URL, e.g. /product_pages/index.html?product=880RR
const productId = getParam("product");

// IMPORTANT: my old ProductData constructor is changint o ExternalServices in week04.
const dataSource = new ExternalServices();

// I create the controller for this product page using the id and the data source.
const product = new ProductDetails(productId, dataSource);

// I kick things off: fetch product by id (via getProductById) → render → wire Add to Cart.
product.init();
