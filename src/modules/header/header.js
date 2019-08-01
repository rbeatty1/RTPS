import '../../css/header/header.css'
import {NavControl} from './navControls/navControls';
import { SetNewURL } from '../../utils/routing';
import { HeaderElements } from './HeaderElements';

function headerRender(elements){
    const appBody = document.querySelector('#app');
    const header = document.createElement('header')
    header.className = 'header__container';
    appBody.appendChild(header);

    // logo
    let logoContainer = document.createElement('div')
    
    logoContainer.className = 'header__project-logo';
    logoContainer.insertAdjacentHTML('afterbegin', require('../../img/rtsp-project.svg'))
    logoContainer.alt = 'Regional Transit Screening Platform Logo'

    logoContainer.firstChild.onclick = e => {
        history.pushState({page: 'home', type: 'home'}, document.title, window.location.origin + window.location.pathname)
        SetNewURL()
    }
    header.appendChild(logoContainer);
    
    // nav controls
    let navContainer = new NavControl();
    navContainer.list = elements[2].content;
}

export class Header{
    constructor(){
        this.render()
    }
    render(){
        headerRender(HeaderElements)
    }
};