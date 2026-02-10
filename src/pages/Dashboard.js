import {
  get_all_declarations,
  get_all_employees,
  get_all_employers,
  get_average_employee_salary,
  get_employer_contribution,
  get_highest_contributing_employer,
  get_total_contributions,
} from "../lib/functions";
import example_data from "../utils/data";
import { css, html } from "../utils/index";

function template() {
  // const employees = get_all_employees();
  // const employers = get_all_employers();
  // const declarations = get_all_declarations();

  const formated_total_contribution = new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
  }).format(get_total_contributions());

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
        <div class="card">
          <div>
            <p class="title">Total Cotisations</p>
            <p class="price">${formated_total_contribution}</p>
            <p>Montant total collecté</p>
          </div>
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
        <div class="card">
          <div>
            <p class="title">Salaire Moyen</p>
            <p class="price">${formated_avg}</p>
            <p>MSur l'ensemble des assurés</p>
          </div>
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
        <div class="card">
          <div>
            <p class="title">Top Employeur</p>
            <p class="price">
              ${get_highest_contributing_employer()?.company_name}
            </p>
            <p>Plus grand volume déclaré</p>
          </div>
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
      <canvas id="myChart"></canvas>
      <!-- <canvas id="Pies"></canvas> -->
    </section>
  `;
}

function styles() {
  return css`
    .dashboard {
      background: var(--background);
      padding: 1rem;
    }
    .dashboard .cards {
      margin-top: 3rem;
      width: 100%;
      display: grid;
      grid-template-columns: auto auto auto;
      gap: 1rem;
    }
    .dashboard .heading {
      width: 100%;
    }
    .dashboard .cards .card {
      background-color: var(--card);
      padding: 2rem;
      border-radius: 10px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    .dashboard .cards .card p:first-child,
    .dashboard .cards .card p:last-child {
      color: var(--muted-foreground);
      font-weight: 500;
    }
    .dashboard .cards .card p:nth-child(2) {
      font-weight: bold;
      font-size: 1.5rem;
      margin: 0.2rem;
    }
    #myChart {
      margin-top: 2rem;
    }
  `;
}

function script() {
  const getCurrentMonth = new Date().getMonth() + 1;
  const getCurrentYear = new Date().getFullYear();

  console.log(getCurrentMonth);
  console.log(getCurrentYear);

  const ctx = document.getElementById("myChart");
  const pies = document.getElementById("Pies");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        `${getCurrentYear}-${getCurrentMonth}`,
        `${getCurrentYear}-${getCurrentMonth - 1}`,
      ],
      datasets: [
        {
          label: "My First Chart",
          data: [1200000, 1000, 10000, 7000],
          backgroundColor: "#6366f1",
          borderWidth: 2,
        },
      ],
    },
    options: {
      events: ["click"],
      scales: {
        y: {
          // defining min and max so hiding the dataset does not change scale range
          min: 10000,
          // max: get_total_contributions(),
          max: get_total_contributions(),
        },
      },
    },
  });
  new Chart(pies, {
    type: "doughnut",
    data: {
      labels: ["Red", "Blue", "Yellow"],
      datasets: [
        {
          label: "My First Dataset",
          data: [300, 50, 100],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    },
  });
}

const Dashboard = { template, styles, script };

export default Dashboard;
