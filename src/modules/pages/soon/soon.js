import "../../../css/pages/soon/soon.css"

class ComingSoon{
  constructor(){
    this.render()
  }

  render(){
    let container = document.querySelector('#main').appendChild(document.createElement('div'))
    container.classList.add('comingSoon__container')
    let background = container.appendChild(document.createElement('div'))
    background.classList.add('comingSoon__background')
    let splash = container.appendChild(document.createElement('div'))
    splash.classList.add('comingSoon__splash')
    splash.innerHTML = '<p>Coming Soon</p>'
  }
}

export { ComingSoon }