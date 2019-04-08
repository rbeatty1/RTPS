import '../../../../css/pages/map/sidebar.css'
import { QueryContainer } from './queryInput/queryInput.js'
import { HeaderElements } from '../../../header/HeaderElements.js'
import {Legend} from './legend.js'
import { Footer } from '../../../footer/footer';


/*
  BuildMenus(appContent)
  @purpose: build sidebar based on content reference
  @params:
    appContent: content reference object for page
*/
const BuildMenus = appContent =>{
  /*
    MenuContent(menu, container, content)
    @purpose: build specific tab content
    @params:
      menu: header element to identify tab
      container: element to append all of these jawns to
      content: content that will drive menu creation
  */
  const MenuContent = (menu, container, content) =>{
    /*
      TransitToggle(target)
      @purpose: Build a small map toggle to control transit layer visibility
      @params:
        target: element in which the toggle will be appended to
    */
    const TransitToggle = target =>{
      let toggleRef = {
        rail : {
            box : document.createElement('input'),
            label : document.createElement('label'),
        },
        bus : {
            box : document.createElement('input'),
            label : document.createElement('label'),
            layer : 'transit-bus'
        }
      }
      let header = document.createElement('div')
      header.classList.add('transit-toggle')

      // iterate through reference object to create the checkboxes/labels/actions
      for (let layer in toggleRef){
        let data = toggleRef[layer],
            container = document.createElement('div')
      
        data.box.type = 'checkbox'
        data.box.name = `${layer}-lines`
        data.label.setAttribute('for', data.box.name)
        data.label.innerText = `Show ${layer} layer`
      
        data.box.onchange = e =>{
            let name = e.target.name
            if (e.target.checked){
              if (name == 'rail-lines'){
                  appContent.map.setLayoutProperty(name, 'visibility', 'visible')
                  appContent.map.setLayoutProperty('rail-labels', 'visibility', 'visible')
              }
              else{
                  appContent.map.setLayoutProperty('bus-lines', 'visibility', 'visible')
              }
            }
            else{
              if (name == 'rail-lines'){
                  appContent.map.setLayoutProperty(name, 'visibility', 'none')
                  appContent.map.setLayoutProperty('rail-labels', 'visibility', 'none')
              }
              else{
                  appContent.map.setLayoutProperty('bus-lines', 'visibility', 'none')
              }
            }
        }
      
        container.appendChild(data.box)
        container.appendChild(data.label)
        header.appendChild(container)
      }
    
    
    
      target.appendChild(header)
    
    }

    /*
      BuildAnalysisDescription(container)
      @purpose: Build description of analysis
      @params:
        container: element to attach description to
    */
    const BuildAnalysisDescription = container =>{
  
      // reference object for content
      let text = {
        summary: `The network gap score was calculated by multiplying the <strong>directness score</strong>
        and the <strong>density score</strong>. The result was then weighted by the <strong>demand score</strong>
        ensuring that the <abbr title="Origin-Destination">OD</abbr> pairs identified as a transit gap that also
        have a high demand for travel are considered a higher priority.`,
        direct: `<strong>Directness Score:</strong> For each Origin-Destination (<abbr title="Origin-Destination">OD</abbr>) pair, of <abbr title="Traffic Analysis Zone">TAZ</abbr>
          in the region, the directness score was determined by the presence of a transit connection, how it compared
          to driving in terms of time and distrance, the number of transfers required for the trip, and the scheduled wait
          time for those transfers. A high score means the <abbr title="Origin-Destination">OD</abbr> pair was not served 
          or not well connected by existing transit service.`,
        density: `<strong>Density Score:</strong> Density is a measure of transit supportiveness using <abbr title="Delaware Valley Regional Planning Commission">DVRPC</abbr>'s
        2015 TransitScore which is based on the density of population, employment, and zero car households. The transit score for the origin
        was added to the transit score for the destination to get the density score. The higher the density score, the more transit
        supportive the <abbr title="Origin/Destination">OD</abbr> pair.`,
        demand: `<strong>Demand Score:</strong> Demand is based on the total demand for travel between each <abbr title="Origin/Destination">OD</abbr> pair based on
        <abbr title="Delaware Valley Regional Planning Commission">DVRPC</abbr>'s regional travel model.`
        
      },
      // declare local variables
      section = document.createElement('div'),
        button = document.createElement('button'),
        content = document.createElement('div')
  
      // container housekeeping
      section.classList.add('gap__sidebar-contentButton')
  
      // button housekeeping
      button.innerText = 'How was the network gap score calculated?'
      button.onclick = e => e.target.nextElementSibling.classList.toggle('active')
  
      // create title/text for each section
      for (let element in text){
        let p = document.createElement('p')
        p.innerHTML = text[element]
        content.appendChild(p)
  
        // send 'em
        section.appendChild(button)
        section.appendChild(content)
        container.appendChild(section)
      }
  
    }
  
    let jawn = document.createElement('div'),
      title = menu.innerText.split(' ')[1].toLowerCase()
    jawn.className = 'map__sidebar-menuContent'
    jawn.id = `${title}_dropdownContent`

    // do local analysis tab stuff
    if (title != 'summary') {
      for (let section in content){

        switch(section) {
          case ('inputs'):
            let queryContainer = new QueryContainer()
            queryContainer.list = HeaderElements[1].content;
            let queryList = [];
            for (var k in queryContainer.list) queryList.push(queryContainer.list[k]);
            break
          case ('analysisSummary'):
            const summary = document.createElement('p')
            summary.id = 'gap__analysis-summary'
            
            summary.textContent = content.analysisSummary
            jawn.appendChild(summary)
            break
          default:
            let results = document.createElement('section')
            results.id = 'gap__results-section'
            results.innerHTML = content.results
            jawn.appendChild(results)
        }

      }
    }
    // do regional analysis tab stuff
    else{
      let summary = document.createElement('section')
      menu.classList.add('active')
      jawn.classList.add('active')
      summary.innerHTML = content
      BuildAnalysisDescription(summary)
      jawn.appendChild(summary)
    }
    TransitToggle(jawn)
    container.appendChild(jawn)
  }


  let container = document.querySelector('.gap').appendChild(document.createElement('aside'))
  container.classList.add('map__sidebar')
  let sidebar = document.createElement('nav')
  sidebar.classList.add('map__sidebar-menuContainer')
  let sidebarContent = document.createElement('div')
  sidebarContent.classList.add('map__sidebar-content')
  for (let key in appContent.elements){
    let header = document.createElement('h3')

    header.classList.add('map__sidebar-menuHeader')
    header.setAttribute('data-type', key.toLowerCase())

    let title = key != "summary" ? "Local Analysis" : "Regional Summary"
    header.innerText = title


    sidebar.appendChild(header)
    MenuContent(header, sidebarContent, appContent.elements[key])
    
    header.addEventListener('click', e=>{
      let sections = document.querySelectorAll('.map__sidebar-menuContent'),
      headers = document.querySelectorAll('.map__sidebar-menuHeader')
      for (let header of headers) header == e.target ? header.classList.add('active') : header.classList.remove('active');
      for (let section of sections) section.id == `${e.target.innerText.split(' ')[1].toLowerCase()}_dropdownContent` ? section.classList.add('active') : section.classList.remove('active')
    })
    
  }
  const footer = new Footer().footer
  sidebarContent.appendChild(footer)

  container.appendChild(sidebar)
  container.appendChild(sidebarContent)
}


class Sidebar{
  constructor(props){
    this.state = {
      container: document.querySelector('#main'),
      elements: {
        summary: "This regional summary map shows <abbr title='Traffic Analysis Zone'>TAZ</abbr>s symbolized using the average network gap score. The darker the color, the higher the score, indicating a higher priority transit gap. A transit gap is defined as an in-demand connection between transit supportive places where transit is either not available or not competitive.",
        analysis: {
          analysisSummary: 'This dynamic map allows users to identify and prioritize transit gaps to and from specific areas of interest. Select a municipality or TAZ to see where transit connections can be improved or added.',
          inputs: {
            geography: '',
            selection: '',
            direction: ''
          },
          results: `Please perform an analysis query to populate this area with results.`,
        },
      },
      open: undefined,
      map : props.map
    }
    this.render()
  }

  render(){
    BuildMenus(this.state)
    // // query inputs
    if (!document.querySelector('.sidebar__input-container')){
        let queryContainer = new QueryContainer();
        queryContainer.list = HeaderElements[1].content;
        let queryList = [];
        for (var k in queryContainer.list){
            queryList.push(queryContainer.list[k]);
            }
    }
    let legend = document.createElement('section'),
      summaryContainer = document.getElementById('summary_dropdownContent')
    
    new Legend(legend)
    summaryContainer.appendChild(legend)
  }
}

export { Sidebar }