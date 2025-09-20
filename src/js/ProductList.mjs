import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  // I want to show a discount badge whenever FinalPrice < SuggestedRetailPrice.
  // Some products might not have SuggestedRetailPrice, so I use a safe fallback chain.
  const basePrice = Number(
    product.SuggestedRetailPrice ?? product.ListPrice ?? product.FinalPrice
  );
  const finalPrice = Number(product.FinalPrice ?? basePrice);

  // I add a tiny epsilon to avoid floating point issues like 19.989999 vs 19.99
  const isDiscounted =
    Number.isFinite(basePrice) &&
    Number.isFinite(finalPrice) &&
    finalPrice < basePrice - 0.005;

  // I calculate both the absolute amount off and the percent off (rounded).
  const amountOff = isDiscounted ? basePrice - finalPrice : 0;
  const percentOff = isDiscounted ? Math.round((amountOff / basePrice) * 100) : 0;

  // I pick the correct image field from the API (fallback to placeholder).
  const imgSrc = product.Images?.PrimaryMedium || '/images/placeholder.png';

  // I build the price HTML: if discounted, I show compare-at price with a strikethrough.
  const priceHtml = isDiscounted
    ? `
      <p class="product-card__price">
        <span class="price--final">$${finalPrice.toFixed(2)}</span>
        <span class="price--compare">$${basePrice.toFixed(2)}</span>
      </p>
    `
    : `
      <p class="product-card__price">$${finalPrice.toFixed(2)}</p>
    `;

  // I show a small badge on top/left with the percent off (ex: -25%).
  const badgeHtml = isDiscounted
    ? `<span class="badge badge--sale" aria-label="${percentOff}% off">-${percentOff}%</span>`
    : '';

  // I keep the link to my detail page the same as before.
  const detailUrl = `/product_pages/index.html?product=${product.Id}`;

  return `
    <li class="product-card" ${isDiscounted ? 'data-discounted="true"' : ''}>
      <a href="${detailUrl}">
        <figure class="product-card__media">
          ${badgeHtml}
          <img src="${imgSrc}" alt="Image of ${product.NameWithoutBrand}">
        </figure>
        <h3 class="card__name">${product.Brand?.Name ?? ''}</h3>
        <h2 class="card__brand">${product.NameWithoutBrand}</h2>
        ${priceHtml}
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