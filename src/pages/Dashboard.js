import { DECLARATIONS, EMPLOYERS } from "../data";
import {
  get_average_employee_salary,
  get_highest_contributing_employer,
  get_total_contributions,
} from "../lib/functions";

import { css, html } from "../utils/index";

let myChart = null;

/**
 * Génère le template HTML du tableau de bord
 * Affiche trois cartes statistiques et un graphique
 * @returns {string} Template HTML formaté
 */
function template() {
  // Formatage du montant total des cotisations en dirham marocain
  const formated_total_contribution = new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
  }).format(get_total_contributions());

  // Formatage du salaire moyen en dirham marocain
  const formated_avg = new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
  }).format(get_average_employee_salary());

  return html`
    <header>
      <h1 class="heading">Tableau de bord</h1>
    </header>
    <section class="dashboard">
      <div class="cards">
        <!-- Carte 1: Total des cotisations collectées -->
        <div class="card">
          <div>
            <p class="title">Total Cotisations</p>
            <p>${formated_total_contribution}</p>
            <p>Montant total collecté</p>
          </div>
          <!-- Icône document -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6366f1"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-file-minus-icon lucide-file-minus"
          >
            <path
              d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
            />
            <path d="M14 2v5a1 1 0 0 0 1 1h5" />
            <path d="M9 15h6" />
          </svg>
        </div>

        <!-- Carte 2: Salaire moyen des assurés -->
        <div class="card">
          <div>
            <p class="title">Salaire Moyen</p>
            <p>${formated_avg}</p>
            <p>MSur l'ensemble des assurés</p>
          </div>
          <!-- Icône utilisateurs -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6366f1"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-users-round-icon lucide-users-round"
          >
            <path d="M18 21a8 8 0 0 0-16 0" />
            <circle cx="10" cy="8" r="5" />
            <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
          </svg>
        </div>

        <!-- Carte 3: Employeur avec le plus grand volume déclaré -->
        <div class="card">
          <div>
            <p class="title">Top Employeur</p>
            <p>${get_highest_contributing_employer()?.company_name}</p>
            <p>Plus grand volume déclaré</p>
          </div>
          <!-- Icône école/entreprise -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6366f1"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-school-icon lucide-school"
          >
            <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
            <path d="M18 5v16" />
            <path d="m4 6 7.106-3.79a2 2 0 0 1 1.788 0L20 6" />
            <path
              d="m6 11-3.52 2.147a1 1 0 0 0-.48.854V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a1 1 0 0 0-.48-.853L18 11"
            />
            <path d="M6 5v16" />
            <circle cx="12" cy="9" r="2" />
          </svg>
        </div>
      </div>

      <!-- Canvas pour le graphique Chart.js -->
      <canvas id="myChart"></canvas>
    </section>
  `;
}

/**
 * Génère les styles CSS pour le tableau de bord
 * @returns {string} Styles CSS formatés
 */
function styles() {
  return css`
    /* Container principal du tableau de bord */
    .dashboard {
      background: var(--background);
      padding: 1rem;
    }

    /* Grille des cartes statistiques - 3 colonnes */
    .dashboard .cards {
      margin-top: 3rem;
      width: 100%;
      display: grid;
      grid-template-columns: auto auto auto;
      gap: 1rem;
    }

    /* Titre du tableau de bord */
    .dashboard .heading {
      width: 100%;
    }

    /* Carte individuelle avec fond, padding et flexbox */
    .dashboard .cards .card {
      background-color: var(--card);
      padding: 2rem;
      border-radius: 10px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    /* Style pour le titre et la description (texte gris) */
    .dashboard .cards .card p:first-child,
    .dashboard .cards .card p:last-child {
      color: var(--muted-foreground);
      font-weight: 500;
    }

    /* Style pour la valeur principale (texte en gras et grand) */
    .dashboard .cards .card p:nth-child(2) {
      font-weight: bold;
      font-size: 1.5rem;
      margin: 0.2rem;
      overflow-wrap: break-word;
    }

    /* Espacement du graphique */
    #myChart {
      margin-top: 2rem;
    }
  `;
}

/**
 * Script d'initialisation du graphique Chart.js
 * Crée un graphique en barres des contributions des top employeurs sur 4 mois
 */
function script() {
  // toast.success("dkfjk");
  /**
   * Récupère les contributions des top employeurs pour les 4 derniers mois
   * @returns {Array} Tableau d'objets {month, company, contribution}
   */
  function getTopCompanyLast4Months() {
    const today = new Date();
    const fourMonthsAgo = new Date();
    // Calcul de la date il y a 4 mois
    fourMonthsAgo.setMonth(today.getMonth() - 4);

    // Objet pour grouper les contributions par mois et par entreprise
    const grouped = {};

    // Parcours de toutes les déclarations
    for (const decl of DECLARATIONS.values()) {
      const date = new Date(decl.date);

      // Filtrage : garder seulement les 4 derniers mois
      if (date < fourMonthsAgo || date > today) continue;

      // Format du mois : YYYY-MM
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const company = EMPLOYERS.get(decl.employer_id).company_name;

      // Initialisation de la structure si nécessaire
      grouped[month] = grouped[month] || {};
      // Accumulation des contributions par entreprise
      grouped[month][company] =
        (grouped[month][company] || 0) + decl.total_contribution;
    }

    // Transformation en tableau avec le top employeur par mois
    return (
      Object.entries(grouped)
        .map(([month, companies]) => {
          // Recherche de l'entreprise avec la contribution maximale
          const [topCompany, maxContribution] = Object.entries(
            companies,
          ).reduce((max, curr) => (curr[1] > max[1] ? curr : max));

          return { month, company: topCompany, contribution: maxContribution };
        })
        // Tri chronologique par mois
        .sort((a, b) => a.month.localeCompare(b.month))
    );
  }

  // Récupération des données pour le graphique
  const chartData = getTopCompanyLast4Months();

  // Extraction des labels (mois) pour l'axe X
  const labels = chartData.map((item) => item.month);
  // Extraction des contributions pour l'axe Y
  const contributions = chartData.map((item) => item.contribution);

  // Récupération du contexte du canvas

  const ctx = document.getElementById("myChart").getContext("2d");

  if (myChart) {
    myChart.destroy();
  }
  // Création du graphique en barres avec Chart.js
  myChart = new Chart(ctx, {
    type: "bar", // Type de graphique
    data: {
      labels: labels, // Labels de l'axe X (mois)
      datasets: [
        {
          label: "Top Company Contribution", // Légende
          data: contributions, // Données (contributions)
          backgroundColor: "#6366f1", // Couleur des barres (indigo)
          borderWidth: 2, // Épaisseur de la bordure
        },
      ],
    },
    options: {
      events: ["click"], // Événements actifs
      scales: {
        y: {
          beginAtZero: true, // L'axe Y commence à 0
          max: Math.max(...contributions) * 1.2, // Maximum = 120% de la valeur max
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            // Callback personnalisé pour afficher le nom de l'entreprise
            afterLabel: function (context) {
              const index = context.dataIndex;
              return `Company: ${chartData[index].company}`;
            },
          },
        },
      },
    },
  });
}

/**
 * Export du composant Dashboard
 * Structure : { template, styles, script }
 */
const Dashboard = { template, styles, script };

export default Dashboard;
