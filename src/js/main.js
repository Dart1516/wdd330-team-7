import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

// create the data source
const dataSource = new ProductData('tents');

// get the list element
const listElement = document.querySelector('.product-list');

// create the product list
const productList = new ProductList('tents', dataSource, listElement);

// initialize the product list (get the data)
productList.init();