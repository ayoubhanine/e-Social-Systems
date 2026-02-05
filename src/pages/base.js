import {CSS,HTML} from "../utils/index"
function template(){
    return HTML`
    <section class="your section">
        <div>
            <h1>base</h1>
        </div>
    </section>
    `
}

function css(){
    return CSS`
    
    `
}

function script(){
    
}

const base = {template,
    css,
    script
}

export default base