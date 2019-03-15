import '../../../css/header/navControls/navControls.css'
import { LoadMain } from '../../../utils/loadMain.js'



/*
    _createNavLink(self, item)
    @purpose: Create page navigation links in header
    @param:
        item: entry from HeaderElements object that defines the link
    @return:
        link: link with appropriate attributes for nav link section. Includes listener event to load correct page on click
            @TODO: Should probably implement formal routing procedure for navigation between pages, not just executing a function that builds the appropriate page

*/
const _createNavLink = item =>{
    // create link
    let link = document.createElement('a')
    
    // set attributes
    link.href = '#'
    link.rel = 'noopener'
    link.setAttribute('data-name', item.title)
    link.setAttribute('data-tool', item.shorthand)
    link.style.background = item.color

    // Load appropriate page on click && change link styling
    link.addEventListener('click', e=>{
        let siblings = e.target.parentNode.childNodes,
            descriptor = document.getElementById('page-title')
            descriptor.innerText = e.target.getAttribute('data-name')
        siblings.forEach(element => {
            if (element != e.target){
                element.classList = 'header__nav-link inactive'
                element.style.boxShadow = ''
            } 
            else{
                element.classList = 'header__nav-link active';
                element.style.boxShadow = `0 0 15px ${item.color}`
            }
        });
        LoadMain(e.target.getAttribute('data-tool'))
    })
    return link;
}

class NavControl{
    get list(){
        return this._list;
    }

    // when you set the list property of nav control, execute render function
    set list(list){
        this._list = list;
        this.render()
    }

    render(){
        // housekeeping
        let header = document.querySelector(".header__container"),
            navContainer = document.createElement('div'),
            listElement = document.createElement('nav'),
            navDescriptor = document.createElement('p')



        navContainer.id = 'header__nav-container'
        listElement.className = 'header__nav-links'

        // clear any existing HTML from nav link section
        listElement.innerHTML = '';

        // create link for every item in list object (defined by HeaderElements content ref)
        for (let k in this.list){
            let a = _createNavLink(this.list[k]);
            listElement.appendChild(a);
        }
        
        navDescriptor.id = 'page-title'

        // send 'em
        navContainer.appendChild(listElement)
        navContainer.appendChild(navDescriptor)
        header.appendChild(navContainer)

        // set height = to width for nav links
        let links = listElement.querySelectorAll('a')
        for (let a of links) a.style.height = `${a.clientWidth}px`
    }
}

export {NavControl};