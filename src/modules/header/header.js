import '../../css/header/header.css'
import {NavControl} from './navControls/navControls';
import {ChangeLogo} from '../../utils/loadMain'

function headerRender(elements){
    const appBody = document.querySelector('#app');
    const header = document.createElement('header')
    header.className = 'header__container';
    appBody.appendChild(header);

    // logo
    let logoContainer = document.createElement('object')
    logoContainer.className = 'header__project-logo';
    logoContainer.data = '../../img/rtpp-project.svg'
    logoContainer.alt = 'Regional Transit Priority Setting Logo'
    header.appendChild(logoContainer);
    
    // nav controls
    let navContainer = new NavControl();
    navContainer.list = elements[2].content;
}

export {headerRender};