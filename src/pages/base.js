import { css, html } from "../utils/index";
function template() {
  return html` <section class="section"></section> `;
}

function styles() {
  return css``;
}
// add event listeners or other setup when navigating to this page
function script() {}

// delete event listeners or other resources when navigating away
function cleanup(element, event, handler) {
  element?.removeEventListener(event, handler);
}

const base = {
  template,
  styles,
  script,
  cleanup,
};

export default base;
