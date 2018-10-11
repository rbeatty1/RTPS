class Sidebar{
  constructor(){
    this.render()
  }

  render(){
    let sidebar = document.createElement('div')
    sidebar.id = 'sidebar'
    let main = document.querySelector('.map__container')
    main.appendChild(sidebar)

  }
}

export { Sidebar }