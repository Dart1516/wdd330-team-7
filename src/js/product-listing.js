import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

// I want the header and footer here too.
loadHeaderFooter();

// I read the ?category from the URL. 
// If nothing is passed, I fallback to 'tents' so something shows up by default.
const category = getParam('category') || 'tents';

// (Optional) If I added an <h1 id="category-title"> in my HTML, I can update it dynamically.
// If I didn’t add it, I can skip this part.
const titleEl = document.querySelector('#category-title');
if (titleEl) {
    titleEl.textContent = `Top Products: ${category.replace('-', ' ')}`;
}

// I set up the data source and product list as before, but now category is dynamic.
const dataSource = new ProductData(category);
const listElement = document.querySelector('.product-list');
const productList = new ProductList(category, dataSource, listElement);
productList.init();
