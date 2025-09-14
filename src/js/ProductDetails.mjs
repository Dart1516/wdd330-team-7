import { setLocalStorage } from './utils.mjs';

export default class ProductDetails {
    constructor(productId, dataSource) {
        // Save the product id from the URL and the data source (ProductData)
        this.productId = productId;

        // This will hold the actual product object once we fetch it
        this.product = {};

        // The data source knows how to load product info from JSON
        this.dataSource = dataSource;
    }

    async init() {
        // use the datasource to get the details for the current product. 
        // findProductById will return a promise! use await or .then() to process it
        this.product = await this.dataSource.findProductById(this.productId);

        // the product details are needed before rendering the HTML
        this.renderProductDetails();

        // once the HTML is rendered, add a listener to the Add to Cart button
        // Notice the .bind(this). This callback will not work if the bind(this) is missing. 
        // Review the readings from this week on 'this' to understand why.
        document
            .getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));
    }


    renderProductDetails() {
        // 1) get the container
        const container = document.querySelector('.product-detail');
        if (!container) return;

        // 2) inject the HTML produced by the template
        container.innerHTML = productDetailsTemplate(this.product);
    }



    addProductToCart() {
        // 1) Try to load the cart from localStorage.
        let cart = JSON.parse(localStorage.getItem('so-cart'));

        // 2) If nothing is stored yet, or if it's not an array, start fresh.
        if (!Array.isArray(cart)) cart = [];

        // 3) Push the current product object into the cart array.
        cart.push(this.product);

        // 4) Save the updated cart back to localStorage using the helper.
        setLocalStorage('so-cart', cart);

        // 5) For debugging: log to the console what was added.
        console.log('Added to cart:', this.product);
    }
}
// returns the exact HTML structure required by /product_pages/index.html
function productDetailsTemplate(product) {
    const brand = product.Brand?.Name ?? '';
    const nameNoBrand = product.NameWithoutBrand ?? product.Name ?? '';
    const imgSrc = product.Image ?? '';
    const descHtml = product.DescriptionHtmlSimple ?? '';
    const color = product.Colors?.[0]?.ColorName ?? '';

    const priceNumber = Number(product.FinalPrice ?? product.ListPrice);
    const priceText = Number.isFinite(priceNumber) ? priceNumber.toFixed(2) : '—';

    return `
    <h3>${brand}</h3>

    <h2 class="divider">${nameNoBrand}</h2>

    <img
      class="divider"
      src="${imgSrc}"
      alt="${nameNoBrand}"
    />

    <p class="product-card__price">$${priceText}</p>

    <p class="product__color">${color}</p>

    <p class="product__description">
      ${descHtml}
    </p>

    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  `;
}


