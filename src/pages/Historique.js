import { css, html } from "../utils/index";
function template() {
  return html`
    <section class="historique">
      <header >
        <h1>Historique</h1>
      </header>
    </section>
  `;
}

function styles() {
  return css`
  .historique{
    height:120vh;
  }
  

  `;
}
function script() {}

function cleanup() {}

const historique = {
  template,
  styles,
  script,
  cleanup,
};

export default historique;
