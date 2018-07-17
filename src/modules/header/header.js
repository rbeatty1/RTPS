import '../../css/header/header.css'
import {createInput, QueryContainer} from './queryInput/queryInput'
import {NavControl} from './navControls/navControls';

function headerRender(elements){
    const appBody = document.querySelector('#app');
    const header = document.createElement('div')
    header.className = 'header__container';
    appBody.appendChild(header);

    // logo
    let projectLogo = elements[0].content.path;
    let logoContainer = document.createElement('img')
    logoContainer.className = 'header__project-logo';
    logoContainer.setAttribute('src', projectLogo);
    header.appendChild(logoContainer);

    // query inputs
        let queryContainer = new QueryContainer();
        queryContainer.list = elements[1].content;
        let queryList = [];
        for (var k in queryContainer.list){
            queryList.push(queryContainer.list[k]);
        }
    
    
        // nav controls
        let navContainer = new NavControl();
        navContainer.list = elements[2].content;
}

export {headerRender};