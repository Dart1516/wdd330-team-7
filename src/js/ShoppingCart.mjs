// ShoppingCart.mjs
// Cart page controller: read cart, merge duplicates, render items,
// show total, and let the user change quantities (+ / -).

import {
    getLocalStorage,
    setLocalStorage,
    renderListWithTemplate,
} from "./utils.mjs";

const DEFAULT_CART_KEY = "so-cart";

export default class ShoppingCart {
    constructor(parentSelector = ".product-list", cartKey = DEFAULT_CART_KEY) {
        // Where I render the cart items
        this.parentElement = document.querySelector(parentSelector);
        // Storage key
        this.cartKey = cartKey;

        // Footer elements (added in index.html)
        this.footer = document.querySelector(".cart-footer");
        this.totalEl = document.querySelector(".cart-total");
    }

    // ---------- Storage helpers ----------
    getCart() {
        // I grab the cart from localStorage or return an empty array.
        const raw = getLocalStorage(this.cartKey);
        return Array.isArray(raw) ? raw : [];
    }

    saveCart(items) {
        // I persist the cart back to localStorage.
        setLocalStorage(this.cartKey, items);
    }

    // ---------- Normalization / keys ----------
    buildKey(item) {
        // I create a simple key to detect duplicates (id + color).
        const id = item.Id ?? item.id ?? item.SKU ?? item.sku ?? item.Name;
        const color = item.Colors?.[0]?.ColorName ?? "";
        return `${id}|${color}`;
    }

    normalizeCart(items) {
        // I merge duplicates by summing Quantity (default 1).
        const map = new Map();
        for (const it of items) {
            const key = this.buildKey(it);
            const found = map.get(key);
            if (!found) {
                map.set(key, { ...it, Quantity: Number(it.Quantity ?? 1) });
            } else {
                found.Quantity += Number(it.Quantity ?? 1);
            }
        }
        return Array.from(map.values());
    }

    // ---------- Total ----------
    calcTotal(items) {
        // I compute total = sum(FinalPrice * Quantity).
        return items.reduce((sum, it) => {
            const price = Number(it.FinalPrice ?? 0);
            const qty = Number(it.Quantity ?? 1);
            return sum + price * qty;
        }, 0);
    }

    updateFooter(items) {
        // Hide footer if empty. Otherwise show total.
        if (!items.length) {
            if (this.footer) this.footer.classList.add("hide");
            return;
        }
        const total = this.calcTotal(items);
        if (this.totalEl) this.totalEl.textContent = `Total: $${total.toFixed(2)}`;
        if (this.footer) this.footer.classList.remove("hide");
    }

    // ---------- Template / render ----------
    cartItemTemplate(item) {
  const key = this.buildKey(item);
  const qty = Number(item.Quantity ?? 1);
  const price = Number(item.FinalPrice ?? 0);
  const lineTotal = (price * qty).toFixed(2);

  return `
    <li class="cart-card divider" data-key="${key}">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>

      <a href="#"><h2 class="card__name">${item.Name}</h2></a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName ?? ""}</p>

      <p class="cart-card__price">$${price.toFixed(2)}</p>

      <div class="cart-card__qty">
        <div class="qty-group">
          <button class="qty-dec" aria-label="Decrease quantity" data-key="${key}">−</button>
          <span class="qty-value" aria-live="polite">${qty}</span>
          <button class="qty-inc" aria-label="Increase quantity" data-key="${key}">+</button>
        </div>
        <button class="qty-remove" aria-label="Remove item" title="Remove" data-key="${key}">&#128465;</button>
      </div>

      <p class="cart-card__lineTotal">$${lineTotal}</p>
    </li>
  `;
}

    renderCart() {
        // I render items and update total.
        const items = this.getCart();

        if (!items.length) {
            this.parentElement.innerHTML = `<li class="cart-card divider">Your cart is empty.</li>`;
            this.updateFooter(items);
            return;
        }

        renderListWithTemplate(
            (item) => this.cartItemTemplate(item),
            this.parentElement,
            items,
            "afterbegin",
            true // clear before rendering
        );

        this.updateFooter(items);
    }

    // ---------- Quantity changes ----------
    changeQty(key, delta) {
        // I update the quantity by +1 or -1 (delta).
        const items = this.getCart();
        const idx = items.findIndex((it) => this.buildKey(it) === key);
        if (idx === -1) return;

        const current = Number(items[idx].Quantity ?? 1);
        const next = current + delta;

        if (next <= 0) {
            // If qty goes to 0 or less, I remove the item.
            items.splice(idx, 1);
        } else {
            items[idx].Quantity = next;
        }

        this.saveCart(items);
        // I re-render to reflect the change and recompute total.
        this.renderCart();
    }

    removeItem(key) {
        // I remove the item regardless of quantity.
        const items = this.getCart().filter((it) => this.buildKey(it) !== key);
        this.saveCart(items);
        this.renderCart();
    }

    attachEvents() {
        // I use event delegation on the parent <ul>.
        this.parentElement.addEventListener("click", (evt) => {
            const incBtn = evt.target.closest(".qty-inc");
            const decBtn = evt.target.closest(".qty-dec");
            const remBtn = evt.target.closest(".qty-remove");

            if (incBtn) {
                // +1
                this.changeQty(incBtn.dataset.key, +1);
            } else if (decBtn) {
                // -1
                this.changeQty(decBtn.dataset.key, -1);
            } else if (remBtn) {
                // remove completely
                this.removeItem(remBtn.dataset.key);
            }
        });
    }

    // ---------- Init ----------
    init() {
        // 1) I read the cart
        const current = this.getCart();

        // 2) I normalize duplicates
        const merged = this.normalizeCart(current);

        // 3) Save if changed
        if (
            merged.length !== current.length ||
            merged.some((m, i) => (m.Quantity ?? 1) !== (current[i]?.Quantity ?? 1))
        ) {
            this.saveCart(merged);
        }

        // 4) First render
        this.renderCart();

        // 5) Attach + / - handlers
        this.attachEvents();
    }
}
