import {html, select} from "../utils/index"
const routes = {
  "/": html`<h1>nothing added yet</h1>`
}

const root = select("#app") 

function navigate(path="/"){
  history.pushState({} , "" , path)
  render(path)
}

function render(path="/"){
    const page = routes[path]
    if(!page || typeof page !== "object"){
        root.innerHTML = html`<h1>404 - Not Found</h1>`
        return
    }
    root.innerHTML = page.template()
    const style = document.createElement("style")
    style.textContent = page.styles()
    document.head.appendChild(style)
    page.script()
}

window.addEventListener('popstate', () => {
  render(window.location.pathname);
});


document.addEventListener('click', e => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    let path = e.target.getAttribute("href");
    if (path)
    navigate(path);
  }
});


render("/");
