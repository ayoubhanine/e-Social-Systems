import { css, html } from "../utils/index";
function template() {
  return html`
    <section class="dashboard">
      <div class="cards">
        <div class="card">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6366f1"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-activity-icon lucide-activity"
          >
            <path
              d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
            />
          </svg>
          <p class="title">Total Cotisations</p>
          <p class="price">28.397,91 DH</p>
          <p>Montant total collecté</p>
        </div>
        <div class="card">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
          <p class="title">Total Cotisations</p>
          <p class="price">28.397,91 DH</p>
          <p>Montant total collecté</p>
        </div>
        <div class="card">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
          <p class="title">Total Cotisations</p>
          <p class="price">28.397,91 DH</p>
          <p>Montant total collecté</p>
        </div>
      </div>
    </section>
  `;
}

function styles() {
  return css`
    .dashboard {
      padding: 1rem;
      background: var(--background);
    }
    .dashboard .cards {
      width: 100%;
      display: grid;
      grid-template-columns: auto auto auto;
      gap: 1rem;
    }
  `;
}

function script() {
  document.querySelector("button")?.addEventListener("click", () => {
    alert("Button clicked!");
  });
}

const Dashboard = { template, styles, script };

export default Dashboard;