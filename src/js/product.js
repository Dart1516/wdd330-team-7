import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// get the product id from the URL (example: ?product=880RR)
const productId = getParam("product");
// create a new data source for tents (this will use tents.json)
const dataSource = new ProductData("tents");
// create the controller for this specific product page
const product = new ProductDetails(productId, dataSource);
// start everything: fetch product → render details → set up Add to Cart button
product.init();
