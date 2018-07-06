import '../../css/header/header.css'

function headerRender(elements){
    const appBody = document.querySelector('#app');
    const header = document.createElement('div')
    header.className = 'header__container';
    appBody.appendChild(header);
    // console.log({appBody})
    // elements.forEach(i=>{
    //     console.log({option : i})

    // logo
    let projectLogo = elements[0].content.path;
    let logoContainer = document.createElement('img')
    logoContainer.className = 'header__project-logo';
    logoContainer.setAttribute('src', projectLogo);
    header.appendChild(logoContainer);

    // query inputs
        let queryContainer = document.createElement('div');
        queryContainer.list = elements[1].content;
        let queryList = [];
        for (var k in queryContainer.list){
            queryList.push(queryContainer.list[k]);
        }
        console.log(queryContainer.list)

    // nav controls
        // let navContainer = self.shadowRoot.querySelector('control-nav');
        // navContainer.list = HeaderElements[2].content;
}

export {headerRender};