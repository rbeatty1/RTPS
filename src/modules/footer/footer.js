import "../../css/footer/footer.css";
import { FooterElements } from "./FooterElements";

const dvrpcElements = FooterElements[0].content;
const appElements = FooterElements[1].content;
const contactElements = FooterElements[2].content

class Footer{
    constructor(){
        this.render()
    }

    render(){
        let feet = document.createElement('div')
        feet.className = 'footer__container'
        for (var k in FooterElements){
            let foot = document.createElement('div')
            foot.className = `footer__${FooterElements[k].elemName}`;
            switch (FooterElements[k].elemName){
                case 'dvrpc':
                    foot.innerHTML = `<a href="https://www.dvrpc.org" rel="noopener" target="_blank"><img src=${dvrpcElements.logo} alt='DVRPC Logo' class="footer__logo"></a>
                                       <div class="footer__dvrpc-info">${dvrpcElements.address}</br>${dvrpcElements.city}, ${dvrpcElements.state} ${dvrpcElements.zipcode}</div>
                                       <div class="footer__dvrpc-info"><strong>Phone:</strong> ${dvrpcElements.phone}</br><strong>Email: </strong><a href="mailto:${dvrpcElements.email}" target="_blank" rel="noopener">${dvrpcElements.email}</a>`
                    break;
                case 'app':
                    foot.innerHTML = `<p>${appElements.name}&nbsp;&nbsp;&nbsp;&nbsp;<strong style='font-size: 1.25em;'>|</strong>&nbsp;&nbsp;&nbsp;&nbsp;Version: ${appElements.version}`
                    break;
                case 'contact':
                    foot.innerHTML = `<div class="footer__dvrpc-info">${contactElements.staff}</br>${contactElements.title}</div>
                                      <div class="footer__dvrpc-info"><strong>Phone: </strong>${contactElements.phone}</br><strong>Email: </strong><a href="mailto:${contactElements.email}" target="_blank" rel="noopener" style="color:#8bb23f">${contactElements.email}</a>`
                    break;
                default:
                    break;
            }
            feet.appendChild(foot)
        }
        document.getElementById('app').appendChild(feet)
    }
}

export {Footer};