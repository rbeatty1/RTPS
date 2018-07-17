import "../../css/footer/footer.css";
import { FooterElements } from "./FooterElements";

const dvrpcElements = FooterElements[0].content;
const appElements = FooterElements[1].content;

class Footer{
    constructor(){
        this.render()
    }

    render(){
        let feet = document.createElement('div')
        feet.className = 'footer__container'
        feet.innerHTML = `<div class="footer__dvrpc">
                                <img src=${dvrpcElements.logo} alt='DVRPC Logo' class="footer__logo">
                                <div class="footer__dvrpc-info">${dvrpcElements.address}</br>${dvrpcElements.city}, ${dvrpcElements.state} ${dvrpcElements.zipcode}</div>
                            </div>`
        document.getElementById('app').appendChild(feet)
    }
}

// function footerRender(elements){
//     const appBody = document.querySelector('#app')
//     let footer = document.createElement('div')
//     footer.className = 'footer__container';
//     let agencyContainer = document.createElement('div')
//     agencyContainer.className = 'footer__dvrpc';
//     // logo + office info
//     let agencyInfo = elements[0].content
//     let logoContainer = document.createElement('img')
//     logoContainer.className = 'footer__logo';
//     logoContainer.setAttribute('src', agencyInfo.logo);
//     let dvrpcInfo = document.createElement('div')
//     dvrpcInfo.className = 'footer__dvrpc-info';
//     dvrpcInfo.innerHTML = agencyInfo.address+'</br>'+agencyInfo.city+', '+agencyInfo.state+' '+agencyInfo.zipcode;
//     let appInfo = document.createElement('div');
//     appInfo.className = 'footer__app-info';
//     appInfo.innerHTML = elements[1].content.name+'   |   Version: '+elements[1].content.version;

//     footer.appendChild(logoContainer);
//     footer.appendChild(dvrpcInfo);
//     footer.appendChild(appInfo)
//     appBody.appendChild(footer)




// }

export {Footer};