import {css, html} from "../utils/index"
function template(){
    return html`
    <section class="your section">
        <div>
            <h1>base</h1>
        </div>
        <button>Click me</button>
    </section>
    `
}

function styles(){
    return css`
    
    
    `
}

function script(){
    document.querySelector("button")?.addEventListener("click" , ()=>{
        alert("Button clicked!")
    })
}

const base = {template,
    styles,
    script
}

export default base