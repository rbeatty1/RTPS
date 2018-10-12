import '../../../css/pages/accessibility/accessibility.css'
import { styles } from '../map/map_styles/accessibility.js'
const LoadTAZ = map =>{
  fetch('https://services1.arcgis.com/LWtWv6q6BJyKidj8/arcgis/rest/services/TAZ/FeatureServer/0/query?where=1%3D1&outFields=TAZN&geometryPrecision=4&outSR=4326&returnExceededLimitFeatures=true&f=pgeojson&token=Z76xHp8Mxopz3qqagK3yrINFseFH0zNHs3ka-WddCJhC2ZQuMeiZUPcwJW_GMgKuQVMZ61z7RCHHC7NcYNFufRt8LR8uXxqg_EqqWwKtt3x1KiV9TH9h0WVMHpXZ0uNmrTACOzx0pAPfpBgCSp6l3NuOW8sADy2cfl0JKC3xWXU1hpgj8TpvxNiXreO156y8MwCkvp57jUb22NSjJZm66nT2q9sCbKQtq6qrW6ASgtkyEj901vkgL47O5UcrkFeAxaZQkez5A7J5JaJJS6c0mA..')
.then(response=>{
    if (response.status ==200){
      return response.json()
    }
  })
  .then(jawn=>{
    let clone = jawn
    let layers = ['AccAll', 'AccCur', 'AccFut', 'DisCur', 'DisFut']
    clone.features.forEach(feature=>{
      feature.properties.AccAll = Math.floor((Math.random()*10))
      feature.properties.AccCur = Math.floor((Math.random()*10))
      feature.properties.AccFut = Math.floor((Math.random()*10))
      feature.properties.DisCur = Math.floor((Math.random()*10))
      feature.properties.DisFut = Math.floor((Math.random()*10))
    })
    map.addSource('zones', {type: 'geojson', data: clone })
    layers.forEach(layer=>{
      console.log(layer)
      let layerDef = {
        "id": 'zones-'+layer,
        "type": 'fill',
        "source": 'zones',
        "layout": {
          "visibility": 'none'
        },
        "paint" : {
          "fill-color": [
            'interpolate', ['linear'], ['get', layer],
            0, "#e2e2e2",
            7, "#a6bddb",
            8, "#3690c0",
            9, "#045a8d",
            10, "#023858"
          ],
          "fill-opacity": .6
        },
      }
      map.addLayer(layerDef, 'base-muniOutline')
    })
    })
}
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
      map.addLayer(layerDef, thisLayer.placement)
    }
  }
}
const BuildMap = (container, props) =>{
  mapboxgl.accessToken = 'pk.eyJ1IjoiYmVhdHR5cmUxIiwiYSI6ImNqOGFpY3o0cTAzcXoycXE4ZTg3d3g5ZGUifQ.VHOvVoTgZ5cRko0NanhtwA';
  let map = new mapboxgl.Map({
    container: container,
    style: 'mapbox://styles/beattyre1/cjky7crbr17og2rldo6g7w5al',
    center: [-75.224, 40.066],
    zoom: 8.4,
    minZoom: 8,
    hash: true
  })
  map.on('load', _ => {
      map.resize();
      LoadLayers(map, styles)
      LoadTAZ(map)
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')
  })
  return map

}

const BuildPage = props =>{
  props.container.innerHTML = ''
  let page = document.createElement('div')
  page.classList.add('accessibility-page')
  let map = document.createElement('div')
  let text = document.createElement('div')
  map.classList.add('accessibility-map')
  text.classList.add('accessibility-text')
  page.appendChild(text)
  page.appendChild(map)
  let thisMap = BuildMap(map, props)
  
  props.container.appendChild(page)
  for (let section in props.sections){
    let thisSection = props.sections[section]
    let container = document.createElement('div')
    let header = document.createElement('div')
    let content = document.createElement('div')
    container.classList.add('accessibility-section')
    header.classList.add('accessibility-section-header')
    content.classList.add('accessibility-section-content')
    header.innerText = thisSection.title
    content.innerHTML = thisSection.description
    header.id = thisSection.id

    header.addEventListener('click', e=>{
      let content = e.target.nextElementSibling
      !content.classList.contains('active') ? content.classList.add('active') : content.classList.remove('active')
      thisMap.getLayoutProperty(`zones-${e.target.id}`, 'visibility') == 'none' ? thisMap.setLayoutProperty(`zones-${e.target.id}`, 'visibility', 'visible') : null
    })
    container.appendChild(header)
    container.appendChild(content)
    text.appendChild(container)
  }
}

class Accessibility{
  constructor(){
    let layers = ['AccAll', 'AccCur', 'AccFut', 'DisCur', 'DisFut']
    this.props = {
      container: document.querySelector('#main'),
      sections: {
        allAccessibility: {
          id: 'AccAll',
          title: 'Accessibility from All Rail Stations',
          description: '<p>This shows the number of destinations reachable via rail from each zone for passengers that can use all rail stations. The results are mapped by TAZ. The darker the blue, the more destinations are reachable from that TAZ.</p>'
        },
        currentAccessibility:{
          id: 'AccCur',
          title: 'Accessible Destinations using Only Wheelchair Accessible Stations',
          description: '<p>The next map shows the destinations reachable when you can only use wheelchair accessible stations. So same thing here – the darker the blue, the more destinations are reachable via rail. However, you can see that not only is there a lot less dark blue, there is a lot less blue overall- meaning that there when you can’t use inaccessible stations, there are a lot of destinations you cannot reach via rail.</p>'
        },
        currentDisparity:{
          id: 'DisCur',
          title: 'Destination Disparity for Wheelchair users in Comparison with All Users',
          description: '<p>This map highlights the differences between the baseline and the wheelchair accessible map. The darker the orange, the larger the gap in reachable destinations for wheelchair users. So the darkest places are those where wheelchair users lose out on the most destinations due to inaccessible stations and where improvements should be focused.</p>'
        },
        futureAccessibility:{
          id: 'AccFut',
          title: 'Destinations Accessible using Accessible Stations or Those with Programmed Improvements',
          description: '<p>We know that there are a number of stations that are programmed for wheelchair accessibility improvements or have improvements in progress. So this map considers those. This one includes stations that are currently accessible and those that are programmed for improvement. Again, the darker the blue, the more destinations are reachable via rail from that zone.</p>'
        },
        futureDisparity:{
          id: 'DisFut',
          title: 'Destination Disparity using Accessible Stations or Those with Programmed Improvements',
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
