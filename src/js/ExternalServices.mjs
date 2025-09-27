// js/ExternalServices.mjs
const CHECKOUT_URL = "https://wdd330-backend.onrender.com/checkout";
// Si tu ambiente usa http, cambia a:  "http://wdd330-backend.onrender.com/checkout"

export default class ExternalServices {
    async checkout(payload) {
        const res = await fetch(CHECKOUT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`Checkout failed: ${res.status} ${text}`);
        }
        return res.json();
    }
}
