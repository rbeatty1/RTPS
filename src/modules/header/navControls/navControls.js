import '../../../css/header/navControls/navControls.css'
import {LoadMain} from '../../../utils/loadMain.js'


function _createNavLink(self, item){
    let navElement = document.createElement('a');
    navElement.innerHTML = item;
    navElement.setAttribute('href', '#');
    // On load, land on gap analysis page
    item != 'Home' ? navElement.classList = 'header__nav-link inactive' : navElement.classList = 'header__nav-link active';
    // change link styling when navigating to
    navElement.addEventListener('click', e=>{
        let siblings = e.target.parentNode.childNodes;
        siblings.forEach(element => {
            element != e.target ? element.classList = 'header__nav-link inactive' : element.classList = 'header__nav-link active';
        });
        LoadMain(e.target.text)
    })
    return navElement;
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
        let listElement = document.createElement('div')
        listElement.className = 'header__nav-links'
        listElement.innerHTML = '';
        for (let k in this.list){
            let a = _createNavLink(listElement, this.list[k].name);
            listElement.appendChild(a);
        }
        header.appendChild(listElement)
    }
}

export {NavControl};