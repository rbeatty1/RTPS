import '../../css/footer/footer.css'

function footerRender(){
    const app = document.querySelector('#app')
    const footer = document.createElement('div')
    footer.className = 'footer__container'
    app.appendChild(footer);
}

export {footerRender};