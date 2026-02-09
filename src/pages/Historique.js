import { css, html, select } from "../utils/index";
import { get_all_employers, get_employer_by_id } from "../lib/functions";
import { generateExampleData } from "../utils/example";
import { Declaration } from "../lib/classes";
import { DECLARATIONS } from "../data";
const now = `${get_now().getFullYear()}-${String(get_now().getMonth() + 1).padStart(2, "0")}`;
generateExampleData(3, 3, 3);
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

        <div class="historique__grid">
          <div class="grid-header">
            <div class="grid-cell header-cell">Mois</div>
            <div class="grid-cell header-cell">Employeur</div>
            <div class="grid-cell header-cell">Total Cotisé</div>
            <div class="grid-cell header-cell">Pénalités</div>
            <div class="grid-cell header-cell">Salarie</div>
          </div>
          <div id="historique__tbody">
            ${Array.from(DECLARATIONS.values())
              .map((declaration) => create_row(declaration))
              .join("\n")}
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
        padding: 0 1.3rem;
      }
      .filters {
        display: flex;
        align-items: center;
        margin: 1rem 0 2rem 0;
        gap: 0 1rem;
      }
      .filter {
        display: flex;
        align-items: center;
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
        cursor: pointer;
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

      .historique__grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 0;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        overflow: hidden;
        background-color: var(--card);
        box-shadow: var(--shadow-xs);
        margin-bottom: 2rem;
      }
      .grid-header {
        display: contents;
      }
      #historique__tbody {
        display: contents;
      }
      .header-cell {
        background-color: color-mix(in srgb, var(--primary) 10%, var(--card));
        font-weight: 600;
        color: var(--foreground);
        padding: 1rem;
        border-right: 1px solid var(--border);
        border-bottom: 2px solid var(--border);
        font-size: 0.8rem;
      }

      .header-cell:last-child {
        border-right: none;
      }
      .grid-row {
        display: contents;
      }

      .grid-cell {
        padding: 0.75rem 1rem;
        border-right: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        color: var(--foreground);
        display: flex;
        font-size: 0.8rem;
        align-items: center;
      }
      .grid-cell.employer-name {
        font-weight: 500;
        word-wrap: normal;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .grid-cell.total-contribution {
        color: darkgreen;
        font-weight: 500;
      }
      .grid-cell.penalty {
        color: var(--destructive);
      }
      .grid-cell:last-child {
        border-right: none;
      }
      .grid-row:last-child .grid-cell {
        border-bottom: none;
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

function get_now() {
  return new Date();
}

/**
 * Create a row for a given declaration
 * @param {Declaration} declaration
 * @returns {string}
 */
function create_row(declaration) {
  let employer = get_employer_by_id(declaration.employer_id);
  return html`
    <div class="grid-row">
      <div class="grid-cell month">
        ${new Date(declaration.date).toLocaleDateString("fr-FR", {
          month: "short",
          year: "numeric",
        })}
      </div>
      <div class="grid-cell employer-name">${employer.company_name}</div>
      <div class="grid-cell total-contribution">
        +${declaration.total_contribution} DH
      </div>
      <div class="grid-cell penalty">
        ${declaration.penalties > 0 ? "-" + declaration.penalties+" DH" : "-"}
      </div>
      <div class="grid-cell employee-count">
        ${get_employer_by_id(declaration.employer_id).employee_count} 
      </div>
    </div>
  `;
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
const Historique = {
  template,
  styles,
  script,
  cleanup,
};

export default Historique;
