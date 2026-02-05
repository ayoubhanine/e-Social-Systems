import { html, select } from "../utils/index";
import Dashboard from "../pages/Dashboard";
import Declaration from "../pages/déclaration";
import Employeurs from "../pages/Employeurs";
import Assures from "../pages/assures";
import historique from "../pages/Historique";
const routes = {
  "/": Dashboard,
  "/declaration": Declaration,
  "/employeurs": Employeurs,
  "/assures": Assures,
  "/historique":historique
};

// create root element and style element for page styles
const root = select("#app");
const page_style = document.createElement("style");
document.head.appendChild(page_style);

function navigate(path) {
  history.pushState({}, "", path);
  render(path);
}

function render(path) {
  const page = routes[path];
  if (!page) {
    root.innerHTML = html`<h1>404 - Not Found</h1>`;
    page_style.textContent = "";
    return;
  }
  root.innerHTML = page.template();
  page_style.textContent = page.styles();

  // cleanup previous page script if exists
  if (page.cleanup) page.cleanup();
  if (page.script) page.script();
}
window.addEventListener("popstate", () => {
  render(window.location.pathname);
});
document.addEventListener("click", (e) => {
  const link = e.target.closest && e.target.closest("[data-link]");
  if (!link) return;
  e.preventDefault();
  const path = link.getAttribute("href");
  if (path) navigate(path);
  else alert("no path");
});
render(window.location.pathname);
