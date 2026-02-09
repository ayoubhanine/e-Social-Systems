import { css, html, select } from "../utils/index";
import { get_all_employers } from "../lib/functions";
import { generateExampleData } from "../utils/example";
const now = `${get_now().getFullYear()}-${String(get_now().getMonth() + 1).padStart(2, "0")}`;
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
              <select applied="false">
                <option value="">Employeur</option>
                ${get_all_employers()
                  .map(
                    (employer) =>
                      html`<option value="${employer.id}">
                        ${employer.company_name}
                      </option>`,
                  )
                  .join("\n")}
              </select>
            </div>
            <div class="filter__months">
              <input type="month" applied="false" value="${now}" />
            </div>
          </div>
          <button id="reset_filters">Réinitialiser</button>
        </div>
        <hr />
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
      .filter {
        display: flex;
        gap: 0.5rem;
      }
      input,
      select {
        transition:
          all 0.2s ease,
          background-color 0.2s ease;
        border-radius: var(--radius);
        border: 1px solid var(--border);
        padding: 0.25rem 0.5rem;
        width: 12rem;
        height: 2.5rem;
        font-size: 0.9rem;
        cursor:pointer;
      }
      input:active,
      input:focus,
      select:active,
      select:focus {
        outline: none;
        border-color: var(--primary);
      }

      option {
        color: var(--foreground);
        background-color: var(--background);
      }
      [applied="true"] {
        background-color: var(--primary);
        color: var(--primary-foreground);
      }
      #reset_filters {
        color: var(--foreground);
        background-color: var(--background);
        border: 1px solid var(--border);
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius);
        transition: all 0.2s ease;
        font-size: 1rem;
        height: 2.5rem;
        margin-left: auto;
        cursor: pointer;
      }
      #reset_filters:hover {
        background-color: var(--primary);
        color: var(--primary-foreground);
      }
      hr {
        margin: 1rem 0;
        height: 0.2px;
        border: none;
        border-radius: 10px;
        background-color: var(--muted-foreground);
        opacity: 0.5;
      }
    }
  `;
}

let month_input, employer_select, reset_filters_btn, page;
function script() {
  page = select(".historique");
  month_input = page.querySelector("input[type='month']");
  month_input?.addEventListener("change", month_input_handler);
  employer_select = page.querySelector("#filter__employer select");
  employer_select?.addEventListener("change", select_employer_handler);
  reset_filters_btn = page.querySelector("#reset_filters");
  reset_filters_btn?.addEventListener("click", reset_filters_handler);
}

function select_employer_handler(e) {
  if (e.target.value) {
    e.target.setAttribute("applied", "true");
  } else {
    e.target.setAttribute("applied", "false");
  }
}
/**
 * @param {Event | InputEvent} e
 */
function month_input_handler(e) {
  if (e.target.value) {
    e.target.setAttribute("applied", "true");
  } else {
    e.target.setAttribute("applied", "false");
  }
}

function reset_filters_handler() {
  month_input.value = now;
  month_input.setAttribute("applied", "false");
  employer_select.value = "";
  employer_select.setAttribute("applied", "false");
}
function cleanup() {
  const page = select(".historique");
  const month_input = page.querySelector("input[type='month']");
  month_input?.removeEventListener("change", month_input_handler);
  const employer_select = page.querySelector("#filter__employer select");
  employer_select?.removeEventListener("change", select_employer_handler);
  const reset_filters_btn = page.querySelector("#reset_filters");
  reset_filters_btn?.removeEventListener("click", reset_filters_handler);
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
