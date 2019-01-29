import '../../css/header/header.css'
import {NavControl} from './navControls/navControls';
import logo from "../../img/RTPS-logo.png"

function headerRender(elements){
    const appBody = document.querySelector('#app');
    const header = document.createElement('header')
    header.className = 'header__container';
    appBody.appendChild(header);

    // logo
    let logoContainer = document.createElement('img')
    logoContainer.className = 'header__project-logo';
    logoContainer.setAttribute('src', logo);
    header.appendChild(logoContainer);
    
    // nav controls
    let navContainer = new NavControl();
    navContainer.list = elements[2].content;
}

export {headerRender};