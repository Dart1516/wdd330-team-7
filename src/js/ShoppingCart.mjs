// ShoppingCart.mjs
// This module will handle everything related to the shopping cart page.
// I created this so the cart is organized just like ProductList: with a class and a template.

import { getLocalStorage, renderListWithTemplate, qs } from './utils.mjs';

const DEFAULT_CART_KEY = 'so-cart';

export default class ShoppingCart {
    constructor(parentSelector = '.product-list', cartKey = DEFAULT_CART_KEY) {
        // parentSelector: where I want the cart items to be rendered (ul.product-list)
        // cartKey: the key I use to store the cart in localStorage
        this.parentElement = document.querySelector(parentSelector);
        this.cartKey = cartKey;
    }

    getCart() {
        // Grab the cart from localStorage.
        // If nothing is there yet, I return an empty array so I don't break the code.
        return getLocalStorage(this.cartKey) || [];
    }

    cartItemTemplate(item) {
        // This function builds ONE cart item as HTML
        // I use the exact fields I know exist in my cart (Image, Name, Colors, Quantity, FinalPrice)

        return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="#"><h2 class="card__name">${item.Name}</h2></a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName ?? ""}</p>
      <p class="cart-card__quantity">qty: ${item.Quantity ?? 1}</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
    </li>
  `;
    }

    renderCart() {
        // Get the list of items from localStorage
        const items = this.getCart();

        // If the cart is empty, I just show a simple message
        if (!items.length) {
            this.parentElement.innerHTML = `<li class="cart-card divider">Your cart is empty.</li>`;
            return;
        }

        // If the cart has items, I use renderListWithTemplate to display them.
        // This clears the list before rendering and then inserts each item.
        renderListWithTemplate(
            (item) => this.cartItemTemplate(item),
            this.parentElement,
            items,
            'afterbegin',
            true // clear = true → clean the container before inserting new items
        );
    }

    init() {
        // This is the function I call from outside.
        // It simply starts everything by rendering the cart.
        this.renderCart();
    }
}
