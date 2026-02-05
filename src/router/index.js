import {select} from "../utils/index"
import base from "../pages/base"
import Dashboard from "../pages/Dashboard"
const routes = {
  "/": Dashboard
}

const root = select("#app") 

function navigate(path="/"){
    history.pushState({} , "" , path)
    render(path)
}

function render(path="/"){
    const page = routes[path] 
    console.log(page.template());
    
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


render(window.location.pathname);
