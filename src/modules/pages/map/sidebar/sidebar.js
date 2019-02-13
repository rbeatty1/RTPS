import '../../../../css/pages/map/sidebar.css'
import { QueryContainer } from './queryInput/queryInput.js'
import { HeaderElements } from '../../../header/HeaderElements.js'

const MenuContent = (menu, container, content) =>{

  let jawn = document.createElement('div'),
    title = menu.innerText.toLowerCase()
  jawn.className = 'map__sidebar-menuContent'
  jawn.id = `${title}_dropdownContent`
  if (title != 'summary') {
    menu.classList.add('active')
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
    summary.innerHTML = content
    jawn.appendChild(summary)
  }
  container.appendChild(jawn)
}


const BuildMenus = content =>{
  let container = document.querySelector('.gap').appendChild(document.createElement('aside'))
  container.classList.add('map__sidebar')
  let sidebar = document.createElement('nav')
  sidebar.classList.add('map__sidebar-menuContainer')
  let sidebarContent = document.createElement('div')
  sidebarContent.classList.add('map__sidebar-content')
  for (let key in content){
    let header = document.createElement('a')
    header.classList.add('map__sidebar-menuHeader')
    header.href = '#'
    header.rel = 'noopener'
    header.setAttribute('data-type', key.toLowerCase())
    let title = key.toLowerCase().split(' ').map(each=> each.replace(each[0], each[0].toUpperCase()))
    header.innerText = title
    sidebar.appendChild(header)
    MenuContent(header, sidebarContent, content[key])
    header.addEventListener('click', e=>{
      let sections = document.querySelectorAll('.map__sidebar-menuContent'),
      headers = document.querySelectorAll('.map__sidebar-menuHeader')
      for (let header of headers) header == e.target ? header.classList.add('active') : header.classList.remove('active');
      for (let section of sections) section.id == `${e.target.innerText.toLowerCase()}_dropdownContent` ? section.classList.add('active') : section.classList.remove('active')
    })
    
  }
  container.appendChild(sidebar)
  container.appendChild(sidebarContent)

}

const BuildSummaryLegend = () =>{
  let legendContent = {
    create: document.createElement('div'),
    colors:{
      "Not Served": ['#b5dfd1', '#90d1be', '#2cb99a', '#599f8c', '#5d8078', '#4f5c5a'],
      "Served": [ '#8d7355', '#ba864e', '#e89232', '#eda559', '#f5cea4', '#fae4cd']
    },
    labels : ['Low', 'High', 'Low']
  },
  section = document.getElementById('summary_dropdownContent'),
  legendSection = document.createElement('section'),
  labelsContainer = document.createElement('div'),
  classContainer = document.createElement('div')

  legendSection.id = 'summary-legend'
  classContainer.classList.add('map__sidebar-legendClasses')
  
  for (let service in legendContent.colors){
    let serviceSection = document.createElement('div'),
      label = document.createElement('p'),
      breaksContainer = document.createElement('div')
    breaksContainer.classList.add('map__sidebar-legendSection')
    label.innerText = service
    label.classList.add('map__sidebar-legendTitle')
    serviceSection.classList.add('map__sidebar-legend')
    serviceSection.appendChild(label)
    legendContent.colors[service].map(color=>{
      let jawn = document.createElement('div')
      jawn.classList.add('map__sidebar-legendCell')
      jawn.style.backgroundColor = color
      breaksContainer.appendChild(jawn)
    })
    serviceSection.appendChild(breaksContainer)
    classContainer.appendChild(serviceSection)
  }

  labelsContainer.classList.add('map__sidebar-legendLabels')
  legendContent.labels.map(text=>{
    let label = document.createElement('p')
    label.innerText = text
    labelsContainer.appendChild(label)
  })
  legendSection.appendChild(classContainer)
  legendSection.appendChild(labelsContainer)

  section.appendChild(legendSection)

}

class Sidebar{
  constructor(){
    this.state = {
      container: document.querySelector('#main'),
      elements: {
        analysis: {
          inputs: {
            geography: '',
            selection: '',
            direction: ''
          },
          results: `Please perform an analysis query to populate this area with results.`,
        },
        summary: "This map summarizes the network gap analysis which identifies in demand connections between transit supportive places where transit is either not available or not competitive."
      },
      open: undefined
    }
    this.render()
  }

  render(){
    BuildMenus(this.state.elements)
    // // query inputs
    if (!document.querySelector('.sidebar__input-container')){
        let queryContainer = new QueryContainer();
        queryContainer.list = HeaderElements[1].content;
        let queryList = [];
        for (var k in queryContainer.list){
            queryList.push(queryContainer.list[k]);
            }
    }
    BuildSummaryLegend()

  }
}

export { Sidebar }