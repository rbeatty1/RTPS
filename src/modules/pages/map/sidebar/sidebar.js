import '../../../../css/pages/map/sidebar.css'
import { QueryContainer } from './queryInput/queryInput.js'
import { HeaderElements } from '../../../header/HeaderElements.js'

const MenuContent = (menu, content) =>{
  let jawn = document.createElement('div')
  jawn.className = 'map__sidebar-menuContent'
  jawn.id = `${menu.innerText.toLowerCase()}_dropdownContent`

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
  menu.parentNode.appendChild(jawn)
}
const BuildMenus = ( content) =>{
  let container = document.querySelector('.gap').appendChild(document.createElement('div'))
  container.className = 'map__sidebar'
  let sidebar = container.appendChild(document.createElement('div'))
  sidebar.classList = 'map__sidebar-menuContainer'
  for (let key in content){
    let menu = document.createElement('button')
    menu.className = 'map__sidebar-menu'
    menu.id = `dropdown_${key}`
    // titlecase
    let title = key.toLowerCase().split(' ').map(each=>{
      return each.replace(each[0], each[0].toUpperCase());
    }).join(' ');
    menu.innerText = title
    sidebar.appendChild(menu)
    MenuContent(menu, content[key])
    menu.addEventListener('click', e=>{
      let viz = document.querySelector(`#${menu.innerText.toLowerCase()}_dropdownContent`)
      viz.classList.contains('active') ? viz.classList.remove('active') : viz.classList.add('active')
    })
  }
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