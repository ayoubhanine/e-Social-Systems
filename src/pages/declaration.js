import { css, html } from "../utils/index";
import { DECLARATIONS, EMPLOYERS } from "../data/index.js";
import toast from "../utils/toast.js";
function template() {
  return html`
    <header><h1>Declarations</h1></header>
    <section class="declarations-page">
      <div class="declaration-card">
        <div class="card-header">
          <span
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6366f1"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-file-text-icon lucide-file-text"
            >
              <path
                d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
              />
              <path d="M14 2v5a1 1 0 0 0 1 1h5" />
              <path d="M10 9H8" />
              <path d="M16 13H8" />
              <path d="M16 17H8" /></svg
          ></span>
          <h2>Nouvelle Déclaration Mensuelle</h2>
        </div>

        <div class="card-body">
          <div class="field">
            <label>Employeur</label>
            <select id="employer-select" required>
              <option value="">-- Sélectionner un employeur --</option>
            </select>
          </div>

          <div class="field">
            <label>Mois</label>
            <input id="mois" type="date" value="2026-02-01" />
          </div>

          <button id="declare-btn" class="declare-btn">
            <span
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-file-input-icon lucide-file-input"
              >
                <path
                  d="M4 11V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1"
                />
                <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                <path d="M2 15h10" />
                <path d="m9 18 3-3-3-3" /></svg
            ></span>
            Déclarer
          </button>
        </div>
      </div>
    </section>
  `;
}

function styles() {
  return css`
    * {
      box-sizing: border-box;
    }

    .declarations-page {
      padding: 32px;
    }

    // .declarations-page h1 {
    //   font-size: 28.8px;
    //   font-weight: 700;
    //   margin-bottom: 24px;
    // }

    .declaration-card {
      margin-top: 40px;
      background: var(--card);
      border-radius: 16px;
      padding: 24px 32px;
      max-width: 1200px;
      box-shadow: var(--shadow-lg);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .card-header h2 {
      font-size: 17.6px;
      font-weight: 600;
    }

    .card-body {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 20px;
      align-items: end;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    label {
      font-size: 14.4px;
      font-weight: 500;
      color: var(--muted-foreground);
    }
    select {
      color: #070707;
    }
    select,
    input {
      padding: 8.8px 12px;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: var(--background);
    }

    .declare-btn {
      display: flex;
      gap: 12px;
      background: #22c55e;
      color: white;
      border: none;
      padding: 9.6px 20.8px;
      border-radius: var(--radius);
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }

    .declare-btn:hover {
      opacity: 0.9;
    }
  `;
}

function addEmployerDeclaration(employerId, date) {
  // Get employer
  const employer = EMPLOYERS.get(employerId);
  if (!employer) {
    toast.error("Employeur introuvable");
    return null;
  }

  // Créer déclaration pour l'employeur (sans employee_id)
  const declaration = {
    id: crypto.randomUUID().slice(0, 8),
    employee_id: null,
    employer_id: employerId,
    date: new Date(date),

    get total_contribution() {
      const emp = EMPLOYERS.get(this.employer_id);
      if (!emp) return 0;

      let total = 0;
      emp.employees.forEach((employee) => {
        total += employee.contribution;
        total += Math.min(employee.salary, 6000) * 0.08;
      });
      return Math.ceil(total);
    },

    get penalties() {
      const emp = EMPLOYERS.get(this.employer_id);
      if (!emp) return 0;

      const days_since = get_days_between_dates(this.date, new Date());
      const days_late = Math.max(0, days_since - 30);

      if (days_late <= 0) return 0;

      let base = 0;
      emp.employees.forEach((employee) => {
        base += employee.contribution + emp.contribution / emp.employee_count;
      });

      return Math.ceil(days_late * base * 0.00005);
    },
  };

  // AJOUT DIRECT AU MAP
  DECLARATIONS.set(declaration.id, declaration);

  // Vérifier que l'ajout a fonctionné
  console.log("DECLARATIONS après ajout:", DECLARATIONS.size);
  console.log("Déclaration ajoutée:", declaration);

  return declaration;
}

function script() {
  const btn = document.getElementById("declare-btn");
  const select = document.getElementById("employer-select");
  if (!select) return;

  EMPLOYERS.forEach((emp) => {
    const option = document.createElement("option");
    option.value = emp.id;
    option.textContent = emp.company_name;
    select.appendChild(option);
  });

  if (!btn) return;
  btn.onclick = () => {
    const employerId = select.value;
    const mois = document.getElementById("mois").value;

    if (!employerId) {
      toast.error("Veuillez sélectionner un employeur");
      return;
    }

    if (!mois) {
      toast.error("Veuillez sélectionner un mois");
      return;
    }

    const declaration = addEmployerDeclaration(employerId, mois);

    if (declaration) {
      toast.withLink("Déclaration réussie", "Voir l'historique", "/historique");

      // Réinitialiser select
      select.value = "";

      // Rafraîchir la page historique SI ELLE EST OUVERTE
      const historiquePage = document.querySelector(".historique");
      if (historiquePage) {
        // Importer dynamiquement Historique et re-render
        import("./Historique.js").then((module) => {
          const defaultHistorique = module.default;
          if (defaultHistorique && defaultHistorique.script) {
            // Re-run script pour mettre à jour l'affichage
            defaultHistorique.script();
          }
        });
      }
    }
  };
}

const declaration = {
  template,
  styles,
  script,
};

export default declaration;
