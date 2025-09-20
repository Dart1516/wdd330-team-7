// utils.mjs

// A simple wrapper for querySelector. 
// It returns the first matching element in the DOM.
// Example: qs('#main-header') will return the header element with that ID.
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// A shorter alternative if you prefer arrow functions:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// Retrieve and parse data from localStorage by key.
// It takes a string key and returns the parsed JSON object.
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// Save data into localStorage.
// It takes a key and some data, converts the data into a string (JSON), and saves it.
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/*
  A helper function to get a parameter from the URL query string.
  Example URL: product.html?product=tent
  Calling getParam('product') would return "tent".
*/
export function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Add a listener that works for both "touch" (mobile) and "click" (desktop).
// This helps ensure buttons work on all devices.
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault(); // prevents double-firing on mobile
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Render a list of items using a template function.
// - templateFn: function that takes an item and returns an HTML string
// - parentElement: where to insert the generated HTML
// - list: array of data items
// - position: where to insert (default: at the beginning)
// - clear: if true, empties the container before inserting
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

// Render HTML content into a parent element.
// In this case, templateHtml is already a string (not a function).
export function renderWithTemplate(templateHtml, parentElement, callback) {
  if (!templateHtml || !parentElement) return;
  parentElement.innerHTML = templateHtml;
  if (callback) callback(); // optional: run extra code after rendering
}

// Load a template (partial HTML) from a given path using fetch.
// It returns the content of that file as a string.
export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

// Load the header and footer into the main page.
// This looks for #main-header and #main-footer in index.html,
// fetches the partial files, and inserts their content into those containers.
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate('/partials/header.html');
  const footerTemplate = await loadTemplate('/partials/footer.html');

  const headerElement = document.querySelector('#main-header');
  const footerElement = document.querySelector('#main-footer');

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}
