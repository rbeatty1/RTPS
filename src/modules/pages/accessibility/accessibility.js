import '../../../css/pages/accessibility/accessibility.css'
import { styles } from '../map/map_styles/accessibility.js'
import { Legend } from './legend';
import { PageHeader } from '../header/pageHeader.js'

const zoneRef = {
  AccAll: [
    'interpolate', ['linear'], ['get', 'AccAll'],
    0, '#e2e2e2',
    7, '#a6bddb',
    8, '#3690c0',
    9, '#045a8d',
    10, '#023858'
  ],
  AccCur: [
    'interpolate', ['linear'], ['get', 'AccCur'],
    0, '#e2e2e2',
    7, '#a6bddb',
    8, '#3690c0',
    9, '#045a8d',
    10, '#023858'
  ],
  AccFut: [
    'interpolate', ['linear'], ['get', 'AccFut'],
    0, '#e2e2e2',
    7, '#a6bddb',
    8, '#3690c0',
    9, '#045a8d',
    10, '#023858'
  ],
  DisCur: [
    'interpolate', ['linear'], ['get', 'DisCur'],
    0, '#e2e2e2',
    7, '#fed98e',
    8, '#fe9929',
    9, '#d95f0e',
    10, '#993404'
  ],
  DisFut: [
    'interpolate', ['linear'], ['get', 'DisFut'],
    0, '#e2e2e2',
    7, '#fed98e',
    8, '#fe9929',
    9, '#d95f0e',
    10, '#993404'
  ],
}

const LoadTAZ = map =>{
  fetch('https://services1.arcgis.com/LWtWv6q6BJyKidj8/arcgis/rest/services/TAZ/FeatureServer/0/query?where=1%3D1&outFields=TAZN&geometryPrecision=4&outSR=4326&returnExceededLimitFeatures=true&f=pgeojson&token=Z76xHp8Mxopz3qqagK3yrINFseFH0zNHs3ka-WddCJhC2ZQuMeiZUPcwJW_GMgKuQVMZ61z7RCHHC7NcYNFufRt8LR8uXxqg_EqqWwKtt3x1KiV9TH9h0WVMHpXZ0uNmrTACOzx0pAPfpBgCSp6l3NuOW8sADy2cfl0JKC3xWXU1hpgj8TpvxNiXreO156y8MwCkvp57jUb22NSjJZm66nT2q9sCbKQtq6qrW6ASgtkyEj901vkgL47O5UcrkFeAxaZQkez5A7J5JaJJS6c0mA..')
.then(response=>{
    if (response.status ==200){
      return response.json()
    }
  })
  .then(jawn=>{
    jawn.features.forEach(feature=>{
      feature.properties.AccAll = Math.floor((Math.random()*10))
      feature.properties.AccCur = Math.floor((Math.random()*10))
      feature.properties.AccFut = Math.floor((Math.random()*10))
      feature.properties.DisCur = Math.floor((Math.random()*10))
      feature.properties.DisFut = Math.floor((Math.random()*10))
    })
    map.addSource('zones', {type: 'geojson', data: jawn })
    let layerDef = {
      "id": 'zones-analysis',
      "type": 'fill',
      "source": 'zones',
      "paint" : {
        "fill-color": "rgba(255,255,255,0)",
        "fill-opacity": .6
      },
    }
    map.addLayer(layerDef, 'base-muniOutline')
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
      !thisLayer.minzoom ? null : layerDef['minzoom'] = thisLayer.minzoom;
      styles[source].sourceDef.type != 'vector' ? null : layerDef['source-layer'] = thisLayer.source
      map.addLayer(layerDef, thisLayer.placement)
    }
  }
}
const BuildMap = (container, props) =>{
  const extent = {
    center: [-75.247, 40.066],
    zoom: 8.4
  }
  mapboxgl.accessToken = 'pk.eyJ1IjoiYmVhdHR5cmUxIiwiYSI6ImNqOGFpY3o0cTAzcXoycXE4ZTg3d3g5ZGUifQ.VHOvVoTgZ5cRko0NanhtwA';
  let map = new mapboxgl.Map({
    container: container,
    style: 'mapbox://styles/beattyre1/cjky7crbr17og2rldo6g7w5al',
    center: extent.center,
    zoom: extent.zoom,
    minZoom: 8,
    hash: true
  })
  map.on('load', _ => {
      map.resize();
      LoadLayers(map, styles)
      LoadTAZ(map)
      map.zoomTo({
        center: extent.center,
        zoom: extent.zoom
      })
      /* load TAZ Data from DB
        two tables
          1. TAZ --> row for each zone, fields for each map. Any other data needed?
          2. Station --> row for each zone, accessibility designation, name, operator
          data = {
            taz: {
              <TAZN_1>: {
                accAll: num,
                accCur: num,
                accFut: num,
                disCur: num,
                disFut: num,
                {any other data i.e pop-ups?}
              },
              <TAZN_2>: {
                accAll: num,
                accCur: num,
                accFut: num,
                disCur: num,
                disFut: num,
                {any other data i.e pop-ups?}
              },
              etc...
            },
            stations: {
              <STATION_1>: {
                accessibility: <yes|no|programmed>,
                name: text,
                operator: text,
                {any other data}
              },
              <STATION_2>: {
                accessibility: <yes|no|programmed>,
                name: text,
                operator: text,
                {any other data}
              },
              etc

              }

            }
          }
      */
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')
  })
  props.map = map
  return map

}

const BuildPage = props =>{
  let thisMap = BuildMap(document.querySelector(".accessibility-map"), props)
  let sectionBody = document.createElement('div')
  sectionBody.classList.add('accessibility__text-body')
  document.querySelector('.accessibility-text').appendChild(sectionBody)
  // build section for each
  for (let section in props.sections){
    let thisSection = props.sections[section]
    let container = document.createElement('div')
    container.classList.add('accessibility-section')
    container.innerHTML = `
      <div class="accessibility-section-header" id="${thisSection.id}">${thisSection.title}</div>
      <div class="accessibility-section-content inactive">${thisSection.description}</div>
    `

    sectionBody.appendChild(container)

    // click functions
    document.querySelector(`#${thisSection.id}`).addEventListener('click', e=>{
      let sections = document.querySelectorAll('.accessibility-section-header')

      // display zone legend
      let legend = document.querySelector('#zones')
      legend.style.display != 'block' ? legend.style.display = 'block' : null
      let legends = legend.querySelectorAll('.accessibility__legend-zoneBox')

      // switch zone legend content depending on opened map
        // having HTML snippets in a reference object?
      let colors = []
      zoneRef[e.target.id].forEach(item=>{
        item[0] != '#' ? null : colors.push(item)
      })
      for (let i = 0; i < legends.length; i++){
        legends[i].style.backgroundColor = colors[i]
      }
      let boxes = document.querySelectorAll('.legend__row-label')
      if (e.target.id[0] == 'A'){
        document.querySelector(".legend-descriptor").innerText = 'Number of Reachable Destinations'
        boxes[0].innerText = 'Few'
        boxes[1].innerText = 'Many'
      }
      else{
        document.querySelector(".legend-descriptor").innerText = 'Destination Disparity for Wheelchair Users'
        boxes[0].innerText = 'Less'
        boxes[1].innerText = 'More'
      }
      for (let section of sections){
        if (section.id == e.target.id){
          let content = section.nextElementSibling
          content.classList.toggle('active')
          thisMap.setPaintProperty('zones-analysis', "fill-color", zoneRef[e.target.id])
        }
        else if (section.nextElementSibling.classList.contains('active')){
          section.nextElementSibling.classList.remove('active')
        }
      }
    })
  }
}

class Accessibility{
  constructor(){
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
    this.props.container.innerHTML = `
    <div class="accessibility-page">
      <div class="accessibility-text"></div>
      <div class="accessibility-map"></div>
      </div>
  `
    new PageHeader('Accessibility')
    BuildPage(this.props)
    new Legend(this.props);
    

  }
}

export { Accessibility }
