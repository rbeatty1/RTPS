const BuildClasses = (target, data) =>{
    const BuildLegendBoxes = colors =>{
        let container = document.createElement('div')
        container.classList.add('map__sidebar-legendSection')
        colors.map(color=>{
            let box = document.createElement('div')
            box.classList.add('map__sidebar-legendCell')
            box.style.backgroundColor = color
            container.appendChild(box)
        })
        return container

    }
    // class section container
    let container = document.createElement('div')
    container.classList.add('map__sidebar-legendClasses')

    // build section for each data set
    for (let type in data){
        let typeContainer = document.createElement('div')
        typeContainer.classList.add('map__sidebar-legend')

        // title 
        let title = document.createElement('p')
        title.classList.add('map__sidebar-legendTitle')
        title.innerText = type

        // class boxes
        let boxes = BuildLegendBoxes(data[type])
        
        typeContainer.appendChild(title)
        typeContainer.appendChild(boxes)
        container.appendChild(typeContainer)
    }
    // stick it
    target.appendChild(container)
}

const BuildLabels = (target, data) =>{
    let container = document.createElement('div')
    container.classList.add('map__sidebar-legendLabels')

    // map through and create labels
    data.map(label=>{
        let text = document.createElement('p')
        text.innerText = label
        container.appendChild(text)
    })
    // stick it
    target.appendChild(container)

}

const BuildDescription = (target, data) =>{

    // declare local variables
    let section = document.createElement('div'),
        button = document.createElement('button')
        content = document.createElement('div')

    // container housekeeping
    section.classList.add('gap__sidebar-contentButton')
    
    // button housekeeping
    button.innerText = 'What do the colors mean?'
    button.onclick = e => e.target.nextElementSibling.classList.toggle('active')

    // create title/text for each section
    for (let color in data){
        let contents = data[color],
            title = document.createElement('h3'),
            text = document.createElement('p')
        
        title.innerText = contents.title
        text.innerText = contents.text

        content.appendChild(title)
        content.appendChild(text)
    }

    // send 'em
    section.appendChild(button)
    section.appendChild(content)
    target.appendChild(section)
    
}
export class Legend{
    constructor(input){
        this.data = {
            target: input,
            content: {
                colors:{
                  "Not Served": ['#b5dfd1', '#90d1be', '#2cb99a', '#599f8c', '#5d8078', '#4f5c5a'],
                  "Served": [ '#8d7355', '#ba864e', '#e89232', '#eda559', '#f5cea4', '#fae4cd']
                },
                labels : ['Low', 'High', 'Low']
            },
            descriptions:{
                0: {
                    title: 'Dark Orange',
                    text: 'Transit service exists between that zone and the selected study area, and has transit supportive densities, but service is relatively indirect in terms of distance and transfer requirements.'
                },
                1: {
                    title: 'Light Orange',
                    text: 'Transit service exists between that zone and the selected study area, but the transit connection is already direct and/or the origin or destination lack transit supportive densities'
                },
                2: {
                    title: 'Dark Green',
                    text: 'There is very little to no transit service between that zone and the selected study area. However, it is relatively dense and more than a few trips are regularly made between that zone and the selected study area.'
                },
                3: {
                    title: 'Light Green',
                    text: 'There is very little to no transit service between that zone and the selected study area. The area lacks transit supportive densities and few trips are made regularly between that zone and the selected study area.'
                }
            }
        }
        this.render()
    }

    render(){
        let container = this.data.target
        BuildClasses(container, this.data.content.colors)
        BuildLabels(container, this.data.content.labels)
        BuildDescription(container, this.data.descriptions)
    }
}