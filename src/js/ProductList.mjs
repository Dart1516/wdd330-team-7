import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    return `
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        <img src="/images/${product.Image}" alt="Image of ${product.NameWithoutBrand}">
        <h3 class="card__name">${product.Brand.Name}</h3>
        <h2 class="card__brand">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        // You passed in this information to make the class as reusable as possible.
        // Being able to define these things when you use the class will make it very flexible
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    renderList(list) {
        renderListWithTemplate(
            productCardTemplate,   // 2️ the template function
            this.listElement,      // 1️ the destination element
            list,                  // the array of data
            'afterbegin',          // 3️ where to insert
            true                   // 3️ clear the element first
        );
    }


    async init() {
        // the dataSource will return a Promise...so you can use await to resolve it.
        const list = await this.dataSource.getData();
        // next, render the list – ** future **
        console.log('actual products:', list); 
        this.renderList(list);
    }
}