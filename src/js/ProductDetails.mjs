import { setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    // I save the product id from the URL and the data source (ProductData)
    this.productId = productId;

    // This will hold the actual product object once I fetch it
    this.product = {};

    // The data source knows how to load product info from the API
    this.dataSource = dataSource;
  }

  async init() {
    // I use the datasource to get the details for the current product.
    // NOTE: I must call getProductById now because findProductById is obsolete.
    this.product = await this.dataSource.getProductById(this.productId);

    // Once I have the product, I render the HTML
    this.renderProductDetails();

    // After rendering, I add a listener to the Add to Cart button
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  renderProductDetails() {
    // I grab the container and inject the HTML template with the product data
    const container = document.querySelector('.product-detail');
    if (!container) return;
    container.innerHTML = productDetailsTemplate(this.product);
  }

  addProductToCart() {
    // I load the cart from localStorage
    let cart = JSON.parse(localStorage.getItem('so-cart'));

    // If cart is empty or not an array, I start with a new array
    if (!Array.isArray(cart)) cart = [];

    // I push the current product object into the array
    cart.push(this.product);

    // I save the updated cart back to localStorage
    setLocalStorage('so-cart', cart);

    // For debugging I log what was added
    console.log('Added to cart:', this.product);
  }
}

// I define the template for the detail page
function productDetailsTemplate(product) {
  const brand = product.Brand?.Name ?? '';
  const nameNoBrand = product.NameWithoutBrand ?? product.Name ?? '';
  const imgSrc =
    product.Images?.PrimaryLarge || product.Images?.PrimaryMedium || '/images/placeholder.png';
  const descHtml = product.DescriptionHtmlSimple ?? '';
  const color = product.Colors?.[0]?.ColorName ?? '';

  const priceNumber = Number(product.FinalPrice ?? product.ListPrice);
  const priceText = Number.isFinite(priceNumber) ? priceNumber.toFixed(2) : '—';

  return `
    <h3>${brand}</h3>
    <h2 class="divider">${nameNoBrand}</h2>
    <img class="divider" src="${imgSrc}" alt="${nameNoBrand}" />
    <p class="product-card__price">$${priceText}</p>
    <p class="product__color">${color}</p>
    <p class="product__description">${descHtml}</p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  `;
}
// I added a data-id attribute to the button for potential future use
// but in this case I don't actually need it since the class already has the product info.

