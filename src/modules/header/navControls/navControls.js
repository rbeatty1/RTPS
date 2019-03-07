import '../../../css/header/navControls/navControls.css'
import {LoadMain, ChangeLogo} from '../../../utils/loadMain.js'


function _createNavLink(self, item){
    let link = document.createElement('a')
    link.href = '#'
    link.rel = 'noopener'
    link.setAttribute('data-name', item.title)
    link.setAttribute('data-tool', item.shorthand)
    link.style.background = item.color
    // change link styling when navigating to
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

    set list(list){
        this._list = list;
        this.render()
    }

    render(){
        let header = document.querySelector(".header__container");
        let navContainer = document.createElement('div'),
            listElement = document.createElement('nav'),
            navDescriptor = document.createElement('p')

        navContainer.id = 'header__nav-container'
        listElement.className = 'header__nav-links'
        listElement.innerHTML = '';
        for (let k in this.list){
            let a = _createNavLink(listElement, this.list[k]);
            listElement.appendChild(a);
        }
        
        navDescriptor.id = 'page-title'

        navContainer.appendChild(listElement)
        navContainer.appendChild(navDescriptor)
        header.appendChild(navContainer)

        let links = listElement.querySelectorAll('a')
        for (let a of links) a.style.height = `${a.clientWidth}px`
    }
}

export {NavControl};