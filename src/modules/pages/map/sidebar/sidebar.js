import '../../../../css/map/sidebar.css'

const MenuContent = (menu, content) =>{
  let jawn = document.createElement('div')
  jawn.className = 'map__sidebar-menuContent'
  jawn.id = `${menu.innerText.toLowerCase()}_dropdownContent`
  const createContent = menu =>{
    switch(menu.innerText.toLowerCase()){
      case 'legend':
        return 'this will be the legend'
        break;
      case 'summary':
        return 'this will be the summary'
        break;
      case 'parameters':
        return 'this will be the parameters'
        break;
      default:
        return 'this might be content'
        break;
    }
  }
  jawn.innerHTML =  createContent(menu)
  menu.parentNode.appendChild(jawn)
}
const BuildMenus = (sidebar, content) =>{
  let container = sidebar.appendChild(document.createElement('div'))
  container.className = 'map__sidebar-menuContainer'
  for (let key in content){
    let menu = document.createElement('button')
    menu.className = 'map__sidebar-menu'
    menu.id = `dropdown_${key}`
    let title = key.toLowerCase().split(' ').map(each=>{
      return each.replace(each[0], each[0].toUpperCase());
    }).join(' ');
    menu.innerText = title
    container.appendChild(menu)
    MenuContent(menu, content[key])
    menu.addEventListener('click', e=>{
      let viz = document.querySelector(`#${menu.innerText.toLowerCase()}_dropdownContent`)
      viz && viz.style.display != 'block' ? viz.style.display = 'block' : viz.style.display = 'none'
    })
  }
}

class Sidebar{
  constructor(){
    this.state = {
      container: document.querySelector('.map__container'),
      elements: {
        legend: {
          classes: [],
          label: '',
        },
        summary: `this will be a summary sentence`,
        parameters: {
          geography: '',
          selection: '',
          direction: ''
        }
      },
      open: undefined
    }
    this.render()
  }

  render(){
    let sidebar = document.createElement('div')
    sidebar.id = 'sidebar'
    BuildMenus(sidebar, this.state.elements)
    this.state.container.appendChild(sidebar)

  }
}

export { Sidebar }