import {css , html} from "../utils/index"
function template(){
    return html`
    <section class="your section">
        <div>
            <h1>base</h1>
        </div>
    </section>
    `
}

function css(){
    return css`
    
    `
}

function script(){
    
}

const base = {template,
    css,
    script
}

export default base