import { DECLARATIONS, EMPLOYERS } from "../data";
import {
  get_average_employee_salary,
  get_highest_contributing_employer,
  get_total_contributions,
} from "../lib/functions";
import { css, html } from "../utils/index";

function template() {
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
  function getTopCompanyLast4Months() {
    const today = new Date();
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(today.getMonth() - 4);

    const grouped = {};

    for (const decl of DECLARATIONS.values()) {
      const date = new Date(decl.date);

      if (date < fourMonthsAgo || date > today) continue;

      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const company = EMPLOYERS.get(decl.employer_id).company_name;

      grouped[month] = grouped[month] || {};
      grouped[month][company] =
        (grouped[month][company] || 0) + decl.total_contribution;
    }

    return Object.entries(grouped)
      .map(([month, companies]) => {
        const [topCompany, maxContribution] = Object.entries(companies).reduce(
          (max, curr) => (curr[1] > max[1] ? curr : max),
        );

        return { month, company: topCompany, contribution: maxContribution };
      })
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  const chartData = getTopCompanyLast4Months();

  const labels = chartData.map((item) => item.month);
  const contributions = chartData.map((item) => item.contribution);

  const ctx = document.getElementById("myChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Top Company Contribution",
          data: contributions,
          backgroundColor: "#6366f1",
          borderWidth: 2,
        },
      ],
    },
    options: {
      events: ["click"],
      scales: {
        y: {
          beginAtZero: true,
          max: Math.max(...contributions) * 1.2,
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
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

const Dashboard = { template, styles, script };

export default Dashboard;
