import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

async function init() {
    await loadHeaderFooter();

    const checkout = new CheckoutProcess("so-cart", ".checkout-summary");
    checkout.init(); // pinta Items y Subtotal

    // Calcula Tax/Shipping/Total al salir del ZIP
    const zipInput = document.querySelector("#zip");
    if (zipInput) {
        zipInput.addEventListener("blur", () => checkout.calculateOrderTotal());
    }

    // Enviar pedido
    const form = document.forms["checkout"];
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!form.reportValidity()) return;
            checkout.checkout(form);
        });
    }
}

init();
