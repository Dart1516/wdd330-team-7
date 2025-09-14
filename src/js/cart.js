import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  // Fix: If there is nothing in localStorage, return an empty array instead of null
  const cartItems = getLocalStorage("so-cart") ?? [];

  // Fix: Handle empty cart case gracefully by displaying a message instead of crashing
  if (cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML =
      `<li class="cart-card divider"><p>Your cart is empty.</p></li>`;
    return;
  }

  // Map each item in the cart to its HTML template
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));

  // Render all cart items into the DOM
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

// Template function that creates HTML for a single cart item
function cartItemTemplate(item) {
  return `
  <li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <a href="#"><h2 class="card__name">${item.Name}</h2></a>
    <!-- Fix: Safe navigation (?. and ??) to avoid errors if Colors or Quantity are missing -->
    <p class="cart-card__color">${item.Colors?.[0]?.ColorName ?? ""}</p>
    <p class="cart-card__quantity">qty: ${item.Quantity ?? 1}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

// Render the cart content automatically when the page loads
renderCartContents();
