import { html, select, sleep } from "../utils/index";
import Dashboard from "../pages/Dashboard";
import Declaration from "../pages/declaration";
import Employeurs from "../pages/Employeurs";
import Assures from "../pages/assures";
import Historique from "../pages/Historique";
const routes = {
  "/": Dashboard,
  "/declaration": Declaration,
  "/employeurs": Employeurs,
  "/assures": Assures,
  "/historique":Historique
};

// create root element and style element for page styles
const root = select("#app");
const page_style = document.createElement("style");
document.head.appendChild(page_style);
export async function navigate(path) {
  root.classList.add("exit");
  await sleep(300);
  window.history.pushState(null, null, path);
  render(path);
  root.classList.remove("exit");
  root.classList.add("enter");
  await sleep(300); 
  root.classList.remove("enter");
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
  toggle_active_link(window.location.pathname);
});
document.addEventListener("click", (e) => {
  const link = e.target.closest && e.target.closest("[data-link]");
  if (!link) return;
  e.preventDefault();
  const path = link.getAttribute("href");
  if (path) navigate(path);
  toggle_active_link(path);
});

function toggle_active_link(path) {
  const links = document.querySelectorAll("[data-link]");
  links.forEach((link) => {
    if (link.getAttribute("href") === path) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

render(window.location.pathname);
toggle_active_link(window.location.pathname)
