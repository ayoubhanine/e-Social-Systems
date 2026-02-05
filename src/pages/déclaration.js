import {css, html} from "../utils/index"
function template(){
    return html`
    <section class="declaration">
        <h1>declaration</h1>
    </section>
    `
}

function styles(){
    return css`
        .layout {
    display: flex;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    }

    /* Sidebar */
    .sidebar {
    width: 240px;
    background: #0f172a;
    color: white;
    padding: 20px;
    }

    .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 40px;
    }

    .menu a {
    display: block;
    padding: 12px 15px;
    margin-bottom: 10px;
    color: #cbd5f5;
    text-decoration: none;
    border-radius: 8px;
    }

    .menu a:hover {
    background: #1e293b;
    }

    .menu a.active {
    background: #6366f1;
    color: white;
    }

    /* Content */
    .content {
    flex: 1;
    padding: 30px;
    background: #f8fafc;
    }
    `
}

function script(){
    
}

const declaration = {
    template,
    styles,
    script
}

export default declaration