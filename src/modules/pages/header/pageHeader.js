import "../../../css/pages/pageHeader.css"

const BuildHeader = sectionName =>{
  let container = document.querySelector(`.${sectionName.toLowerCase()}-text`)
  let header = document.createElement('div')
  header.classList.add(`text-header`)
  header.innerHTML = `<h2>${sectionName}</h2>`
  container.appendChild(header)
}


class PageHeader{
  constructor(props){
    this.name = props
    this.render()
  }

  render(){
    BuildHeader(this.name)
  }
}

export { PageHeader }