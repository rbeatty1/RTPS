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
            }
        }
        this.render()
    }

    render(){
        let container = this.data.target
        BuildClasses(container, this.data.content.colors)
        BuildLabels(container, this.data.content.labels)
    }
}