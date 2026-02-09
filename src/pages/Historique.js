import { css, html, select } from "../utils/index";
import { get_all_employers } from "../lib/functions";
import { generateExampleData } from "../utils/example";
generateExampleData(); 
function template() {
  return html`
    <section class="historique">
      <header>
        <h1>Historique</h1>
      </header>
      <main>
        <div class="filters">
          <p>Filtrez par:</p>
          <div class="filter">
            <div id="filter__employer">
              <select>
                <option value="">Employeur</option>
                ${get_all_employers().map(
                  (employer) =>
                    `<option value="${employer.id}">${employer.company_name}</option>`
                ).join("\n")}
              </select>
            </div>
            <div class="filter__months">
              <input type="month" />
            </div>
          </div>
        </div>
      </main>
    </section>
  `;
}

function styles() {
  return css`
    .historique {
      main {
        padding: 1.3rem;
      }
      .filters {
        display: flex;
        align-items: center;
        gap: 0 1rem;
      }
      input[type="month"] {
        border-radius: var(--radius);
        border: 1px solid var(--border);
        padding: 0.25rem 0.5rem;
      }
    }
  `;
}
function script() {
  const page = select(".historique");
  const month_input = page.querySelector("input[type='month']");
  month_input.value = `${get_now().getFullYear()}-${String(get_now().getMonth() + 1).padStart(2, "0")}`;
  month_input?.addEventListener("change", month_input_handler);
}

/**
 * @param {Event | InputEvent} e
 */
function month_input_handler(e) {
  console.log(e.target?.value);
}

function cleanup() {
  const page = select(".historique");
  const month_input = page.querySelector("input[type='month']");
  month_input?.removeEventListener("change", month_input_handler);
}

function get_now() {
  return new Date();
}
const Historique = {
  template,
  styles,
  script,
  cleanup,
};

export default Historique;
