import {
    getLocalStorage,
    setLocalStorage,
    renderListWithTemplate,
} from "./utils.mjs";

const DEFAULT_CART_KEY = "so-cart";

export default class ShoppingCart {
    constructor(parentSelector = ".product-list", cartKey = DEFAULT_CART_KEY) {
        // Dónde renderizar los ítems del carrito
        this.parentElement = document.querySelector(parentSelector);
        // Clave de almacenamiento
        this.cartKey = cartKey;

        // Elementos de footer (opcionales si existen en tu HTML)
        this.footer = document.querySelector(".cart-footer");
        this.totalEl = document.querySelector(".cart-total");
    }

    // ---------- Storage helpers ----------
    getCart() {
        const raw = getLocalStorage(this.cartKey);
        return Array.isArray(raw) ? raw : [];
    }

    saveCart(items) {
        setLocalStorage(this.cartKey, items);
    }

    // ---------- Normalización / claves ----------
    buildKey(item) {
        const id = item.Id ?? item.id ?? item.SKU ?? item.sku ?? item.Name;
        const color = item.Colors?.[0]?.ColorName ?? "";
        return `${id}|${color}`;
    }

    normalizeCart(items) {
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

    // ---------- Totales ----------
    calcTotal(items) {
        return items.reduce((sum, it) => {
            const price = Number(it.FinalPrice ?? 0);
            const qty = Number(it.Quantity ?? 1);
            return sum + price * qty;
        }, 0);
    }

    updateFooter(items) {
        if (!this.footer && !this.totalEl) return; // si no hay UI de footer, salir
        if (!items.length) {
            this.footer?.classList.add("hide");
            if (this.totalEl) this.totalEl.textContent = "SubTotal: $0.00";
            return; // ❌ ya no escribimos ceros en localStorage
        }
        const total = this.calcTotal(items);
        if (this.totalEl) this.totalEl.textContent = `SubTotal: $${total.toFixed(2)}`;
        this.footer?.classList.remove("hide");
    }

    // ---------- Template / render ----------
    cartItemTemplate(item) {
        const key = this.buildKey(item);
        const qty = Number(item.Quantity ?? 1);
        const price = Number(item.FinalPrice ?? 0);
        const lineTotal = (price * qty).toFixed(2);

        // ✅ imagen desde el objeto anidado (opción 2 elegida)
        const imgSrc = item.Images?.PrimarySmall || "/images/placeholder.png";
        const alt = item.Name ?? item.NameWithoutBrand ?? "Product image";
        const detailUrl = `/product_pages/index.html?product=${item.Id}`;


        return `
      <li class="cart-card divider" data-key="${key}">
        <a href="${detailUrl}" class="cart-card__image">
          <img src="${imgSrc}" alt="${alt}">
        </a>

        <a href="${detailUrl}"><h2 class="card__name">${item.Name}</h2></a>
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
        const items = this.getCart();

        if (!items.length) {
            this.parentElement.innerHTML = `
        <li class="cart-card divider">Your cart is empty.</li>`;
            this.updateFooter(items);
            return;
        }

        renderListWithTemplate(
            (item) => this.cartItemTemplate(item),
            this.parentElement,
            items,
            "afterbegin",
            true // limpiar antes de renderizar
        );

        this.updateFooter(items);
    }

    // ---------- Cambios de cantidad ----------
    changeQty(key, delta) {
        const items = this.getCart();
        const idx = items.findIndex((it) => this.buildKey(it) === key);
        if (idx === -1) return;

        const current = Number(items[idx].Quantity ?? 1);
        const next = current + delta;

        if (next <= 0) {
            items.splice(idx, 1);
        } else {
            items[idx].Quantity = next;
        }

        this.saveCart(items);
        this.renderCart();
        window.dispatchEvent(new CustomEvent("cart:updated"));

    }

    removeItem(key) {
        const items = this.getCart().filter((it) => this.buildKey(it) !== key);
        this.saveCart(items);
        this.renderCart();
        window.dispatchEvent(new CustomEvent("cart:updated"));

    }

    attachEvents() {
        this.parentElement.addEventListener("click", (evt) => {
            const incBtn = evt.target.closest(".qty-inc");
            const decBtn = evt.target.closest(".qty-dec");
            const remBtn = evt.target.closest(".qty-remove");

            if (incBtn) this.changeQty(incBtn.dataset.key, +1);
            else if (decBtn) this.changeQty(decBtn.dataset.key, -1);
            else if (remBtn) this.removeItem(remBtn.dataset.key);
        });
    }

    // ---------- Init ----------
    init() {
        const current = this.getCart();
        const merged = this.normalizeCart(current);

        if (
            merged.length !== current.length ||
            merged.some((m, i) => (m.Quantity ?? 1) !== (current[i]?.Quantity ?? 1))
        ) {
            this.saveCart(merged);
        }

        this.renderCart();
        this.attachEvents();
    }
}
