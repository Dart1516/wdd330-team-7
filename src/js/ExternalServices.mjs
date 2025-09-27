// URL base tomada desde .env
const baseURL = import.meta.env.VITE_SERVER_URL;
// Ejemplo: "https://wdd330-backend.onrender.com/"
// IMPORTANTE: termina con "/" en el .env

async function convertToJson(res) {
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} while fetching ${res.url}`);
  }
  return res.json();
}

export default class ExternalServices {
  constructor() {}

  // === Productos ===
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async getProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  // === Checkout ===
  async checkout(payload) {
    const response = await fetch(`${baseURL}checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return convertToJson(response);
  }
}
