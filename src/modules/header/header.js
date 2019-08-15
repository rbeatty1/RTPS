import '../../css/header/header.css'
import {NavControl} from './navControls/navControls';
import { SetNewURL } from '../../utils/routing';
import { HeaderElements } from './HeaderElements';

function headerRender(elements){
    const appBody = document.querySelector('#app');
    const header = document.createElement('header')
    const logoContainer = document.createElement('div')
    const headerLogoLink = document.createElement('a')
    const headerLogo = document.createElement('img')
    // separator
    const headerPipe = document.createElement('span')
    
    
    header.className = 'header__container';
    logoContainer.className = 'header__project-logo';
    
    headerLogo.id = 'header__dvrpc-logo'
    headerPipe.id = 'header__pipe'

    headerLogo.src = "../../img/header-logo.png"
    headerLogo.alt = "DVRPC logo"
    logoContainer.alt = 'Regional Transit Screening Platform Logo'

    headerLogoLink.href = 'https://www.dvrpc.org/'
    
    appBody.appendChild(header);
    headerLogoLink.appendChild(headerLogo)
    logoContainer.appendChild(headerLogoLink)
    logoContainer.appendChild(headerPipe)
    logoContainer.insertAdjacentHTML('beforeend', require('../../img/rtsp-project.svg'))

    logoContainer.lastChild.onclick = e => {
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