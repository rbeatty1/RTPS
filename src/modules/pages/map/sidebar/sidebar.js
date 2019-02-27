import '../../../../css/pages/map/sidebar.css'
import { QueryContainer } from './queryInput/queryInput.js'
import { HeaderElements } from '../../../header/HeaderElements.js'
import {Legend} from './legend.js'

const MenuContent = (menu, container, content) =>{

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
    let title = key != "summary" ? "Local Analysis" : "Regional Summary"
    header.innerText = title
    sidebar.appendChild(header)
    MenuContent(header, sidebarContent, content[key])
    header.addEventListener('click', e=>{
      let sections = document.querySelectorAll('.map__sidebar-menuContent'),
      headers = document.querySelectorAll('.map__sidebar-menuHeader')
      for (let header of headers) header == e.target ? header.classList.add('active') : header.classList.remove('active');
      for (let section of sections) section.id == `${e.target.innerText.split(' ')[1].toLowerCase()}_dropdownContent` ? section.classList.add('active') : section.classList.remove('active')
    })
    
  }
  container.appendChild(sidebar)
  container.appendChild(sidebarContent)

}


class Sidebar{
  constructor(){
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
    let legend = document.createElement('section'),
      summaryContainer = document.getElementById('summary_dropdownContent')
    new Legend(legend)
    summaryContainer.appendChild(legend)

  }
}

export { Sidebar }