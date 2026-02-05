import {css, html} from "../utils/index"
function template(){
    return html`
        <section class="declarations-page">
            <h1>Declarations</h1>
            <hr>
            <div class="declaration-card">
                <div class="card-header">
                <span ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg></span>
                <h2>Nouvelle Déclaration Mensuelle</h2>
                </div>

                <div class="card-body">
                <div class="field">
                    <label>Employeur</label>
                    <select>
                    <option>--Selectionner--</option>
                    </select>
                </div>

                <div class="field">
                    <label>Mois</label>
                    <input type="month" value="2026-02" />
                </div>

                <button id="declare-btn" class="declare-btn">
                <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-input-icon lucide-file-input"><path d="M4 11V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></svg></span>
                    Déclarer
                </button>
                </div>
            </div>
        </section>
    `;
}

function styles(){
    return css`
.declarations-page {
      padding: 2rem;
    }

    .declarations-page h1 {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
    }

    .declaration-card {
        margin-top:40px;
        background: var(--card);
        border-radius: 1rem;
        padding: 1.5rem 2rem;
        max-width: 1200px;
        box-shadow: var(--shadow-lg);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .card-header h2 {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .card-body {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 1.25rem;
      align-items: end;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    label {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--muted-foreground);
    }

    select,
    input {
      padding: 0.55rem 0.75rem;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: var(--background);
    }

    .declare-btn {
      display:flex;
      gap: 0.75rem;
      background: #22c55e;
      color: white;
      border: none;
      padding: 0.6rem 1.3rem;
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

function script(){
  const btn = document.getElementById("declare-btn");

  if (!btn) return;

  btn.addEventListener("click", () => {
    
    window.location.hash = "#/historique";
  });
}

const declaration = {
    template,
    styles,
    script
}

export default declaration