import '../../../css/pages/accessibility/accessibility.css'
import { styles } from '../map/map_styles/accessibility.js'

const LoadLayers = (map, styles) =>{
  for (let source in styles){
    map.addSource(source, styles[source].sourceDef)
    for (let layer in styles[source].layers){
      let thisLayer = styles[source].layers[layer]
      let layerDef = {
        "id": `${source}-${layer}`,
        "type": thisLayer.type,
        "source": source,
        "paint": thisLayer.paint
      }
      !thisLayer.filter ? null : layerDef['filter'] = thisLayer.filter
      !thisLayer.layout ? null : layerDef['layout'] = thisLayer.layout
      styles[source].sourceDef.type != 'vector' ? null : layerDef['source-layer'] = thisLayer.source
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
    textBox.innerHTML = props.sections[section].title+props.sections[section].description
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
          title: '<h3>Accessibility from All Rail Stations</h3>',
          description: '<p>This shows the number of destinations reachable via rail from each zone for passengers that can use all rail stations. The results are mapped by TAZ. The darker the blue, the more destinations are reachable from that TAZ.</p>'
        },
        currentAccessibility:{
          title: '<h3>Accessible Destinations using Only Wheelchair Accessible Stations</h3>',
          description: '<p>The next map shows the destinations reachable when you can only use wheelchair accessible stations. So same thing here – the darker the blue, the more destinations are reachable via rail. However, you can see that not only is there a lot less dark blue, there is a lot less blue overall- meaning that there when you can’t use inaccessible stations, there are a lot of destinations you cannot reach via rail.</p>'
        },
        currentDisparity:{
          title: '<h3>Destination Disparity for Wheelchair users in Comparison with All Users</h3>',
          description: '<p>This map highlights the differences between the baseline and the wheelchair accessible map. The darker the orange, the larger the gap in reachable destinations for wheelchair users. So the darkest places are those where wheelchair users lose out on the most destinations due to inaccessible stations and where improvements should be focused.</p>'
        },
        futureAccessibility:{
          title: '<h3>Destinations Accessible using Accessible Stations or Those with Programmed Improvements</h3>',
          description: '<p>We know that there are a number of stations that are programmed for wheelchair accessibility improvements or have improvements in progress. So this map considers those. This one includes stations that are currently accessible and those that are programmed for improvement. Again, the darker the blue, the more destinations are reachable via rail from that zone.</p>'
        },
        futureDisparity:{
          title: '<h3>Destination Disparity using Accessible Stations or Those with Programmed Improvements</h3>',
          description: '<p>And this maps shows where the gaps remain – in the darkest orange. So these are the places that we would want to focus on for the next batch of wheelchair accessibility improvements.</p>'
        }
      }
    }
    this.render()
  }

  render(){
    let page = BuildPage(this.props)
    

  }
}

export { Accessibility }
