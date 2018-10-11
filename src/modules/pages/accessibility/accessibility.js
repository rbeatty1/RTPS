import '../../../css/pages/accessibility/accessibility.css'
import { styles } from '../map/map_styles/accessibility.js'

const LoadLayers = (map, styles) =>{
  for (let source in styles){
    map.addSource(source, {
      type: styles[source].type,
      url: styles[source].url
    })
    for (let layer in styles[source].layers){
      let thisLayer = styles[source].layers[layer]
      let layerDef = {
        "id": `${source}-${layer}`,
        "type": thisLayer.type,
        "source": source,
        "source-layer": layer,
        "paint": thisLayer.paint
      }
      !thisLayer.filter ? null : layerDef['filter'] = thisLayer.filter
      !thisLayer.layout ? null : layerDef['layout'] = thisLayer.layout
      map.addLayer(layerDef)
    }
  }
}
const BuildMap = (container, props) =>{
  mapboxgl.accessToken = 'pk.eyJ1IjoiYmVhdHR5cmUxIiwiYSI6ImNqOGFpY3o0cTAzcXoycXE4ZTg3d3g5ZGUifQ.VHOvVoTgZ5cRko0NanhtwA';
  let map = new mapboxgl.Map({
    container: container,
    style: 'mapbox://styles/beattyre1/cjky7crbr17og2rldo6g7w5al',
    center: [-75.247, 40.023],
    zoom: 8,
    hash: true
  })
  map.on('load', _ => {
      map.resize();
      LoadLayers(map, styles)
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')
  })

}

const BuildPage = props =>{
  props.container.innerHTML = ''
  let page = document.createElement('div')
  page.classList.add('accessibility-page')
  for (let section in props.sections){
    let container = document.createElement('div')
    container.classList.add('accessibility-section')
    container.id = `#${section}`
    let textBox = document.createElement('div')
    textBox.classList.add('accessibility-text')
    textBox.id = `accessibilityText-${section}`
    let mapBox = document.createElement('div')
    mapBox.classList.add('accessibility-map')
    mapBox.id = `accessibilityMap-${section}`
    container.appendChild(textBox)
    container.appendChild(mapBox)
    BuildMap(mapBox)
    page.appendChild(container)
  }
  
  props.container.appendChild(page)
}

class Accessibility{
  constructor(){
    this.props = {
      container: document.querySelector('#main'),
      sections: {
        allAccessibility: {
          title: 'Accessibility from All Rail Stations'
        },
        currentAccessibility:{
          title: 'Accessible Destinations using Only Wheelchair Accessible Stations'
        },
        currentDisparity:{
          title: 'Destination Disparity for Wheelchair users in Comparison with All Users'
        },
        futureAccessibility:{
          title: 'Destinations Accessible using Accessible Stations or Those with Programmed Improvements'
        },
        futureDisparity:{
          title: 'Destination Disparity using Accessible Stations or Those with Programmed Improvements'
        },
        relativeDisparity:{
          title: 'Relative Benefit of Programmed Accessibility Improvements'
        },
      }
    }
    this.render()
  }

  render(){
    let page = BuildPage(this.props)
    

  }
}

export { Accessibility }
