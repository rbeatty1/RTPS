import '../../css/header/header.css'
import {NavControl} from './navControls/navControls';
import {LoadMain} from '../../utils/loadMain'

function headerRender(elements){
    const appBody = document.querySelector('#app');
    const header = document.createElement('header')
    header.className = 'header__container';
    appBody.appendChild(header);

    // logo
    let logoContainer = document.createElement('div')
    
    logoContainer.className = 'header__project-logo';
    logoContainer.insertAdjacentHTML('afterbegin', require('../../img/rtpp-project.svg'))
    logoContainer.alt = 'Regional Transit Priority Setting Logo'

    logoContainer.firstChild.onclick = e => {LoadMain('home')}
    header.appendChild(logoContainer);
    
    // nav controls
    let navContainer = new NavControl();
    navContainer.list = elements[2].content;
}

export {headerRender};