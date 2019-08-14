import logo from "../../img/DVRPC-logo.png"
import { version } from "../../../package.json"

const createFooter = () => {

    // fragment for logo + DVRPC address info
    const addressFragment = document.createDocumentFragment()
    const addressContactWrapper = document.createElement('div')
    const footerLogoLink = document.createElement('a')
    const footerLogo = document.createElement('img')
    const address = document.createElement('address')
    const dvrpcContact = document.createElement('span')
    const titleXI = document.createElement('a')

    addressContactWrapper.classList.add('footer-content-wrapper')
    footerLogoLink.id = 'footer-logo-link'
    footerLogo.id = 'footer-logo'
    dvrpcContact.id = 'footer-phone'
    titleXI.id = 'footer-titleXI'

    footerLogoLink.href="https://www.dvrpc.org/"
    titleXI.href="/GetInvolved/TitleVI/"
    footerLogoLink.target = "blank"
    footerLogo.src = logo
    footerLogo.alt = 'dvrpc logo'

    address.textContent = '190 N Independence Mall W, 8th Floor Philadelphia, PA 19106'
    dvrpcContact.textContent = '  |  215.592.1800'
    titleXI.textContent = 'Title XI and Environmental Justice'

    address.appendChild(dvrpcContact)

    footerLogoLink.appendChild(footerLogo)

    addressContactWrapper.appendChild(address)
    
    addressFragment.appendChild(footerLogoLink)
    addressFragment.appendChild(addressContactWrapper)

    // fragment for Sarah's contact info
    const contactFragment = document.createDocumentFragment()
    const contactWrapper = document.createElement('div')
    const contactInfo = document.createElement('p')

    contactWrapper.classList.add('footer-content-wrapper')
    contactInfo.innerHTML = 'Sarah Moran Senior Transportation Planner<br />215.238.2875  |  <a href="mailto:smoran@dvrpc.org">smoran@dvrpc.org</a>'

    contactWrapper.appendChild(contactInfo)
    contactFragment.appendChild(contactWrapper)

    // fragment for name and version
    const versionFragment = document.createDocumentFragment()
    const versionText = document.createElement('p')

    versionText.id = 'footer-version'

    versionText.textContent = `Regional Transit Screening Platform  |  Version ${version}`
    versionFragment.appendChild(versionText)

    // main fragment to export and append to <footer>
    const mainFragment = document.createDocumentFragment()

    mainFragment.appendChild(addressFragment)
    mainFragment.appendChild(contactFragment)
    mainFragment.appendChild(titleXI)
    mainFragment.appendChild(versionFragment)

    return mainFragment
}

export default createFooter