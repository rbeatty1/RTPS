import { LoadMain } from "./loadMain";

let routes = {
    category: ['gap', 'reliability', 'frequency', 'accessibility'],
    pages: ['tool', 'documentation']
}

const UpdateView = ()=>{
    /*
        GetURL()
        @purpose: Gets the URL from browser and parses it appropriately
        @return: object that will be parsed by switch/case to display appropriate content
    */
    const GetURL = () =>{
            let regex = /^\#(?<category>\w*)\/(?<page>\w*)/, // correct hash pattern...
                hash = window.location.hash, // hash...
                match = hash.match(regex) ? regex.exec(hash) : /^#(?<page>\w*)/.exec(hash) // exception for `#home` URL
        
        // if there was any match, continue
        if (match){
            // tool/documentation pages
            if (match.groups.category){
                if (routes.category.indexOf(match.groups.category) != -1 && routes.category != 'home'){
                    if (routes.pages.indexOf(match.groups.page) != -1){
                        return match.groups
                    }
                }
            }
            // home or error
            else{
                let page = match.groups.page == 'home' ? {page: 'home'} : {page: 'error'}
                return page
            }            
        }
        // else there is an error
        else{
            return {page: 'error'}
        }
    }

    // is it the home page?
    let hash = window.location.href.slice(0, -1) == window.location.origin ? {page: 'home'} : GetURL()

    // LoadMain function already takes care of the tool/documentation check, so this could be restructured
    switch(hash.page){
        case 'home':
            LoadMain()
            break;
        case 'tool':
            LoadMain(hash.category, hash.page)
            break;
        case 'documentation':
            LoadMain(hash.category, hash.page)
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