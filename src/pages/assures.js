import { css, html } from "../utils/index";
import { add_employee, get_all_employees, get_all_employers, get_employee_by_id, get_employee_rights, get_employer_by_id } from "../lib/functions";
import { Employee } from "../lib/classes.js";

import { DECLARATIONS, EMPLOYERS } from "../data";


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
  display: flex;
  align-items: center;      
  justify-content: center;  
  background-color:transparent;
  height:1rem;
  width:1rem;
  border: none;
  cursor: pointer;
}
.btn-edit-salaire:hover{
  svg{
    transition:scale 300ms ease-in;
    scale:1.05;
  }
}
td.salary{
  display:flex;
  align-items:center;
  gap:4px;
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

  renderTable()

  function renderTable() {
    const employees  = get_all_employees()
    tableBody.innerHTML = "";
    employees.forEach((emp) => {
      const tr = document.createElement("tr");
      tr.setAttribute("employee-id" ,  emp.id)
      tr.innerHTML = html`
        <td>${emp.id}</td>
        <td>${emp.name}</td>
        <td class="salary">
          <button class="btn-edit-salaire" >
          <svg  width="15" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V12" 
stroke="red"
stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.375 2.62498C18.7728 2.22716 19.3124 2.00366 19.875 2.00366C20.4376 2.00366 20.9771 2.22716 21.375 2.62498C21.7728 3.02281 21.9963 3.56237 21.9963 4.12498C21.9963 4.68759 21.7728 5.22716 21.375 5.62498L12.362 14.639C12.1245 14.8762 11.8312 15.0499 11.509 15.144L8.63597 15.984C8.54992 16.0091 8.45871 16.0106 8.37188 15.9883C8.28505 15.9661 8.2058 15.9209 8.14242 15.8575C8.07904 15.7942 8.03386 15.7149 8.01162 15.6281C7.98937 15.5412 7.99087 15.45 8.01597 15.364L8.85597 12.491C8.9505 12.169 9.12451 11.876 9.36197 11.639L18.375 2.62498Z"
 stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
          </button>
          <span>${emp.salary}</span>
        </td>
        <td>${[...EMPLOYERS.values()].find(e => e.get_employee(emp.id))?.company_name}</td>
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
    add_employee( employerId ,emp);  // liason entre employee et employer
    renderTable();
    form.classList.add("hidden");
  };

  tableBody.onclick = (e) => {
    const row = e.target.closest("tr");
    if (!row) return;

    const id = row.getAttribute("employee-id");
    const employee = get_employee_by_id(id)
    
    
    if (e.target.parentNode.classList.contains("btn-edit-salaire")) {
      const newSalary = prompt("Nouveau salaire :" , employee.salary);
      if (newSalary) {
        employee.set_salary(Number(newSalary))
        renderTable();
      }
    }

    if (e.target.classList.contains("link-droits")) {
      e.preventDefault();
      const mois = get_employee_declared_months(id);
      console.log(employee)
      const total = get_employee_rights(id);
      droitId.textContent = employee.id;
      droitNom.textContent = employee.name;
      droitSalaire.textContent = employee.salary + " DH";
      moisDeclaresSpan.textContent = mois;
      totalCotiseSpan.textContent = total + " DH";
      droitsCard.classList.remove("hidden");
    }
  };

  btnCloseDroits.onclick = () => {
    droitsCard.classList.add("hidden");
  };
}


function get_employee_declared_months(id){
  let declared = 0 
  for(let emp of DECLARATIONS.values()){
    if(emp.employee_id === id) declared++
  }
  return declared
}

const assures = { template, styles, script };
export default assures;
