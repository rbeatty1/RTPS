import '../../../css/pages/accessibility/legend.css'

const BuildLegend = content =>{
  let section= content.text.id ? document.getElementById(content.text.id) : document.getElementById('caseStudy-legend'),
    legend = document.createElement('div'),
    stations = document.createElement('section'),
    zones = document.createElement('section')
  
  legend.classList.add('accessibility-legend')
  stations.classList.add('accessibility__legend-stations')
  zones.classList.add('accessibility__legend-zones')

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
  let title = document.createElement('h3'),
      row = document.createElement('div')

  row.classList.add('accessibility__legend-row')
  title.innerText = content.map.legend.zones.header
  zones.appendChild(title)

  content.map.legend.zones.colors.forEach((color, index)=>{
    if (index == 0 || index == (content.map.legend.zones.colors.length - 1)){
      let label = document.createElement('p'),
        box = document.createElement('div')

      box.classList.add('accessibility__legend-zoneBox')
      label.classList.add('legend__row-label')

      label.innerText = index == 0 ? content.map.legend.zones.labels[0] : content.map.legend.zones.labels[1]
      box.style.backgroundColor = color

      if (index == 0){
        row.appendChild(label)
        row.appendChild(box)
      }
      else{
        row.appendChild(box)
        row.appendChild(label)
      }
    }
    else{
      let box = document.createElement('div')
      box.classList.add('accessibility__legend-zoneBox')
      box.style.backgroundColor = color
      row.appendChild(box)
    }
  })

  zones.appendChild(row)


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