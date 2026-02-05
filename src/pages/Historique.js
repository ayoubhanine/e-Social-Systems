import { css, html } from "../utils/index";
function template() {
  return html`
    <section class="historique">
      <header>Historique des Déclarations</header>
    </section>
  `;
}

function styles() {
  return css``;
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
