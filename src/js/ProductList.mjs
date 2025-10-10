import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const basePrice = Number(
    product.SuggestedRetailPrice ?? product.ListPrice ?? product.FinalPrice
  );
  const finalPrice = Number(product.FinalPrice ?? basePrice);
  const isDiscounted =
    Number.isFinite(basePrice) &&
    Number.isFinite(finalPrice) &&
    finalPrice < basePrice - 0.005;
  const amountOff = isDiscounted ? basePrice - finalPrice : 0;
  const percentOff = isDiscounted ? Math.round((amountOff / basePrice) * 100) : 0;

  const imgSrc = product.Images?.PrimaryMedium || '/images/placeholder.png';

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

  const badgeHtml = isDiscounted
    ? `<span class="badge badge--sale" aria-label="${percentOff}% off">-${percentOff}%</span>`
    : '';

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
    const list = await this.dataSource.getData(this.category);
    console.log('actual products:', list);
    this.renderList(list);
  }

}