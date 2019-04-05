import { LoadMain } from "./loadMain";

let routes = {
    category: ['gap', 'reliability', 'frequency', 'accessibility'],
    pages: ['tool']
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

        // short out if we don't meet the correct length
        const length = hashArray.length
        if(length > 2) return { page: 'error' }

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

// parse the URL to get the requested path
const UpdateView = ()=>{
    let path = GetURL()
    LoadMain(path.category, path.page)
}

/*
    SetNewURL(category, type)
    @purpose: Update URL so it can be parsed whenever a navigation element is clicked
    @params:
        - category: analysis category
        - type: page type
*/

const SetNewURL = (category, type) =>{
    // if parameters exist, create new state history
    if (category){ history.pushState({tool: category, page: type}, `${type} page for ${category} analysis`, `#${category}/${type}`) }
    UpdateView()
}

// listeners
window.onhashchange = () => UpdateView() // browser navigation
window.onload = () => UpdateView()// refresh/page load

export {SetNewURL}