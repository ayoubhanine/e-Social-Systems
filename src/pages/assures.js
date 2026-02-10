import { css, html } from "../utils/index";
import { get_all_employees, get_all_employers, get_employer_by_id } from "../lib/functions";
import { Employee } from "../lib/classes.js";
import { generateExampleData } from "../utils/example.js";
import { EMPLOYERS } from "../data";

generateExampleData()
function template() {
  return html`
    <section class="assures-section">
      <header class="assures-header">
        <h1>Gestion des Assurés</h1>
      </header>

      <div class="ae">
        <div class="aa">
          <h4>Gestion des assurés et salaires</h4>
          <button id="btnAdd" class="btn-add">+ Ajouter Assurés</button>
        </div>

        <div class="aaa">
          
          <table class="assures-table" id="assuresTable">
          <thead>
            <tr>
              <th>ID Assuré</th>
              <th>Nom complet</th>
              <th>Salaire (DH)</th>
              <th>Employeur</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="assuresBody"></tbody>
        </table> <div id="droitsCard" class="droits-card hidden">
        <h3>Consultation des droits</h3>
        <p><strong>ID Assuré :</strong> <span id="droitId"></span></p>
        <p><strong>Nom :</strong> <span id="droitNom"></span></p>
        <p><strong>Salaire :</strong> <span id="droitSalaire"></span></p>
        <p><strong>Mois déclarés :</strong> <span id="moisDeclares"></span></p>
        <p><strong>Total cotisé :</strong> <span id="totalCotise"></span></p>
        <button id="btnCloseDroits">Fermer</button>
      </div></div>
      </div>

      <form id="assureForm" class="assure-form hidden">
        <h3>Nouvel assuré</h3>

       

        <label>
          Nom Complet:<input type="text" id="nomComplet" required />
        </label>

        <label>
          Salaire Mensuel (DH): <input type="number" id="salaire" required />
        </label>

        <label>
          Employeur:
          <select id="employeur" class="epaiceur">
            <option value="">--Choisir--</option>
            ${get_all_employers()
              .map(
                (e) =>
                  `<option value="${e.id}">${e.company_name}</option>`
              )
              .join("")}
          </select>
        </label>

        <div class="form-actions">
          <button type="button" id="btnCancel" class="btn-cancel">
            Annuler
          </button>
          <button type="submit" class="btn-save">Enregistrer</button>
        </div>
      </form>

     
    </section>
  `;
}


function styles() {
  return css`
  .aaa{
  display :flex;
  gap: 20px;
  align-items: flex-start;}
  label {
  display: flex;
  flex-direction: column; 
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
.assures-table {
  flex: 3;
}

.droits-card {
  flex: 1;
}

  .epaiceur{
  height:28px
  }
    .assures-section {
      padding: 0;
    }

    .assures-header {
      margin-bottom: 1.5rem;
    }

    .aa {
      display: flex;
      justify-content: space-between;
    }

    .ae {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 1.5rem;
    }

    .btn-add {
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      cursor: pointer;
    }

    .assures-table {
      display: none;
      width: 100%;
      border-collapse: collapse;
       
  
    }

    .assures-table th,
    .assures-table td {
      border-bottom: 1px solid #e5e7eb;
      padding: 0.6rem;
    }

    .link-droits {
      color: #2563eb;
      cursor: pointer;
      text-decoration: underline;
    }

    .btn-edit-salaire {
      margin-left: 0.5rem;
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  background: #e0e7ff;
  color: #1e40af;
  border: none;
  border-radius: 6px;
  cursor: pointer;
    }
  .btn-edit-salaire:hover {
  background: #c7d2fe;
}
  @media (max-width: 768px) {
  .assures-table {
    font-size: 0.85rem;
  }

  .btn-edit-salaire {
    margin-top: 4px;
    display: block;
  }
}

      .assures-table thead {
  background: #f8fafc;
}
  .assures-table th {
  text-align: left;
  padding: 0.9rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}
  .assures-table td {
  padding: 0.75rem 0.9rem;
  color: #374151;
  border-bottom: 1px solid #f1f5f9;
}

/* Hover row */
.assures-table tbody tr:hover {
  background: #f1f5f9;
}
  .assures-table tbody tr:nth-child(even) {
  background: #fafafa;
}

    .assure-form {
      max-width: 550px;
      margin: auto;
      display: flex;
      flex-direction: column;
      background: #fff;
      padding: 1.2rem;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      gap: 1.9rem;
      position: fixed; 
      top: 75px;
      left: 50%;
    }

    .form-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-save {
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
    }

    .btn-cancel {
      background: #e5e7eb;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
    }

    .droits-card {
      max-width: 400px;
      margin-top: 1rem;
      padding: 1rem;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
      .droits-card button {
  margin-top: 1rem;
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
}

    .hidden {
      display: none;
    }
      @media (max-width: 900px) {
  .aaa {
    flex-direction: column;
  }

  .droits-card {
    width: 100%;
  }
}

  `;
}


function script() {
  const btnAdd = document.getElementById("btnAdd");
  const form = document.getElementById("assureForm");
  const btnCancel = document.getElementById("btnCancel");
  const table = document.getElementById("assuresTable");
  const tableBody = document.getElementById("assuresBody");

  const nomComplet = document.getElementById("nomComplet");
  const salaire = document.getElementById("salaire");
  const employeurSelect = document.getElementById("employeur");

  const droitsCard = document.getElementById("droitsCard");
  const droitId = document.getElementById("droitId");
  const droitNom = document.getElementById("droitNom");
  const droitSalaire = document.getElementById("droitSalaire");
  const moisDeclaresSpan = document.getElementById("moisDeclares");
  const totalCotiseSpan = document.getElementById("totalCotise");
  const btnCloseDroits = document.getElementById("btnCloseDroits");

  let employees = get_all_employees();
  renderTable()

  function renderTable() {
    tableBody.innerHTML = "";
    employees.forEach((emp, index) => {
      const tr = document.createElement("tr");
      tr.dataset.index = index;
      tr.innerHTML = `
        <td>${emp.id}</td>
        <td>${emp.name}</td>
        <td>
          ${emp.salary}
          <button class="btn-edit-salaire">Modifier</button>
        </td>
        <td>${[...EMPLOYERS.values()].find(e=>e.get_employee(emp.id))?.company_name}</td>
        <td><a href="#" class="link-droits">Droits</a></td>
      `;
      tableBody.appendChild(tr);
    });

    table.style.display = employees.length ? "table" : "none";
  }

  btnAdd.onclick = () => {
    form.classList.remove("hidden");
    form.reset();
  };

  btnCancel.onclick = () => {
    form.classList.add("hidden");
  };

  form.onsubmit = (e) => {
    e.preventDefault();

    if (!nomComplet.value || !salaire.value) return;

    
    const emp = new Employee(nomComplet.value, Number(salaire.value));
    let employerId = employeurSelect.value;
    emp.months_declared = 8; // exemple
    employees.push(emp);
    get_employer_by_id(employerId).add_employee(emp)
    renderTable();
    form.classList.add("hidden");
  };

  tableBody.onclick = (e) => {
    const row = e.target.closest("tr");
    if (!row) return;

    const emp = employees[row.dataset.index];

    if (e.target.classList.contains("btn-edit-salaire")) {
      const newSalary = prompt("Nouveau salaire :", emp.salary);
      if (newSalary) {
        emp.salary = Number(newSalary);
        renderTable();
      }
    }

    if (e.target.classList.contains("link-droits")) {
      e.preventDefault();
      const mois = emp.months_declared || 0;
      const total = emp.contribution * mois;

      droitId.textContent = emp.id;
      droitNom.textContent = emp.name;
      droitSalaire.textContent = emp.salary + " DH";
      moisDeclaresSpan.textContent = mois;
      totalCotiseSpan.textContent = total.toFixed(2) + " DH";

      droitsCard.classList.remove("hidden");
    }
  };

  btnCloseDroits.onclick = () => {
    droitsCard.classList.add("hidden");
  };
}


const assures = { template, styles, script };
export default assures;
