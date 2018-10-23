import '../../../../css/map/sidebar.css'
import { QueryContainer } from './queryInput/queryInput.js'
import { HeaderElements } from '../../../header/HeaderElements.js'

const MenuContent = (menu, content) =>{
  let jawn = document.createElement('div')
  jawn.className = 'map__sidebar-menuContent'
  jawn.id = `${menu.innerText.toLowerCase()}_dropdownContent`

  // function to return proper HTML strings
  const createContent = menu =>{
    switch(menu.innerText.toLowerCase()){
      case 'legend':
        let table = document.createElement('table')
        let row = document.createElement('tr')
        let cnt = 0
        content.classes.forEach(function(bin){
          let cell = document.createElement('TD')
          cell.className = 'map__sidebar-legendCell'
          cell.style.backgroundColor = bin
          
          cnt ++
          row.appendChild(cell)
        })
        table.appendChild(row)
        let template = `
        <h4 class='map__sidebar-legendLabel'>${content.label}</h4>
        ${table.outerHTML}
        `
        return template
        break;
      case 'summary':
        return content
        break;
      case 'analysis':
        return ''
        break;
      default:
        return 'this might be content'
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
        legend: {
          classes: ["#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603", "#7f2704"],
          label: 'Transit Improvement Priority',
        },
        summary: `This map shows the average network gap score for connections DIRECTION the selected area. Only zones with demand DIRECTION the selected area are displayed. The darker colors indicate higher priority connections in relation to the selected area.`,
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