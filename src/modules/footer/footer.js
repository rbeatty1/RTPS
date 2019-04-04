import "../../css/footer/footer.css";
import { FooterElements } from "./FooterElements"; // content reference object 
import logo from "../../img/DVRPC-logo.png"
import { version } from "../../../package.json"

const dvrpcElements = FooterElements[0].content;
const appElements = FooterElements[1].content;
const contactElements = FooterElements[2].content

class Footer{
    constructor(){
        this.render()
    }

    render() {
        const footer = document.createElement('footer')

        // wrapper for logo + DVRPC address info
        const addressFragment = document.createDocumentFragment()
        const addressWrapper = document.createElement('div')
        const footerLogo = document.createElement('img')
        const address = document.createElement('address')
        const dvrpcContact = document.createElement('p')

        addressWrapper.classList.add('footer-address-wrapper')
        footerLogo.src = logo
        address.textContent = '190 N. Independence Mall W, 8th Floor \r\n'
        address.textContent += 'Philadelphia, PA 19147'

        addressFragment.appendChild(footerLogo)
        addressFragment.appendChild(address)

        // wrapper for Sarah's contact info
        const contactFragment = document.createDocumentFragment()


        // wrapper for name and version
        const versionFragment = document.createDocumentFragment()
        footer.innerHTML = `
        
        `
    }

}

export {Footer};

// render(){
//     let feet = document.createElement('footer')
//     feet.className = 'footer__container'
//     for (var k in FooterElements){
//         let foot = FooterElements[k].elemName != 'app' ? document.createElement('address') : document.createElement('div')
//         foot.className = `footer__${FooterElements[k].elemName}`;
//         switch (FooterElements[k].elemName){
//             case 'dvrpc':
//                 foot.innerHTML = `<a href="https://www.dvrpc.org" rel="noopener" target="_blank"><img src=${logo} alt='DVRPC Logo' class="footer__logo"></a>
//                                    <div class="footer__dvrpc-info">${dvrpcElements.address}</br>${dvrpcElements.city}, ${dvrpcElements.state} ${dvrpcElements.zipcode}</div>
//                                    <div class="footer__dvrpc-info"><strong>Phone:</strong> ${dvrpcElements.phone}</br><strong>Email: </strong><a class="footer__link" href="mailto:${dvrpcElements.email}" target="_blank" rel="noopener">${dvrpcElements.email}</a>`
//                 break;
//             case 'app':
//                 foot.innerHTML = `<p>${appElements.name}&nbsp;&nbsp;&nbsp;&nbsp;<strong style='font-size: 1.25em;'>|</strong>&nbsp;&nbsp;&nbsp;&nbsp;Version ${version}`
//                 break;
//             case 'contact':
//                 foot.innerHTML = `<div class="footer__dvrpc-info">${contactElements.staff}</br><em>${contactElements.title}</em></div>
//                                   <div class="footer__dvrpc-info"><strong>Phone: </strong>${contactElements.phone}</br><strong>Email: </strong><a class="footer__link"  href="mailto:${contactElements.email}" target="_blank" rel="noopener">${contactElements.email}</a>`
//                 break;
//             default:
//                 break;
//         }
//         feet.appendChild(foot)
//     }
//     document.getElementById('app').appendChild(feet)
// }