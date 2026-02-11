import {css, html} from "../utils/index"
import { get_all_employers } from "../lib/functions";
import { generateExampleData } from "../utils/example";

// generateExampleData(); 
function template(){
    return html`
    <section class="assures-section">
      
           <header class="assures-header"> 
            <h1>Gestion des Assurés</h1>
               
        </header>
        <div class="ae">
          <div class="aa"> 
             <h4>Gestion des assurés et salaires</h3>
              <button id="btnAdd" class="btn-add">+Ajouter Assures</button> 
            </div>
      
         <table class="assures-table" id="assuresTable">
        <thead>
          <tr>
            <th>ID Assuré</th>
            <th>Nom complet</th>
            <th>Salaire (DH)</th>
            <th>Employeur</th>
            <th> Action </th>
          </tr>
        </thead>
        <tbody id="assuresBody">
          
        </tbody>
      </table>  </div>
        <form id="assureForm" class="assure-form hidden">
            <h3>Nouvel assure</h3>
                <label> CIN
                <input type="text" id="idAssure" required/> </label>

                <label>Nom Complet
                <input type="text" id="nomComplet" required/> </label>

                <label>Salaire Mensuel (DH)
                <input type="number" id="salaire" required/> </label>

                 

               <label>
                     Employeur
                    <select id="employeur" >
                         <option value="">--Choisir--</option>
  ${get_all_employers().map(e =>
    `<option value="${e.id}">${e.company_name}</option>`
  ).join("")}
                                                </select>
                </label>

                <div class="form-actions">
                    
                    <button type="button" id="btnCancel" class="btn-cancel">Annuler</button>
                    <button type="submit" class="btn-save">Enregistrer</button>
                        </div>
                     </form>
<div id="droitsCard" class="droits-card hidden">
  <h3>Consultation des droits</h3>
  <p><strong>ID Assuré :</strong> <span id="droitId"></span></p>
  <p><strong>Nom :</strong> <span id="droitNom"></span></p>
  <p><strong>Salaire :</strong> <span id="droitSalaire"></span></p>
  <p><strong>Mois déclarés :</strong> <span id="moisDeclares"></span></p>
  <p><strong>Total cotisé : </strong><span id="totalCotise"></span></p>

  <button id="btnCloseDroits">Fermer</button>
</div>


       
    
    </section>
    `
}

function styles(){
    return css`
    .droits-card {
  max-width: 400px;
  background: #fff;
  padding: 1.2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-top: 1.5rem;
}

.link-droits {
  color: #2563eb;
  cursor: pointer;
  text-decoration: underline;
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

    .aa{
     display: flex;
   
      gap: 490px;
    }
    .ae{
    display: flex;
    flex-direction: column;
      gap: 20px;
      padding:1.5rem
    }
    .assures-table {
    display:none;
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.assures-table th,
.assures-table td {
  border-bottom: 1px solid #e5e7eb;
  padding: 0.6rem;
  text-align: left;
}

    .assures-section {
      padding: 0;
    }

    .assures-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .btn-add {
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      cursor: pointer;
    }
form {
  width: 400px;      
  margin: 0 auto;    /* centrer  horizontalement */
}

    .assure-form {
    display:flex;
    flex-direction:column; 
      max-width: 400px;
      background: #fff;
      padding: 1.2rem;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .assure-form h3 {
      margin-bottom: 1rem;
    }

    .assure-form label {
      display: flex;
      flex-direction: column;
      font-size: 0.9rem;
      margin-bottom: 0.8rem;
    }

    .assure-form input,
    .assure-form select {
      padding: 0.5rem;
      border-radius: 6px;
      border: 1px solid #ccc;
    }

    .form-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .btn-save {
      background: #2563eb;
      color: #fff;
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

    .hidden {
      display: none;
    }
.btn-edit-salaire {
  margin-left: 0.5rem;
  background: #e5e7eb;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.75rem;
}

    
    `
}

function script(){
  const rows = document.querySelectorAll("tbody tr");
  const moisDeclares = rows.length;

document.getElementById("moisDeclares").textContent = moisDeclares;

let totalCotise = 0;

rows.forEach(row => {
  const salaireText = row.querySelector(".salaire").textContent;
  const salaire = parseFloat(salaireText);
  totalCotise += salaire;
});

document.getElementById("totalCotise").textContent =
  totalCotise.toFixed(2) + " DH";

   const btnAdd = document.getElementById("btnAdd")
  const form = document.getElementById("assureForm")
  const btnCancel = document.getElementById("btnCancel")
  const tableBody = document.getElementById("assuresBody")
  const table=document.getElementById("assuresTable")

  const idAssure = document.getElementById("idAssure")
  const nomComplet = document.getElementById("nomComplet")
  const salaire = document.getElementById("salaire")
  const employeur = document.getElementById("employeur")

  const droitsCard = document.getElementById("droitsCard")
const droitId = document.getElementById("droitId")
const droitNom = document.getElementById("droitNom")
const droitSalaire = document.getElementById("droitSalaire")
const btnCloseDroits = document.getElementById("btnCloseDroits")

tableBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("link-droits")) {
    e.preventDefault()

    const row = e.target.closest("tr")

    droitId.textContent = row.children[0].textContent
    droitNom.textContent = row.children[1].textContent
    droitSalaire.textContent = row.children[2].childNodes[1].textContent.trim()+ " DH";

    droitsCard.classList.remove("hidden")
  }
})
btnCloseDroits.addEventListener("click",()=>{
    droitsCard.classList.add("hidden")
})
  btnAdd.addEventListener("click", () => {
    form.classList.remove("hidden")
  })

  btnCancel.addEventListener("click", () => {
    form.classList.add("hidden")
  })

  form.addEventListener("submit", (e) => {
    e.preventDefault()
   
    const tr = document.createElement("tr")

    tr.innerHTML = `
      <td>${idAssure.value}</td>
      <td>${nomComplet.value}</td>
      <td>  <span class="salaire-value">${salaire.value}</span>
  <button class="btn-edit-salaire">Modifier</button> </td>
      <td>${employeur.value}</td>
      <td><a href="#" class="link-droits" data-id="${idAssure.value}">Droits</a>
      </td>
    `

    tableBody.appendChild(tr)

    if (tableBody.children.length > 0) {
  table.style.display = "table"
}

    const assure = {
      id: idAssure.value,
      nom: nomComplet.value,
      salaire: salaire.value,
      employeur: employeur.value
    }

    console.log("Nouvel assuré :", assure)
    
    form.reset()
    form.classList.add("hidden")
  })
  tableBody.addEventListener("click", (e) => {

  if (e.target.classList.contains("btn-edit-salaire")) {
    const row = e.target.closest("tr")
    const salaireSpan = row.querySelector(".salaire-value")

    const nouveauSalaire = prompt(
      "Entrer le nouveau salaire :",
      salaireSpan.textContent
    )

    if (nouveauSalaire !== null && nouveauSalaire !== "") {
      salaireSpan.textContent = nouveauSalaire
    }
  }

})



}

const assures = {template,
    styles,
    script
}

export default assures;