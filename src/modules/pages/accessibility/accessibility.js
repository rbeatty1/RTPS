import '../../../css/pages/accessibility/accessibility.css'
import { styles } from '../map/map_styles/accessibility.js'
import { Legend } from './legend';

const zoneRef = {
  AccAll: {
    paint: [
      'interpolate', ['linear'], ['get', 'AccAll'],
      1, 'rgba(0,0,0,0.01)',
      2, '#a6bddb',
      5, '#3690c0',
      7, '#045a8d',
      10, '#023858'
    ],
    stationPaint: ['match', ['get', 'accessibility'], 0, '#e89234', 1, '#8bb23f', 2, '#08506d', '#aaa'],
  },
  AccCur: {
    paint: [
      'interpolate', ['linear'], ['get', 'AccCur'],
      1, 'rgba(0,0,0,0.01)',
      2, '#a6bddb',
      5, '#3690c0',
      7, '#045a8d',
      10, '#023858'
    ],
    stationPaint: ['match', ['get', 'accessibility'], 0, '#999', 1, '#8bb23f', 2, '#666', '#333'],
  },
  AccFut: {
    paint: [
      'interpolate', ['linear'], ['get', 'AccFut'],
      1, 'rgba(0,0,0,0.01)',
      2, '#a6bddb',
      5, '#3690c0',
      7, '#045a8d',
      10, '#023858'
    ],
    stationPaint: ['match', ['get', 'accessibility'], 1, '#8bb23f', 2, '#08506d', 0, '#999', '#333'],
  },
  DisCur: {
    paint: [
      'interpolate', ['linear'], ['get', 'DisCur'],
      1, 'rgba(0,0,0,0.01)',
      2, '#fed98e',
      5, '#fe9929',
      8, '#d95f0e',
      12, '#993404',
    ],
    stationPaint: ['match', ['get', 'accessibility'], 0, '#aaa', 1, '#8bb23f', 2, '#666', '#aaa'],
  },
  DisFut: {
    paint: [
      'interpolate', ['linear'], ['get', 'DisFut'],
      1, 'rgba(0,0,0,0.01)',
      2, '#fed98e',
      5, '#fe9929',
      8, '#d95f0e',
      12, '#993404',
    ],
    stationPaint: ['match', ['get', 'accessibility'], 1, '#8bb23f', 2, '#08506d', 0, '#999', '#333'],
  }
}
const LoadStations = map =>{
  fetch('https://opendata.arcgis.com/datasets/68b970bf65bc411c8a7f8f7b0bb7908d_0.geojson')
  .then(ago=>{
    if (ago.status == 200){ return ago.json() }
  })
  .then(agoStations=>{
    fetch('https://a.michaelruane.com/api/rtps/access?stations')
    .then(dbReturn=>{
      if (dbReturn.status == 200) { return dbReturn.json() }
    })
    .then(dbStations=>{
      let keep = ['DVRPC_ID', 'STATION', 'accessibility']
      agoStations.features.forEach(feature=>{
        if (dbStations[feature.properties.DVRPC_ID]){
          feature.properties.accessibility = dbStations[feature.properties.DVRPC_ID].accessible
        }
        for (let prop in feature.properties){
          keep.indexOf(prop) == -1 ? delete feature.properties[`${prop}`] : null
        }
      })
      map.addSource('stations', { type: 'geojson', data: agoStations })
      let layerDef = {
        "id": 'station-access',
        "type": 'circle',
        'source': 'stations',
        'paint': {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              7, 1,
              12, 6
            ],
          'circle-color':[
            'interpolate', ['linear'], ['get', 'accessibility'],
            0, '#e89234',
            1, '#8bb23f',
            2, '#08506d'
          ],
          'circle-stroke-color': '#fff',
          'circle-stroke-width': [
            'interpolate', ['linear'], ['zoom'],
            7, .1,
            12, 1.5
          ]
        }
      }
      map.addLayer(layerDef, 'transit-railLabels')
    })
  })
}

const LoadTAZ = map =>{
  fetch('https://services1.arcgis.com/LWtWv6q6BJyKidj8/arcgis/rest/services/TAZ/FeatureServer/0/query?where=1%3D1&outFields=TAZN&geometryPrecision=4&outSR=4326&returnExceededLimitFeatures=true&f=pgeojson')
  .then(ago=>{
      if (ago.status ==200){
        return ago.json()
      }
    })
  .then(agoZones=>{
    fetch('https://a.michaelruane.com/api/rtps/access?zones')
    .then(dbReturn=>{
      if (dbReturn.status == 200) { return dbReturn.json() }
    })
    .then(dbZones=>{
      agoZones.features.map(feature=>{
        if (dbZones[feature.properties.TAZN]){
          feature.properties.AccAll = dbZones[feature.properties.TAZN].all_rail
          feature.properties.AccCur = dbZones[feature.properties.TAZN].current
          feature.properties.AccFut = dbZones[feature.properties.TAZN].future
          feature.properties.DisCur = dbZones[feature.properties.TAZN].discur
          feature.properties.DisFut = dbZones[feature.properties.TAZN].disfut
        }
        else{
          feature.properties.AccAll = 0
          feature.properties.AccCur = 0
          feature.properties.AccFut = 0
          feature.properties.DisCur = 0
          feature.properties.DisFut = 0
        }
      })
      map.addSource('zones', {type: 'geojson', data: agoZones })
      let layerDef = {
        "id": 'zones-analysis',
        "type": 'fill',
        "source": 'zones',
        "paint" : {
          "fill-color": "rgba(255,255,255,0)",
          "fill-opacity": .9
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
      !thisLayer.minzoom ? null : layerDef['minzoom'] = thisLayer.minzoom;
      styles[source].sourceDef.type != 'vector' ? null : layerDef['source-layer'] = thisLayer.source
      map.addLayer(layerDef, thisLayer.placement)
    }
  }
}
const StationPopUp = (marker, map) =>{
  let popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    anchor: 'left',
    offset: {
      'top': [0, 0],
      'top-left': [0,0],
      'top-right': [0,0],
      'bottom': [0, 0],
      'bottom-left': [0, 0],
      'bottom-right': [0, 0],
      'left': [0, 0],
      'right': [0, 0]
    },
  })
  let coords = new mapboxgl.LngLat(marker.long, marker.lat)
  popup
    .setLngLat(coords)
    .setHTML(`${marker.props.STATION} Station`)
    .addTo(map)
  return popup
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
    minZoom: 8
  })
  let popup;
  map.on('load', _ => {
      map.resize();
      LoadLayers(map, styles)
      LoadTAZ(map)
      LoadStations(map)
      map.flyTo({
        center: extent.center,
        zoom: extent.zoom
      })
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')
  })
  map.on('mouseenter', 'station-access', e=>{
    map.getCanvas().style.cursor = "pointer"
    const marker = { props: e.features[0].properties, long: e.features[0].geometry.coordinates[0], lat: e.features[0].geometry.coordinates[1]}
    let color;
    // pop up to reflect level of accessibility
    switch(marker.props.accessibility){
      case 0:
        color = 'rgba(232,146,52,.85)'
        break;
      case 1: 
        color = 'rgba(139,178,63,.85)'  
        break;
      case 2:
        color = 'rgba(8,80,109,.85)'  
        break;
      default:
      color = '#aaa'
      break;
    };
    popup = StationPopUp(marker, map)
    document.querySelector('.mapboxgl-popup-content').style.backgroundColor = color
  })
  map.on('mouseleave', 'station-access', e=>{
    map.getCanvas().style.cursor = ""
    popup.remove()    
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
    let container = document.createElement('section')
    container.classList.add('accessibility-section')
    container.innerHTML = `
      <h1 class="accessibility-section-header" id="${thisSection.id}">${thisSection.title}</h1>
      <p class="accessibility-section-content inactive">${thisSection.description}</p>
    `

    sectionBody.appendChild(container)

    // click functions
    document.querySelector(`#${thisSection.id}`).addEventListener('click', e=>{
      let sections = document.querySelectorAll('.accessibility-section-header'), // content section names
        legendPoints = document.querySelectorAll('.station-icon') // station legend icons

      // display zone legend
      let legend = document.querySelector('#zones')
      legend.style.display != 'block' ? legend.style.display = 'block' : null
      let legends = legend.querySelectorAll('.accessibility__legend-zoneBox')

      // switch zone legend content depending on opened map
        // having HTML snippets in a reference object?
      let colors = []
      zoneRef[e.target.id].paint.forEach(item=>{
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
          let content = section.nextElementSibling,
            referenceData = zoneRef[e.target.id]
          
          // activate
          content.classList.toggle('active')
          section.classList.toggle('active')

          // set map colors accordingly
          thisMap.setPaintProperty('zones-analysis', "fill-color", referenceData.paint)
          thisMap.setPaintProperty('station-access', 'circle-color', referenceData.stationPaint)

          // set all stations in legend to grey
          for (let node of legendPoints){ node.style.backgroundColor = "#aaa"}
          
          // set the color for correct station icons in legend
          referenceData.stationPaint.map((value, index)=>{
            let iconCheck = document.querySelector(`.station-icon[data-value="${value}`)
            if (iconCheck) iconCheck.style.backgroundColor = referenceData.stationPaint[index+1]
          })
        }

        // deactivate
        else if (section.nextElementSibling.classList.contains('active')){
          section.nextElementSibling.classList.remove('active')
          section.classList.contains('active') ? section.classList.remove('active') : null
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
          title: 'Destinations Reachable Using All Rail Stations',
          description: 'This map serves as the baseline. It shows the number of destinations reachable via rail from each zone for passengers that can use all rail stations. The darker the color, the more destinations are reachable from that <abbr class="accessibility__abbr" title="Traffic Analysis Zone">TAZ</abbr> via rail.'
        },
        currentAccessibility:{
          id: 'AccCur',
          title: 'Destinations Reachable Using Only Wheelchair Accessible Rail Stations',
          description: 'This map shows the destinations reachable by wheelchair users who can only use wheelchair accessible stations. The darker the color, the more destinations are reachable from that <abbr class="accessibility__abbr" title="Traffic Analysis Zone">TAZ</abbr> via rail.'
        },
        currentDisparity:{
          id: 'DisCur',
          title: 'Destination Disparity For Wheelchair Users in Comparison With All Users',
          description: 'This map highlights the differences between the baseline and wheelchair accessible map. The darker the color, the greater the disparity for wheelchair users in comparison with all users.'
        },
        futureAccessibility:{
          id: 'AccFut',
          title: 'Destinations Reachable Using Stations Currently Wheelchair Accessible or Programmed For Improvement',
          description: 'This map considers which stations are programmed for wheelchair accessibility improvements or have improvements in progress. It includes stations that are currently accessible and those that are programmed for improvement. Again, the darker the color, the more destinations are reachable via rail from that zone.'
        },
        futureDisparity:{
          id: 'DisFut',
          title: 'Destination Disparity For Wheelchair Users in Comparison With All Users (Programmed Improvements Included)',
          description: 'This map compares the previous map to the baseline map. It shows where the disparity remains. These are the places that should be the focus of the next batch of wheelchair accessibility improvements at rail stations.'
        }
      }
    }
    this.render()
  }

  render(){
    this.props.container.innerHTML = `
    <div class="accessibility-page">
      <div class="accessibility-map"></div>
      <aside class="accessibility-text">
        <section class="accessibility-intro">
          <h1>Introduction</h1>
          <p>
          This analysis identifies places where wheelchair users' ability to reach essential services (jobs, grocery stores, medical offices, etc.)
           via transit is most impacted by inaccessible rail stations. The goal was to prioritize station improvements, not to determine whether or
            not the mobility impaired can access a stop. Therefore, the assumption was made that wheelchair users can get to and from rail stations. 
            Since buses in the <abbr class="accessibility_abbr" title="Delaware Valley Regional Planning Commission">DVRPC</abbr> region are generally 
            accessible, they were excluded.
          </p>
        </section>
      </aside>
      </div>
  `
    BuildPage(this.props)
    new Legend(this.props);
    

  }
}

export { Accessibility }
