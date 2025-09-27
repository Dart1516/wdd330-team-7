import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

// === helpers simples al estilo de la guía ===
function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};
    formData.forEach((value, key) => {
        convertedJSON[key] = value;
    });
    return convertedJSON;
}

function packageItems(items) {
    // Convierte tu carrito a: { id, name, price, quantity }
    return items.map((item) => ({
        id: item.Id,
        name: item.Name,
        price: Number(item.FinalPrice) || 0,
        quantity: Number(item.Quantity ?? 1),
    }));
}

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
        const data = getLocalStorage(this.key);
        this.list = Array.isArray(data) ? data : [];

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
        this.shipping =
            this.itemCount > 0 ? 10 + Math.max(0, this.itemCount - 1) * 2 : 0;
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

    // === Enviar pedido ===
    async checkout(formElement) {
        // Asegura que los totales estén calculados
        if (this.orderTotal === 0 && this.itemCount > 0) {
            this.calculateOrderTotal();
        }

        // 1) Tomar datos del form
        const order = formDataToJSON(formElement);

        // 2) Completar datos requeridos por el backend
        order.orderDate = new Date().toISOString();
        order.orderTotal = this.orderTotal.toFixed(2);
        order.tax = this.tax.toFixed(2);
        order.shipping = Number(this.shipping); // puede ser número según guía
        order.items = packageItems(this.list);

        // 3) POST
        try {
            const response = await services.checkout(order);
            console.log("Checkout success:", response);

            // Feedback mínimo en UI (opcional)
            alert("Order placed successfully!"); // puedes reemplazar por una pantalla de éxito
            // window.location.href = "/checkout/success.html"; // si tienes una página de success
        } catch (err) {
            console.error("Checkout error:", err);
            alert(`Checkout failed: ${err.message}`);
        }
    }
}
