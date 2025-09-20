import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  // I changed the link so it points to my detail page with ?product=<id>.
  // NOTE: my detail HTML file lives in /product_pages/index.html in this project.
  const detailUrl = `/product_pages/index.html?product=${product.Id}`;

  // I also switched the image to the API field 'Images.PrimaryMedium'.
  // If it's missing for some item, I fallback to a placeholder.
  const imgSrc = product.Images?.PrimaryMedium || '/images/placeholder.png';

  // I keep the rest of the fields the same for now.
  return `
    <li class="product-card">
      <a href="${detailUrl}">
        <img src="${imgSrc}" alt="Image of ${product.NameWithoutBrand}">
        <h3 class="card__name">${product.Brand?.Name ?? ''}</h3>
        <h2 class="card__brand">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${Number(product.FinalPrice).toFixed(2)}</p>
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
    // I’m calling getData with this.category now.
    // This way ProductData knows which category to fetch from the API.
    const list = await this.dataSource.getData(this.category);

    // I log it to the console to confirm I see the array of products coming back.
    console.log('actual products:', list);

    // I render the products into the list element.
    this.renderList(list);
  }

}