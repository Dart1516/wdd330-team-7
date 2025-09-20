// I’m switching ProductData to use the backend API instead of local JSON files.
// I will read the base URL from Vite's environment variable (see src/.env).

const baseURL = import.meta.env.VITE_SERVER_URL;
// Example: "https://wdd330-backend.onrender.com/"
// NOTE: it MUST end with a trailing slash in the .env so my template strings work cleanly.

async function convertToJson(res) {
  // I prefer async/await here for cleaner flow and consistent error handling.
  if (!res.ok) {
    // I want a helpful error message if the fetch fails.
    throw new Error(`HTTP ${res.status} while fetching ${res.url}`);
  }
  return res.json();
}

export default class ProductData {
  constructor() {
    // I’m removing category/path from the constructor to keep this class flexible.
    // The category will be passed when I call getData(category).
  }

  async getData(category) {
    // I fetch the products by category from the API.
    // The API returns { Result: [...] }, so I need to return data.Result.
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async getProductById(id) {
    // I will need this for the product detail page in the next step.
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}
