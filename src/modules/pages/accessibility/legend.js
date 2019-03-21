import '../../../css/pages/accessibility/legend.css'

/*
  BuildLegend(content)
    @purpose: Builds the legend for each accessibility section
    @params:
      content: content reference object for section to build legend for. Defined in class constructor 
*/

const BuildLegend = content =>{
  // housekeeping
  let section= content.text.id ? document.getElementById(content.text.id) : document.getElementById('caseStudy-legend'),
    legend = document.createElement('div'),
    stations = document.createElement('section'),
    zones = document.createElement('section')
  
  legend.classList.add('accessibility-legend')
  stations.classList.add('accessibility__legend-stations')
  zones.classList.add('accessibility__legend-zones')

  // if it's the caseStudy section, delete the old one
  if (!content.text.id){
    while(section.firstChild){
      section.removeChild(section.firstChild)
    }
  }
  
  // build stations legend
  for (let station of content.map.legend.stations){
    let row = document.createElement('div'),
      icon = document.createElement('div'),
      label = document.createElement('p')

    // set classes
    row.classList.add('accessibility__legend-row')
    icon.classList.add('station-icon')
    label.classList.add('legend-label')

    // icon attributes
    icon.setAttribute('data-value', station[0])
    icon.style.backgroundColor = station[1]

    // row labels
    switch(station[0]){
      case 0:
        label.innerText = 'No Current or Programmed Access'
        break;
      case 1:
        label.innerText = 'Wheelchair Accessible'
        break;
      case 2:
        label.innerText = 'Programmed Improvement'
      default:
        break;
    }

    // send it
    row.appendChild(icon)
    row.appendChild(label)
    stations.appendChild(row)
  }

  // build zones legend
  if (content.map.legend.zones){
      let title = document.createElement('h3'),
        row = document.createElement('div')

    row.classList.add('accessibility__legend-row')
    title.innerText = content.map.legend.zones.header
    zones.appendChild(title)

    // set the zone item colors and labels
    content.map.legend.zones.colors.forEach((color, index)=>{
      // create labels before & after the boxes
      if (index == 0 || index == (content.map.legend.zones.colors.length - 1)){
        let label = document.createElement('p'),
          box = document.createElement('div')

        box.classList.add('accessibility__legend-zoneBox')
        label.classList.add('legend__row-label')

        // assign text accordingly (less/more | few/many)
        label.innerText = index == 0 ? content.map.legend.zones.labels[0] : content.map.legend.zones.labels[1]
        box.style.backgroundColor = color

        // assign in correct order
        if (index == 0){
          row.appendChild(label)
          row.appendChild(box)
        }
        else{
          row.appendChild(box)
          row.appendChild(label)
        }
      }
      // create box & set color
      else{
        let box = document.createElement('div')
        box.classList.add('accessibility__legend-zoneBox')
        box.style.backgroundColor = color
        row.appendChild(box)
      }
    })

    // send 'em
    zones.appendChild(row)
  }
  legend.appendChild(stations)
  legend.appendChild(zones)
  section.appendChild(legend)

  
}

class Legend{
  constructor(props){
    this.props = props
    this.render()
  }

  render(){
    BuildLegend(this.props)
  }

}

export { Legend }