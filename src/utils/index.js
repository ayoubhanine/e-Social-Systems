/** * 
 @param {string} selector - the css selector of the element to select
 *   
*/
export const select = (selector)=>{
    const el = document.querySelector(selector)
    if(!el) throw new Error(`couldn't find element with selector ${selector}`)
    return el 
}

// just to get syntax highlighting in other files
export function html(strings , ...values){
    return strings.reduce((acc , str , i)=>{
        return acc + str + (values[i] || "")
    } , "")   
}
export function css(strings , ...values){
    return strings.reduce((acc , str , i)=>{
        return acc + str + (values[i] || "")
    } , "")
}