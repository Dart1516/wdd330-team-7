import { setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    // I save the product id from the URL and the data source (Now product Delais come from API)
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
    const btn = document.getElementById('addToCart');
    if (btn) {
      btn.addEventListener('click', this.addProductToCart.bind(this));
    }
  }

  renderProductDetails() {
    // I grab the container and inject the HTML template with the product data
    const container = document.querySelector('.product-detail');
    if (!container) return;
    container.innerHTML = productDetailsTemplate(this.product);
  }

  // tiny helper to guarantee a minimum visible loading time (~1s)
  sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async addProductToCart(evt) {
    // ----- UI: enter loading state -----
    const btn = evt?.currentTarget || document.getElementById('addToCart');
    const label = btn?.querySelector('.label');
    const originalText = label ? label.textContent : 'Add to cart';

    if (btn) {
      btn.disabled = true;                 // I avoid double clicks
      btn.classList.remove('is-success');
      btn.classList.add('is-loading');     // shows the 3 dots
      if (label) label.textContent = 'Adding';
    }

    const start = performance.now();

    try {
      // ----- Data: push to localStorage (simple, like before) -----
      let cart = JSON.parse(localStorage.getItem('so-cart'));
      if (!Array.isArray(cart)) cart = [];
      cart.push(this.product);
      setLocalStorage('so-cart', cart);
      console.log('Added to cart:', this.product);

      // ----- Keep loading visible for ~1s -----
      const elapsed = performance.now() - start;
      if (elapsed < 1000) await this.sleep(1000 - elapsed);

      // ----- UI: success, then restore -----
      if (btn) {
        btn.classList.remove('is-loading');
        btn.classList.add('is-success');     // turns green + shows ✓
        if (label) label.textContent = 'Added!';
        setTimeout(() => {
          btn.classList.remove('is-success');
          if (label) label.textContent = originalText;
          btn.disabled = false;
        }, 900);
      }
    } catch (err) {
      // If something fails, I restore the button and show a tiny hint
      console.error('Add to cart failed:', err);
      if (btn) {
        btn.classList.remove('is-loading');
        if (label) label.textContent = 'Try again';
        btn.disabled = false;
        setTimeout(() => {
          if (label) label.textContent = originalText;
        }, 1200);
      }
    }
    let cart = JSON.parse(localStorage.getItem('so-cart'));
    if (!Array.isArray(cart)) cart = [];

    setLocalStorage('so-cart', cart);

    // ✅ avisa al badge que el carrito cambió
    window.dispatchEvent(new CustomEvent('cart:updated'));

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
      <!-- I keep the same id, but add content for the animation -->
      <button id="addToCart" class="btn btn--primary add-to-cart" data-id="${product.Id}">
        <span class="label">Add to cart</span>
        <span class="dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span>
        <span class="check" aria-hidden="true">✓</span>
      </button>
    </div>
  `;
}
// I added a data-id attribute to the button for potential future use
// but in this case I don't actually need it since the class already has the product info.