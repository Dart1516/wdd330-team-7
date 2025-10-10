
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}


export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// Save data into localStorage.
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Get a query parameter value from the URL by name.
export function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Add both touchend and click event listeners to an element.
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault(); // prevents double-firing on mobile
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Render a list of items into a parent element using a template function.
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false
) {
  if (!templateFn || !parentElement || !Array.isArray(list)) return;

  if (clear) parentElement.innerHTML = '';

  const htmlStrings = list.map(templateFn); // create HTML from each item
  parentElement.insertAdjacentHTML(position, htmlStrings.join('')); // insert all at once
}

// Render HTML content into a parent element using a template string.
export function renderWithTemplate(templateHtml, parentElement, callback) {
  if (!templateHtml || !parentElement) return;
  parentElement.innerHTML = templateHtml;
  if (callback) callback(); // optional: run extra code after rendering
}
if (window.refreshCartBadge) {
  window.refreshCartBadge(false);
}

// Load an HTML template from a URL and return it as a string.
export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

// Load and render header and footer templates into the page.
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate('/partials/header.html');
  const footerTemplate = await loadTemplate('/partials/footer.html');

  const headerElement = document.querySelector('#main-header');
  const footerElement = document.querySelector('#main-footer');

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);

  if (window.refreshCartBadge) {
    window.refreshCartBadge(false);
  }
}

// -------------- Cart badge --------------

let lastCount = null; // para detectar 0->>1 y 1->>0

function getCartCount() {
  try {
    const raw = localStorage.getItem("so-cart");
    const arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return 0;
    return arr.reduce((sum, it) => sum + Number(it?.Quantity ?? 1), 0);
  } catch { return 0; }
}

function ensureBadge(count) {
  const badge = document.getElementById("cartBadge");
  const anchor = document.querySelector(".nav-cart");
  if (!badge || !anchor) return;

  // Transiciones de visibilidad
  if (count > 0) {
    // si estaba oculto, mostrar con pop
    if (badge.classList.contains("is-hidden")) {
      badge.classList.remove("is-hidden");
      badge.removeAttribute("aria-hidden");
      badge.classList.remove("pop-out");
      // pop + shake solo cuando pasamos de 0 a >0
      badge.classList.add("pop-in");
      anchor.classList.add("shake");
      setTimeout(() => {
        badge.classList.remove("pop-in");
        anchor.classList.remove("shake");
      }, 500);
    }
  } else {
    // si pasamos a 0, animación de salida y ocultar al final
    if (!badge.classList.contains("is-hidden")) {
      badge.classList.add("pop-out");
      setTimeout(() => {
        badge.classList.add("is-hidden");
        badge.setAttribute("aria-hidden", "true");
        badge.classList.remove("pop-out");
        // también resetea el dígito a 0
        const counter = badge.querySelector(".counter");
        if (counter) counter.innerHTML = `<span class="num">0</span>`;
      }, 180);
    }
  }
}

function paintBadge(count) {
  const counter = document.querySelector("#cartBadge .counter");
  if (!counter) return;
  counter.innerHTML = `<span class="num">${count}</span>`;
}

// animación vertical del número
function animateBadge(count) {
  const counter = document.querySelector("#cartBadge .counter");
  if (!counter) return;

  const oldNum = counter.querySelector(".num");
  const from = oldNum ? oldNum.textContent : "0";
  const to = String(count);
  if (from === to) return;

  const next = document.createElement("span");
  next.className = "num";
  next.textContent = to;
  next.style.animation = "upIn 220ms ease forwards";

  if (oldNum) oldNum.style.animation = "upOut 220ms ease forwards";

  counter.appendChild(next);
  setTimeout(() => oldNum && oldNum.remove(), 240);
}

function refreshCartBadge(animated = false) {
  const count = getCartCount();
  ensureBadge(count);
  if (animated && count > 0) animateBadge(count);
  else paintBadge(count);
  lastCount = count;
}

document.addEventListener("DOMContentLoaded", () => {
  // primer pintado (sin animación)
  refreshCartBadge(false);
});

window.addEventListener("storage", (e) => {
  if (e.key === "so-cart") refreshCartBadge(true);
});

// evento desacoplado desde el carrito
window.addEventListener("cart:updated", () => refreshCartBadge(true));

// expón una función por si prefieres llamarla directo
window.refreshCartBadge = refreshCartBadge;
