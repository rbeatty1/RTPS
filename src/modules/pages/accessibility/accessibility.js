import '../../../css/pages/accessibility/accessibility.css'
import { styles } from '../map/map_styles/accessibility.js'
import { Legend } from './legend';

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
const BuildPage = content =>{

  const BuildScene = element =>{

    const ResymbolizeLayers = () =>{
      let data = content.props.sections[element.id].content.map,
        map = content.map
      if (data) {
        map.setPaintProperty('zones-analysis', 'fill-color', data.paint)
        map.setPaintProperty('station-access', 'circle-color', data.stationPaint)
      }
      else{
        map.setPaintProperty('zones-analysis', 'fill-color', 'rgba(0,0,0,0)')
        map.setPaintProperty('station-access', 'circle-color', "['match', ['get', 'accessibility'], 0, '#e89234', 1, '#8bb23f', 2, '#08506d', '#aaa']")

      }
    }

    new ScrollMagic.Scene({
      triggerElement: element,
      duration: element.getBoundingClientRect().height + 100,
      offset: 50
    })
      .on('enter', e=>{
        let link = document.querySelector(`a[href='#${element.id}'`)
        link.classList.add('active')
        element.classList.add('active')
        ResymbolizeLayers()
      })
      .on('leave', e=>{ 
        let link = document.querySelector(`a[href='#${element.id}'`)
        link.classList.remove('active')
        element.classList.remove('active') 
      })
      .addTo(content.scroll)
  }

  let props = content.props,
    sectionBody = document.createElement('div')
  sectionBody.classList.add('accessibility__text-body')
  document.querySelector('.accessibility-text').appendChild(sectionBody)
  
  content.map = BuildMap(document.querySelector(".accessibility-map"), content.props)
  // build section for each
  let i = 1
  for (let section in props.sections){
    let content = props.sections[section].content,
      container = document.createElement('section'),
      title = document.createElement('h1'),
      text = document.createElement('p'),
      link = document.createElement('a')

    link.href = `#${content.text.id}`
    link.rel = 'noopener'
    link.innerHTML = i
    document.getElementById('accessibility-nav').appendChild(link)
    container.classList.add('accessibility-section')
    container.id = content.text.id

    title.innerText = props.sections[section].title
    text.innerHTML = content.text.description

    container.appendChild(title)
    container.appendChild(text)

    
    sectionBody.appendChild(container)
    
    if (content.map) new Legend(content)
    BuildScene(container)
    i++
  }
}

export class Accessibility{
  constructor(){
    this.props = {
      container: document.querySelector('#main'),
      sections: {
        intro:{
          title: 'Overview',
          content: {
            text: {
              id: 'intro',
              description: 'This analysis identifies places where wheelchair users\' ability to reach essential services (jobs, grocery stores, medical offices, etc) via transit is most impacted by wheelchair inaccessible rail stations. These maps can be used to help prioritize rail station improvements.'
            }
          }
        },
        AccAll: {
          title: 'Destinations Currently Reachable by Non-Wheelchair Users',
          content:{
            text:{
              id: 'AccAll',
              description: 'This map serves as the baseline. It shows the number of destinations reachable via rail from each zone for passengers that can use all rail stations. The darker the color, the more destinations are reachable from that <abbr class="accessibility__abbr" title="Traffic Analysis Zone">TAZ</abbr> via rail.'
            },
            map:{
              paint: [
                'interpolate', ['linear'], ['get', 'AccAll'],
                1, 'rgba(0,0,0,0.01)',
                2, '#a6bddb',
                5, '#3690c0',
                7, '#045a8d',
                10, '#023858'
              ],
              stationPaint: ['match', ['get', 'accessibility'], 0, '#e89234', 1, '#8bb23f', 2, '#08506d', '#aaa'],
              legend:{
                stations: [[0, '#e89234'], [1, '#8bb23f'], [2, '#08506d']],
                zones: {
                  header : 'Reachable Destinations',
                  labels: ['Few', 'Many'],
                  colors: ['#a6bddb', '#3690c0', '#045a8d', '#023858']
                }
              }

            }
          }

        },
        AccCur:{
          title: 'Destinations Currently Reachable by Wheelchair Users',
          content: {
            text: {
              id: 'AccCur',
              description: 'This map shows the destinations reachable by wheelchair users who can only use wheelchair accessible stations. The darker the color, the more destinations are reachable from that <abbr class="accessibility__abbr" title="Traffic Analysis Zone">TAZ</abbr> via rail.'
            },
            map: {
              paint: [
                'interpolate', ['linear'], ['get', 'AccCur'],
                1, 'rgba(0,0,0,0.01)',
                2, '#a6bddb',
                5, '#3690c0',
                7, '#045a8d',
                10, '#023858'
              ],
              stationPaint: ['match', ['get', 'accessibility'], 0, '#999', 1, '#8bb23f', 2, '#666', '#333'],
              legend:{
                stations: [[0, '#999'], [1, '#8bb23f'], [2, '#666']],
                zones: {
                  header : 'Reachable Destinations',
                  labels: ['Few', 'Many'],
                  colors: ['#a6bddb', '#3690c0', '#045a8d', '#023858']
                }
              }
            }
          }
        },
        DisCur:{
          title: 'Current Destination Disparity for Wheelchair Users in Comparison with Non-Wheelchair Users',
          content: {
            text: {
              id: 'DisCur',
              description: 'This map highlights the differences between the baseline map (1) and wheelchair accessible map (2). The darker the color, the greater the disparity for wheelchair users in comparison with all users.'
            },
            map: {
              paint: [
                'interpolate', ['linear'], ['get', 'DisCur'],
                1, 'rgba(0,0,0,0.01)',
                2, '#fed98e',
                5, '#fe9929',
                8, '#d95f0e',
                12, '#993404',
              ],
              stationPaint: ['match', ['get', 'accessibility'], 0, '#aaa', 1, '#8bb23f', 2, '#666', '#aaa'],
              legend: {
                stations: [[0, '#aaa'], [1, '#8bb23f'], [2, '#666']],
                zones:{
                  header: 'Destination Disparity for Wheelchair Users',
                  labels: ['Less', 'More'],
                  colors: ['#fed98e', '#fe9929', '#d95f0e', '#933404']
                }
              }
            } 
          },
        },
        AccFut:{
          title: 'Destinations Reachable in the Future by Wheelchair Users',
          content: {
            text: {
              id: 'AccFut',
              description: 'This map considers which stations are programmed for wheelchair accessibility improvements or have improvements in progress. It includes stations that are currently accessible and those that are programmed for improvement. Again, the darker the color, the more destinations are reachable via rail from that zone.'
            },
            map: {
              paint: [
                'interpolate', ['linear'], ['get', 'AccFut'],
                1, 'rgba(0,0,0,0.01)',
                2, '#a6bddb',
                5, '#3690c0',
                7, '#045a8d',
                10, '#023858'
              ],
              stationPaint: ['match', ['get', 'accessibility'], 1, '#8bb23f', 2, '#08506d', 0, '#999', '#333'],
              legend:{
                stations: [[0, '#999'], [1, '#8bb23f'], [2, '#08506d']],
                zones: {
                  header : 'Reachable Destinations',
                  labels: ['Few', 'Many'],
                  colors: ['#a6bddb', '#3690c0', '#045a8d', '#023858']
                }
              }
            }
          }
        },
        DisFut:{
          title: 'Remaining Future Destination Disparity for Wheelchair Users in Comparison with Non-Wheelchair Users (Programmed Improvements Included)',
          content: {
            text: {
              id: 'DisFut',
              description: 'This map compares the previous map (4) to the baseline map (1). It shows where the disparity remains. These are the places that should be the focus of the next batch of wheelchair accessibility improvements at rail stations.'
            },
            map: {
              paint: [
                'interpolate', ['linear'], ['get', 'DisFut'],
                1, 'rgba(0,0,0,0.01)',
                2, '#fed98e',
                5, '#fe9929',
                8, '#d95f0e',
                12, '#993404',
              ],
              stationPaint: ['match', ['get', 'accessibility'], 1, '#8bb23f', 2, '#08506d', 0, '#999', '#333'],
              legend: {
                stations: [[0, '#999'], [1, '#8bb23f'], [2, '#08506d']],
                zones: {
                  header: 'Destination Disparity for Wheelchair Users',
                  labels: ['Less', 'More'],
                  colors: ['#fed98e', '#fe9929', '#d95f0e', '#993404']
                }
              }
            }
          }
        }
      }
    }
    this.render()
  }

  render(){

    let page = document.createElement('div'),
      map = document.createElement('div'),
      sidebar = document.createElement('aside'),
      nav = document.createElement('nav')
    
    page.classList.add('accessibility-page')
    map.classList.add('accessibility-map')
    sidebar.classList.add('accessibility-text')
    nav.id = 'accessibility-nav'

    page.appendChild(nav)
    page.appendChild(map)
    page.appendChild(sidebar)
    this.props.container.appendChild(page)

    this.scroll = new ScrollMagic.Controller({
      container: this.props.container,
      loglevel: 4
    })

    BuildPage(this)
    

  }
}