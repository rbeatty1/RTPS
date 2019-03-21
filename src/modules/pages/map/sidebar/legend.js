


/*
    BuildClasses(target, data)
    @purpose: Build legend items for the different class breaks and set fill color appropriately
    @params:
        target: container for the legend to be appended to
        data: color data for gap legend, but also section names (not served | served)
*/
const BuildClasses = (target, data) =>{
    /*
        BuildLegendBoxes(colors)
        @purpose: Build actual boxes for legend component
        @param:
            colors: fill colors of legend boxes
    */
    const BuildLegendBoxes = colors =>{
        // container to append legend boxes to
        let container = document.createElement('div')
        container.classList.add('map__sidebar-legendSection')
        
        // iterate through colors array to create each class and set background color 
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
        
        typeContainer.appendChild(boxes)
        typeContainer.appendChild(title)
        container.appendChild(typeContainer)
    }
    // stick it
    target.appendChild(container)
}

/*
    BuildLabels(target, data)
    @purpose: Build low -> high -> low labels for legend
    @params:
        target: legend container to append labels to
        data: label text
*/
const BuildLabels = (target, data) =>{
    let container = document.createElement('div')
    container.classList.add('map__sidebar-legendLabels')

    // iterate through and create labels
    data.map(label=>{
        let text = document.createElement('p')
        text.innerText = label
        container.appendChild(text)
    })
    // stick it
    target.appendChild(container)

}

/*
    BuildDescription(target, data)
    @purpose: Build text description of what the legend depicts
    @params:
        target: legend container to append text to
        data: text content
*/

const BuildDescription = (target, data) =>{

    // declare local variables
    let section = document.createElement('div'),
        button = document.createElement('button'),
        content = document.createElement('div')

    // container housekeeping
    section.classList.add('gap__sidebar-contentButton')
    
    // button housekeeping
    button.innerText = 'What do the colors mean?'
    button.setAttribute('aria-expanded', false)

    // display button content + aria actions
    button.onclick = e => {
        let target = e.target,
            content = e.target.nextElementSibling
        
        target.getAttribute('aria-expanded') == 'false' ? target.setAttribute('aria-expanded', true) : target.setAttribute('aria-expanded', false)
        content.getAttribute('aria-hidden') == 'true' ? content.setAttribute('aria-hidden', false) : content.setAttribute('aria-hidden', true)
        
        content.classList.toggle('active')
    }

    // create title/text for each section
    for (let color in data){
        let contents = data[color],
            text = document.createElement('p')

        text.innerHTML = contents

        content.appendChild(text)
    }

    // content housekeeping
    content.setAttribute('aria-hidden', true)

    // send 'em
    section.appendChild(button)
    section.appendChild(content)
    target.appendChild(section)
    
}
export class Legend{
    constructor(container){
        this.data = {
            target: container,
            content: {
                colors:{
                  "Not Served": ['#b5dfd1', '#90d1be', '#2cb99a', '#599f8c', '#5d8078', '#4f5c5a'],
                  "Served": [ '#8d7355', '#ba864e', '#e89232', '#eda559', '#f5cea4', '#fae4cd']
                },
                labels : ['Low', 'High', 'Low']
            },
            descriptions:{
                0: `<strong style="color: #8d7355">Dark orange</strong> means that transit service exists between that zone and the selected study area, and has transit supportive densities, but 
                service is relatively indirect in terms of distance and transfer requirements.`,
                1: `<strong style="color: #f5cea4">Light orange</strong> means that transit service exists between that zone and the selected study area, but the transit connection is already 
                direct and/or the origin or destination lack transit supportive densities`,
                2: `<strong style="color: #5d8078">Dark green</strong> means that there is very little to no transit service between that zone and the selected study area. However, it is relatively
                dense and more than a few trips are regularly made between that zone and the selected study area.`,
                3: `<strong style="color: #b5dfd1">Light green</strong> means that there is very little to no transit service between that zone and the selected study area. The area lacks transit supportive densities and few trips are made regularly between that zone and the selected study area.`
            }
        }
        this.render()
    }

    render(){
        let container = this.data.target,   
            title = document.createElement('h2')

        title.classList.add('gap-legend-title')
        title.innerText = 'Transit Gap Priority'
        container.appendChild(title)
        BuildLabels(container, this.data.content.labels)
        BuildClasses(container, this.data.content.colors)
        BuildDescription(container, this.data.descriptions)
    }
}