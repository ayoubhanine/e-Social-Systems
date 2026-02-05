import { css, html } from "../utils/index";
function template() {
  return html` <section class="your-section"></section> `;
}

function styles() {
  return css`
  h1{
    
  }
  `;
}

function script() {}

function cleanup() {}

const base = {
  template,
  styles,
  script,
  cleanup
};

export default base;
