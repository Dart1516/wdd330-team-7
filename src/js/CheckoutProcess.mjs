import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemCount = 0;
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        // leer carrito (array) o usar []
        const data = getLocalStorage(this.key);
        this.list = Array.isArray(data) ? data : [];

        // opcional: fecha en hidden (visible si inspeccionas)
        const dateInput = document.querySelector("#orderDate");
        if (dateInput) dateInput.value = new Date().toISOString();

        this.calculateItemSummary();
    }

    // Items = suma de Quantity; Subtotal = ∑(FinalPrice * Quantity)
    calculateItemSummary() {
        this.itemCount = this.list.reduce(
            (sum, item) => sum + Number(item?.Quantity ?? 1),
            0
        );

        this.itemTotal = this.list.reduce((sum, item) => {
            const price = Number(item?.FinalPrice ?? 0);
            const qty = Number(item?.Quantity ?? 1);
            return sum + price * qty;
        }, 0);

        const itemNumElement = document.querySelector(
            `${this.outputSelector} #num-items`
        );
        const summaryElement = document.querySelector(
            `${this.outputSelector} #cartTotal`
        );

        if (itemNumElement) itemNumElement.innerText = this.itemCount;
        if (summaryElement) summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    }

    // Tax 6%, Shipping $10 + $2 por item extra; Total = subtotal + tax + shipping
    calculateOrderTotal() {
        this.tax = this.itemTotal * 0.06;
        this.shipping = this.itemCount > 0 ? 10 + Math.max(0, this.itemCount - 1) * 2 : 0;
        this.orderTotal = this.itemTotal + this.tax + this.shipping;
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const taxEl = document.querySelector(`${this.outputSelector} #tax`);
        const shipEl = document.querySelector(`${this.outputSelector} #shipping`);
        const totalEl = document.querySelector(`${this.outputSelector} #orderTotal`);

        if (taxEl) taxEl.innerText = `$${this.tax.toFixed(2)}`;
        if (shipEl) shipEl.innerText = `$${this.shipping.toFixed(2)}`;
        if (totalEl) totalEl.innerText = `$${this.orderTotal.toFixed(2)}`;
    }
}

