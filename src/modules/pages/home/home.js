import "../../../css/pages/home/home.css"
import { ComingSoon } from "../soon/soon";

const Landing = props =>{
  let container = document.createElement('div')
  container.classList.add('landing__container')
  document.querySelector('#main').appendChild(container)
  for (let section in props){
    let jawn = document.createElement('div')
    jawn.classList.add('landing__section')
    jawn.innerHTML = `<h1>${section}</h1>`
    container.appendChild(jawn)
  }
}

class Home{
  constructor(){
    this.props = {
      analysis: [],
      documentation: [],
      project: []
    }
    this.render()
  }
  render(){
    new ComingSoon();
    Landing(this.props);
  }
}

export { Home };