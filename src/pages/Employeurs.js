// Array dyal les employeurs (data)
import { EMPLOYERS } from "../data";

// class bach ncreiw object jdid
import { Employer, sector_list } from "../lib/classes";

// function bach nzidou f Employers
import { add_employer } from "../lib/functions";
import example_data from "../utils/data";

// utils dyal template o styles
import { css, html } from "../utils/index";
import toast from "../utils/toast";
import { cleanup } from "./base";

function template() {
  return html`
    <section class="employeurs-page">
      <h1 class="main-title">Gestion Des Employeurs</h1>

      <div class="employeurs-container">
        <div class="page-header">
          <h2 class="page-title">Liste des sociétés affiliées</h2>
          <button class="btn-add" id="btnAddEmployeur">
            <span>+</span>
            <span>Ajouter Employeur</span>
          </button>
        </div>

        <div class="table-wrapper">
          <table class="employeurs-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Raison Sociale</th>
                <th>Secteur</th>
                <th>Employés</th>
              </tr>
            </thead>

            <!-- Tbody khawya, data ghadi tzid fuha mn script dynamiquement -->
            <tbody id="employeursTableBody"></tbody>
          </table>
        </div>
      </div>

      <!-- Modal Ajouter Employeur -->
      <div class="modal-overlay" id="modalOverlay">
        <div class="modal">
          <h2 class="modal-title">Nouvel Employeur</h2>

          <form class="modal-form" id="formAddEmployeur">
            <div class="form-group">
              <label class="form-label">Raison Sociale</label>
              <input type="text" class="form-input" id="inputRaisonSociale" />
            </div>

            <div class="form-group">
              <label class="form-label">Secteur</label>

              <select class="form-select" id="selectSecteur">
                <option value="" default>----choisie un secteur----</option>
              </select>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" id="btnCancel">
                Annuler
              </button>
              <button type="submit" class="btn-submit">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  `;
}

function styles() {
  return css`
    .employeurs-page {
      min-height: 100vh;
      background-color: #f5f7fa;
    }

    .main-title {
      font-size: 24px;
      font-weight: 700;
      color: #1a202c;
      padding: 20px 40px;
      margin: 0;
      background-color: white;
      border-bottom: 1px solid #e2e8f0;
    }

    .employeurs-container {
      padding: 30px 40px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .page-title {
      font-size: 16px;
      font-weight: 400;
      color: #718096;
      margin: 0;
    }

    .btn-add {
      background-color: #4169e1;
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background-color 0.2s;
    }

    .btn-add:hover {
      background-color: #3457c4;
    }

    .table-wrapper {
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }

    .employeurs-table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background-color: #fafbfc;
    }

    th {
      padding: 16px 20px;
      text-align: left;
      font-size: 14px;
      font-weight: 600;
      color: #2d3748;
      border-bottom: 1px solid #e2e8f0;
    }

    td {
      padding: 18px 20px;
      font-size: 14px;
      color: #2d3748;
      border-bottom: 1px solid #f7fafc;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    tbody tr:hover {
      background-color: #f7fafc;
    }

    .id-cell {
      color: #718096;
      font-weight: 500;
    }

    .company-name {
      font-weight: 600;
      color: #1a202c;
    }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      background-color: #edf2f7;
      color: #4a5568;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 500;
    }

    .employee-count {
      color: #4a5568;
      font-weight: 500;
    }

    /* ========== MODAL STYLES ========== */
    .modal-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      justify-content: center;
      align-items: center;
    }

    .modal-overlay.active {
      display: flex;
    }

    .modal {
      background-color: white;
      border-radius: 12px;
      padding: 32px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .modal-title {
      font-size: 20px;
      font-weight: 700;
      color: #1a202c;
      margin: 0 0 24px 0;
    }

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-size: 14px;
      font-weight: 600;
      color: #2d3748;
    }

    .form-input,
    .form-select {
      padding: 12px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 14px;
      color: #2d3748;
      transition: border-color 0.2s;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: #4169e1;
    }

    .form-select {
      cursor: pointer;
      background-color: white;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 8px;
    }

    .btn-cancel {
      padding: 10px 24px;
      background-color: transparent;
      color: #4a5568;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-cancel:hover {
      background-color: #f7fafc;
    }

    .btn-submit {
      padding: 10px 24px;
      background-color: #4169e1;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-submit:hover {
      background-color: #3457c4;
    }
  `;
}

function script() {
  // button "ajouter"
  const btnAdd = document.getElementById("btnAddEmployeur");

  // button "annuler"
  const btnCancel = document.getElementById("btnCancel");

  // background gris
  const modalOverlay = document.getElementById("modalOverlay");

  // form dyal modal
  const form = document.getElementById("formAddEmployeur");

  function displayEmployers() {
    const tbody = document.getElementById("employeursTableBody");

    tbody.innerHTML = "";
    // kat loop kol employeur f Employers array
    // destructing: kat khri id, company_name, emloyee_count, sector mn kol objet

    EMPLOYERS.forEach(({ id, company_name, employee_count, sector }) => {
      // kat creia row jdida
      const row = document.createElement("tr");

      // kat 7et data fiha
      row.innerHTML = `
      <td class="id-cell">${id}</td>
      <td class="company-name">${company_name}</td>
      <td><span class="badge">${sector}</span></td>
      <td class="employee-count">${employee_count}</td>
      `;

      // kat zidha f table
      tbody.appendChild(row);
    });
  }
  // t-afficher les données
  displayEmployers();

  // CLOSE: Click 3la "Annuler" → modal tat-khba o form tat-reset
  // Open modal
  btnAdd?.addEventListener("click", () => {
    modalOverlay.classList.add("active");
  });

  // click barra mn modal (3la overlay) => nfs chi
  // Close modal b button Annuler
  btnCancel?.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
    form.reset();
  });

  // Close modal ila clickiti barra
  // e.target => l3onser li clikiti 3lih bdabt
  modalOverlay?.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove("active");
      form.reset();
    }
  });

  // Submit form
  //
  function handleSubmit(e) {
    e.preventDefault();

    //Kat-khrj les valeurs dyal inputs F L-WA9T dyal submit
    const raisonSociale = document.getElementById("inputRaisonSociale").value;
    const secteur = document.getElementById("selectSecteur").value;
    console.warn(secteur);

    // submit dyal l validation
    if (!raisonSociale || !secteur) {
      toast.error("Tous les champs sont obligatoires !");
      return;
    }

    // Kat-créia objet jdid mn class Employer
    // Ajouter f table
    const employer = new Employer(secteur, raisonSociale);

    // Kat-zid l-objet f EMPLOYERS array (f data)

    add_employer(employer);

    displayEmployers();

    toast.success("employeur est ajouté avec success !");

    modalOverlay.classList.remove("active");
    form.reset();
  }
  form?.addEventListener("submit", handleSubmit);

  sector_list.forEach((sector) => {
    const option = document.createElement("option");
    option.value = sector;
    option.textContent = sector;

    document.querySelector("#selectSecteur").append(option);
  });
  // cleanup(form, "submit", handleSubmit);
}

const Employeurs = {
  template,
  styles,
  script,
};

export default Employeurs;
