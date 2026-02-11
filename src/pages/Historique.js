import { css, html, select } from "../utils/index";
import {
  get_all_employers,
  get_employer_by_id,
  compare_date_months,
} from "../lib/functions";
import { generateExampleData } from "../utils/example";
import { Declaration } from "../lib/classes";
import { DECLARATIONS } from "../data";

const now = `${get_now().getFullYear()}-${String(get_now().getMonth() + 1).padStart(2, "0")}`;
// DECLARATIONS.clear();
generateExampleData(5, 5, 2);
function template() {
  return html`
    <section class="historique">
      <header>
        <h1>Historique</h1>
        <button id="filter_btn">
          <span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 5H22M6 12H18M9 19H15"
                stroke="#6366F1"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span> Filtres </span>
        </button>
        <div class="filters-container closed">
          <p class="font-bold filter-by">Par:</p>
          <hr />
          <div class="filters-container__block">
            <div id="filter__employer">
              <div class="filter__details">
                <p class="font-bold">Employeur</p>
                <button class="reset-btn" id="reset_employer_filter">
                  réinitialiser
                </button>
              </div>
              <select applied="false">
                <option value="">Tout</option>
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

            <div id="filter__employer">
              <div class="filter__details">
                <p class="font-bold">Mois</p>
                <button class="reset-btn" id="reset_month_filter">
                  réinitialiser
                </button>
              </div>
              <input type="month" applied="false" value="${now}" />
            </div>
          </div>
          <div class="filters-container__controls">
            <button id="apply_filters" class="apply-btn">Appliquer</button>
            <button id="reset_filters" class="reset-btn">
              Réinitialiser tous
            </button>
          </div>
        </div>
      </header>
      <main>
        <div class="historique__grid">
          <div class="grid-header">
            <div class="grid-cell header-cell">Mois</div>
            <div class="grid-cell header-cell">Employeur</div>
            <div class="grid-cell header-cell">Total Cotisé</div>
            <div class="grid-cell header-cell">Pénalités</div>
            <div class="grid-cell header-cell">Salarie</div>
          </div>
          <div id="historique__tbody"></div>
        </div>
        <div id="no_declarations">
          <h1 class="no-declarations">
            Aucune déclaration trouvée, essayez de modifier les filtres
          </h1>
        </div>
      </main>
    </section>
  `;
}

function styles() {
  return css`
    .historique {
      .font-bold {
        font-weight: 700;
      }
      hr {
        margin: 0.5rem 0;
        opacity: 0.3;
      }
      main {
        padding: 0 1.3rem;
      }
      header {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        .filter-by {
          color: var(--foreground);
          font-size: 0.9rem;
        }
      }

      input,
      select {
        transition:
          all 0.2s ease,
          background-color 0.2s ease;
        border-radius: var(--radius);
        border: 1px solid var(--border);
        padding: 0.25rem 0.5rem;
        width: 100%;
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

      #filter_btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--foreground);
        background-color: var(--background);
        border: 1px solid var(--border);
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius);
        transition: all 0.2s ease;
        font-size: 1rem;
        font-weight: medium;
        margin-left: auto;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      #filter_btn.active {
        outline: 1px solid var(--primary);
        background-color: var(--primary-foreground);
      }

      .filters-container {
        transition: all 0.2s ease;
        position: absolute;
        top: 100%;
        right: 1.3rem;
        background-color: var(--card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        box-shadow: var(--shadow-md);
        padding: 1rem;
        z-index: 10;
      }
      .filter__details {
        display: flex;
        width: 256px;
        justify-content: space-between;
        margin: 0.5rem 0;
        p {
          color: var(--secondary-foreground);
        }
        button {
          background-color: transparent;
          border: none;
          color: var(--primary);
          cursor: pointer;
        }
        button:hover {
          text-decoration: underline;
        }
      }

      .opened {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
      }
      .closed {
        opacity: 0;
        pointer-events: none;
        transform: translateY(-10px);
      }

      .filters-container__controls {
        display: flex;
        justify-content: space-between;
        padding: 1rem 0 0 0;
        button {
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background-color: var(--background);
          cursor: pointer;
        }
        .apply-btn {
          background: var(--accent);
        }
      }

      .no-declarations {
        color: var(--muted-foreground);
        text-align: center;
        padding: 2rem;
        font-size: 0.8rem;
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
      #no_declarations {
        width: 100%;
        font-size: 1rem;
      }
    }
  `;
}

let month_input,
  employer_select,
  filter_btn,
  page,
  filters_container,
  table_container,
  reset_filters_btn,
  apply_filters_btn,
  reset_month_filter_btn,
  reset_employer_filter_btn,
  no_declations_message;
function script() {
  page = select(".historique");
  no_declations_message = page.querySelector("#no_declarations");
  filters_container = page.querySelector(".filters-container");
  month_input = page.querySelector("input[type='month']");
  month_input?.addEventListener("change", month_input_handler);
  employer_select = page.querySelector("#filter__employer select");
  employer_select?.addEventListener("change", select_employer_handler);
  filter_btn = page.querySelector("#filter_btn");
  filter_btn?.addEventListener("click", toggle_filters_handler);
  table_container = page.querySelector("#historique__tbody");
  render_table(table_container, [...DECLARATIONS.values()]);
  reset_filters_btn = page.querySelector("#reset_filters");
  reset_filters_btn?.addEventListener("click", reset_filters_handler);
  apply_filters_btn = page.querySelector("#apply_filters");
  apply_filters_btn?.addEventListener("click", apply_filters_handler);
  reset_month_filter_btn = page.querySelector("#reset_month_filter");
  reset_month_filter_btn?.addEventListener("click", reset_month_filter_handler);
  reset_employer_filter_btn = page.querySelector("#reset_employer_filter");
  reset_employer_filter_btn?.addEventListener(
    "click",
    reset_employer_filter_handler,
  );
}

function reset_month_filter_handler() {
  month_input.value = now;
  month_input.setAttribute("applied", "false");
}
function reset_employer_filter_handler() {
  employer_select.value = "";
  employer_select.setAttribute("applied", "false");
}
function apply_filters_handler() {
  let filtered_declarations = Array.from(DECLARATIONS.values());
  if (month_input.getAttribute("applied") === "true") {
    filtered_declarations = filtered_declarations.filter((declaration) => {
      const declaration_month = new Date(declaration.date);
      return compare_date_months(
        declaration_month,
        new Date(month_input.value),
      );
    });
  }
  if (employer_select.getAttribute("applied") === "true") {
    filtered_declarations = filtered_declarations.filter(
      (declaration) => declaration.employer_id === employer_select.value,
    );
  }
  render_table(table_container, filtered_declarations);
  toggle_filters_handler();
  window.scroll({top:0 , behavior:"smooth"})
}

function toggle_filters_handler() {
  if (filters_container.classList.contains("opened")) {
    filters_container.classList.remove("opened");
    filters_container.classList.add("closed");
    filter_btn.classList.remove("active");
  } else {
    filters_container.classList.remove("closed");
    filters_container.classList.add("opened");
    filter_btn.classList.add("active");
  }
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
        ${declaration.penalties > 0 ? "-" + declaration.penalties + " DH" : "-"}
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

function reset_filters_handler() {
  month_input.value = now;
  month_input.setAttribute("applied", "false");
  employer_select.value = "";
  employer_select.setAttribute("applied", "false");
  toggle_filters_handler();
  render_table(table_container, [...DECLARATIONS.values()]);
  window.scroll({top:0 , behavior:"smooth"})
}
const Historique = {
  template,
  styles,
  script,
  cleanup,
};

/**
 *
 * @param {HTMLElement} container
 * @param {Declaration[]} data
 */

function render_table(container, data) {
  container.innerHTML = "";
  if (data.length === 0) {
    no_declations_message.style.display = "block";

    return;
  }
  no_declations_message.style.display = "none";

  let htmlContent = Array.from(data.values())
    .map((declaration) => create_row(declaration))
    .join("\n");
  container.innerHTML = htmlContent;
}

export default Historique;
