import logo from "../../img/DVRPC-logo.png"
import { version } from "../../../package.json"

const createFooter = () => {

    // fragment for logo + DVRPC address info
    const addressFragment = document.createDocumentFragment()
    const addressContactWrapper = document.createElement('div')
    const footerLogo = document.createElement('img')
    const address = document.createElement('address')
    const dvrpcContact = document.createElement('p')

    addressContactWrapper.classList.add('footer-content-wrapper')
    footerLogo.id = 'footer-logo'

    footerLogo.src = logo
    footerLogo.alt = 'dvrpc logo'

    address.textContent = '190 N. Independence Mall W, 8th Floor \r\n'
    address.textContent += 'Philadelphia, PA 19147'
    dvrpcContact.innerHTML = '<strong>Phone</strong>: 215.592.1800 <br /> <strong>Email</strong>: <a href="mailto:public_affairs@dvrpc.org">public_affairs@dvrpc.org</a>'

    addressContactWrapper.appendChild(address)
    addressContactWrapper.appendChild(dvrpcContact)
    
    addressFragment.appendChild(footerLogo)
    addressFragment.appendChild(addressContactWrapper)

    // fragment for Sarah's contact info
    const contactFragment = document.createDocumentFragment()
    const contactWrapper = document.createElement('div')
    const contactName = document.createElement('p')
    const contactInfo = document.createElement('p')

    contactWrapper.classList.add('footer-content-wrapper')
    contactName.id = 'footer-contact-name'

    contactName.textContent = 'Sarah Moran\r\nTransportation Planner'
    contactInfo.innerHTML = '<strong>Phone</strong>: 215.238.2875 <br /> <strong>Email</strong>: <a href="mailto:smoran@dvrpc.org">smoran@dvrpc.org</a>'

    contactWrapper.appendChild(contactName)
    contactWrapper.appendChild(contactInfo)
    contactFragment.appendChild(contactWrapper)

    // fragment for name and version
    const versionFragment = document.createDocumentFragment()
    const versionText = document.createElement('p')

    versionText.id = 'footer-version'

    versionText.textContent = `Regional Transit Priority Setting  |  Version ${version}`
    versionFragment.appendChild(versionText)

    // main fragment to export and append to <footer>
    const mainFragment = document.createDocumentFragment()

    mainFragment.appendChild(addressFragment)
    mainFragment.appendChild(contactFragment)
    mainFragment.appendChild(versionFragment)

    return mainFragment
}

export default createFooter