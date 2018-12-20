import '../../../../css/pages/map/sidebar.css'
import { QueryContainer } from './queryInput/queryInput.js'
import { HeaderElements } from '../../../header/HeaderElements.js'

const MenuContent = (menu, container, content) =>{
  let jawn = document.createElement('div')
  jawn.className = 'map__sidebar-menuContent'
  jawn.id = `${menu.innerText.toLowerCase()}_dropdownContent`
  if (menu.innerText.toLowerCase() != 'summary') menu.classList.add('active')

  // function to return proper HTML strings
  const createContent = menu =>{
    switch(menu.innerText.toLowerCase()){
      case 'summary':
        return content
        break;
      default:
        return ''
        break;
    }
  }
  jawn.innerHTML =  createContent(menu)
  container.appendChild(jawn)
}


const BuildMenus = content =>{
  let container = document.querySelector('.gap').appendChild(document.createElement('div'))
  container.classList.add('map__sidebar')
  let sidebar = document.createElement('ul')
  sidebar.classList.add('map__sidebar-menuContainer')
  let sidebarContent = document.createElement('div')
  sidebarContent.classList.add('map__sidebar-content')
  for (let key in content){
    let header = document.createElement('li')
    header.classList.add('map__sidebar-menuHeader')
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

class Sidebar{
  constructor(){
    this.state = {
      container: document.querySelector('#main'),
      elements: {
        analysis: {
          geography: '',
          selection: '',
          direction: ''
        },
        summary: `Please perform an analysis query to populate this area with results.`,
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

  }
}

export { Sidebar }