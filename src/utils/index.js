/** * 
 @param {string} selector - the css selector of the element to select
 *@returns {Element} - the selected element or throws an error if the element is not found
 *   
*/
export const select = (selector) => {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`couldn't find element with selector ${selector}`);
  return el;
};
// just to get syntax highlighting in other files
export function html(strings, ...values) {
  return strings.reduce((acc, str, i) => {
    return acc + str + (values[i] || "");
  }, "");
}

export function css(strings, ...values) {
  return strings.reduce((acc, str, i) => {
    return acc + str + (values[i] || "");
  }, "");
}

/**
 * @param {number} ms - the number of milliseconds to sleep
 * @returns {Promise<void>} - a promise that resolves after the given number of milliseconds
 */
// a function to sleep for a given number of milliseconds
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {Function} func - the function to debounce
 * @param {number} delay - the delay in milliseconds
 * @return {Function} - the debounced function
 */
// debounce function to limit the number of times a function is called
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 *
 * @returns {string}
 */
// generate a random 8 characters id
export function generate_id() {
  return crypto.randomUUID().trim().slice(0, 8);
}
