import { LoadMain } from "./loadMain";

let routes = {
    category: ['gap', 'reliability', 'frequency', 'accessibility'],
    pages: ['tool', 'documentation']
}

// sanitize hash fragments by whitelisting alphanumeric characters and '/'
const sanitizeHash = hash => hash.replace(/[^\w\/]/gi, '')

/*
    GetURL()
    @purpose: Gets the URL from browser and parses it appropriately
    @return: object that will be parsed by switch/case to display appropriate content
*/
const GetURL = () =>{
    let hash = window.location.hash
    
    // if hash exists, parse it and determine if/which page should be generated
    if (hash){
        hash = sanitizeHash(hash)
        const hashArray = hash.split('/')
        let [ category, page ] = [...hashArray]

        const catIndex = routes.category.indexOf(category)
        const pageIndex = routes.pages.indexOf(page)

        // check for a valid page/category combo, error if it fails
        if (catIndex > -1 && pageIndex > -1){
            return { category, page }
        } else {
            return {page: 'error'}
        }

    // without hash, send the user home if the request is for '/', otherwise error 
    }else {
        return window.location.pathname === '/' || '/webmaps/rtps/' ? {page: 'home'} : {page: 'error'}
    }
}

const UpdateView = ()=>{

    // parse the URL to get the requested path
    let path = GetURL()

    // LoadMain function already takes care of the tool/documentation check, so this could be restructured
    switch(path.page){
        case 'home':
            LoadMain()
            break;
        case 'tool':
            LoadMain(path.category, path.page)
            break;
        case 'documentation':
            LoadMain(path.category, path.page)
            break;
        default:
            console.log('404')
    }
}

/*
    SetNewURL(category, type)
    @purpose: Update URL so it can be parsed whenever a navigation element is clicked
    @params:
        - category: analysis category
        - type: page type (tool or documentation)
*/

const SetNewURL = (category, type) =>{
    // if parameters exist, create new state history
    if (category){ history.pushState({tool: category, page: type}, `${type} page for ${category} analysis`, `#${category}/${type}`) }
    UpdateView()
}

// listeners
window.onhashchange = e => UpdateView() // browser navigation
window.onload = e => UpdateView()// refresh/page load

export {SetNewURL}