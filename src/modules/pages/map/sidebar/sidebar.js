import '../../../../css/pages/map/sidebar.css'
import { QueryContainer } from './queryInput/queryInput.js'
import { HeaderElements } from '../../../header/HeaderElements.js'
import {Legend} from './legend.js'

const MenuContent = (menu, container, content) =>{

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
  if (title != 'summary') {
    for (let section in content){
      if (section == 'inputs'){
        let queryContainer = new QueryContainer()
        queryContainer.list = HeaderElements[1].content;
        let queryList = [];
        for (var k in queryContainer.list) queryList.push(queryContainer.list[k]);
      }
      else{
        let results = document.createElement('section')
        results.id = 'gap__results-section'
        results.innerHTML = content.results
        jawn.appendChild(results)
      }
    }
  }
  else{
    let summary = document.createElement('section')
    menu.classList.add('active')
    jawn.classList.add('active')
    summary.innerHTML = content
    BuildAnalysisDescription(summary)
    jawn.appendChild(summary)
  }
  container.appendChild(jawn)
}



const BuildMenus = content =>{
  const TransitToggle = () =>{
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
    let sidebar = document.querySelector('aside'),
      header = document.createElement('div')
    header.classList.add('transit-toggle')
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
            content.map.setLayoutProperty(name, 'visibility', 'visible')
            content.map.setLayoutProperty('rail-labels', 'visibility', 'visible')
          }
          else{
            content.map.setLayoutProperty('bus-lines', 'visibility', 'visible')
          }
        }
        else{
          if (name == 'rail-lines'){
            content.map.setLayoutProperty(name, 'visibility', 'none')
            content.map.setLayoutProperty('rail-labels', 'visibility', 'none')
          }
          else{
            content.map.setLayoutProperty('bus-lines', 'visibility', 'none')
          }
        }
      }
  
      container.appendChild(data.box)
      container.appendChild(data.label)
      header.appendChild(container)
    }



    sidebar.appendChild(header)
  
  }


  let container = document.querySelector('.gap').appendChild(document.createElement('aside'))
  container.classList.add('map__sidebar')
  let sidebar = document.createElement('nav')
  sidebar.classList.add('map__sidebar-menuContainer')
  let sidebarContent = document.createElement('div')
  sidebarContent.classList.add('map__sidebar-content')
  for (let key in content.elements){
    let header = document.createElement('a')
    header.classList.add('map__sidebar-menuHeader')
    header.href = '#'
    header.rel = 'noopener'
    header.setAttribute('data-type', key.toLowerCase())
    let title = key != "summary" ? "Local Analysis" : "Regional Summary"
    header.innerText = title
    sidebar.appendChild(header)
    MenuContent(header, sidebarContent, content.elements[key])
    header.addEventListener('click', e=>{
      let sections = document.querySelectorAll('.map__sidebar-menuContent'),
      headers = document.querySelectorAll('.map__sidebar-menuHeader')
      for (let header of headers) header == e.target ? header.classList.add('active') : header.classList.remove('active');
      for (let section of sections) section.id == `${e.target.innerText.split(' ')[1].toLowerCase()}_dropdownContent` ? section.classList.add('active') : section.classList.remove('active')
    })
    
  }
  container.appendChild(sidebar)
  TransitToggle()
  container.appendChild(sidebarContent)

}


class Sidebar{
  constructor(props){
    this.state = {
      container: document.querySelector('#main'),
      elements: {
        summary: "This regional summary map shows <abbr title='Traffic Analysis Zone'>TAZ</abbr>s symbolized using the average network gap score. The darker the color, the higher the score, indicating a higher priority transit gap. A transit gap is defined as an in-demand connection between transit supportive places where transit is either not available or not competitive.",
        analysis: {
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