import {css, html} from "../utils/index"
function template(){
    return html`
    <aside class="sidebar">
        <div class="logo">
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity-icon lucide-activity"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg> 
            </span>
            <h2>e-Social Systems</h2>
        </div>

        <nav class="menu">
            <a href="dashboard.html">Tableau de bord</a>
            <a href="employeurs.html">Employeurs</a>
            <a href="assures.html">Assurés</a>
            <a href="declaration.html" class="active">Déclarations</a>
            <a href="historique.html">Historique</a>
        </nav>
    </aside>
    `
}

function styles(){
    return css`
    
    
    `
}

function script(){
    
}

const base = {
    template,
    styles,
    script
}

export default base