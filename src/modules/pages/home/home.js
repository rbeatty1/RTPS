import "../../../css/pages/home/home.css"
import { LoadMain, ChangeLogo } from "../../../utils/loadMain";

const Landing = (props, appContainer) =>{
  const SectionChange = (target, section)=>{
    const ChangeText = () =>{
      let content = props[section],
        textContainer = document.getElementById('desc-container'),
        linksContainer = document.createElement('div')

      // clear description text
      while(textContainer.firstChild){ textContainer.removeChild(textContainer.firstChild) }

      linksContainer.classList.add('content-links')
      linksContainer.style.color = content.color

      // learn more (documentation) & explore (analysis page) links
      let docLink = document.createElement('a'),
        appLink = document.createElement('a')

      // documentation (blank for now)
      docLink.href = '#'
      docLink.rel = 'noopener'
      docLink.innerText = 'Learn More'

      // explore (analysis page)
      appLink.href = '#'
      appLink.rel = 'noopener'
      appLink.innerText = 'Explore'
      // load analysis page
      appLink.addEventListener('click', e=>{ LoadMain(section) })

      linksContainer.appendChild(docLink)
      linksContainer.appendChild(appLink)

      
      textContainer.appendChild(linksContainer)
      // add appropriate description text (see this.props[section].description)
      textContainer.insertAdjacentHTML('beforeend', content.description)
      // change background color
      textContainer.style.background = content.color
      textContainer.classList.add('active')
    }

    // give appropriate button the active class
    const ActivateButton = ()=>{
      let buttons = document.querySelectorAll('button')
      for (let button of buttons){
        button == target ? button.classList.add('active') : button.classList.remove('active')
      }


    }

    // change appropriate elements from logo svg to correct tool primary color (function in src/utils/LoadMain.js) 
    ChangeLogo(section)
    ChangeText()
    ActivateButton()

  }

  let i = 0
  // three HTML elements for landing page...
  while (i < 3){
    // the second element is the nav links and does different shtuff
    if (i != 1){
      let section = document.createElement('section')

      // build logo container & insert logo svg
      if(i == 0){
        section.id = 'logo-container'
        let img = document.createElement('object')
        img.data = '../../../img/rtpp-full.svg'
        img.id = 'project-logo'

        section.appendChild(img)

      }

      // build description container and insert landing page text
      else{
        section.id = 'desc-container'
        section.insertAdjacentHTML(
          'beforeend', 
          `<p>
            Where should transit improvement and transit supportive investments be made in the
            <abbr title="Delaware Valley Regional Planning Commission">DVRPC</abbr> region? 
            <strong>Use this platform to evaluate service, operational, enforcement, and
            infrastructure improvement ideas!</strong>
          </p>
          `
          )
      }
      
      
      appContainer.appendChild(section)
    }

    // tool nav links
    else{
      let nav = document.createElement('nav')
      for (let section in props){
        let content = props[section],
          link = document.createElement('button'),
          title = document.createElement('p')

        // set link attributes and set the data-page attribute to shorthand for tool for easy access
        link.setAttribute('data-page', section)
        // make sure the background is the right color
        link.style.backgroundColor = content.color
        // give it the title
        link.innerText = content.title

        // listener events
          // SectionChange --> change logo colors, set new description text, build links to tool & documentation, give button active class
        link.onclick = e => SectionChange(e.target, section)
          // hover events to give it some styling
        link.onmouseover = e => e.target.style.background = content.secondary
        link.onmouseleave = e => e.target.style.background = content.color
        
        // send it
        nav.appendChild(link)
      }
      appContainer.appendChild(nav)
    }
    i ++
  }
}


class Home{
  constructor(){
    this.props = {
      gap: {
        title : 'Transit Network Gap Analyzer',
        color: '#8bb23f',
        secondary: '#d1e0b2',
        description: `<p><strong>Where are there gaps in the transit network?</strong> Evaluate in-demand connections between transit 
        supportive origins and destinations where transit is not available or not competitive with vehicles using a composite measure.</p>`
      },
      reliability: {
        title: 'Surface Transit Reliability',
        color: '#e89234',
        secondary: '#edceab',
        description: `<p><strong>Where should efforts to improve transit reliability be focused?</strong> A variety of factors such as 
        infrastructure, congestion, and enforcement impact surface transit reliability. Find out where reliability issues are likely to
        impact the most passengers.</p>`
      },
      frequency: {
        title: 'Doubled Frequency Scenario',
        color: '#d8c72e',
        secondary: '#efe9ab',
        description: `<p><strong>Where is there potential latent demand for higher frequency transit service?</strong> View results of how
        a regional travel demand model scenario in which transit frequency is doubled compares to the existing scenario.</p>`
      },
      accessibility: {
        title: 'Wheelchair Accessibility',
        color: '#06bf9c',
        secondary: '#a7ddd1',
        description: `<p><strong>Where can station accessibility improvements have the greatest impact for wheelchair users?</strong> View data 
        showing destinations reachable via rail by wheelchair users as compared to all users.</p>`
      }
    }
    this.render()
  }
  render(){
    let main = document.querySelector('main')
    main.id = 'home'
    // check if header exists (coming from analysis page)
    if (document.querySelector('header')){
      let header = document.querySelector('header')
      // remove header
      header.parentNode.removeChild(header)
    }
    Landing(this.props, main);
  }
}

export { Home };