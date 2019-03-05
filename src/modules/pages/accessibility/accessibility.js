import '../../../css/pages/accessibility/accessibility.css'
import { styles } from '../map/map_styles/accessibility.js'
import { Legend } from './legend';
import { CreateDvrpcNavControl } from '../../../utils/defaultExtentControl';
import { headerRender } from "../../header/header";
import { HeaderElements } from "../../header/HeaderElements";
import { Footer } from "../../footer/footer";


/*
  LoadStations(map)
  @description:
    Load station geometries from AGO and station data from RTPS DB
  @param:
    - map: Mapbox GL element to add layer to
*/
const LoadStations = map =>{
  
  // hit AGO endpoint and load geometries
  fetch('https://opendata.arcgis.com/datasets/68b970bf65bc411c8a7f8f7b0bb7908d_0.geojson')
  
  // parse json return if fetch is successful
  .then(ago=>{ if (ago.status == 200){ return ago.json() } })
  .then(agoStations=>{
    
    // hit RTPS API to load stations table from DB
    fetch('https://a.michaelruane.com/api/rtps/access?stations')
    
    // parse json if fetch is successful
    .then(dbReturn=>{ if (dbReturn.status == 200) { return dbReturn.json() } })
    .then(dbStations=>{
      
      // define fields to keep from AGO endpoint
        // TODO: change endpoint, more robust query to only grab necessary fields
      let keep = ['DVRPC_ID', 'STATION', 'accessibility']
      
      // append DB data to geometry
      agoStations.features.forEach(feature=>{
        if (dbStations[feature.properties.DVRPC_ID]){
          feature.properties.accessibility = dbStations[feature.properties.DVRPC_ID].accessible
        }
        
        // delete unneeded fields
        for (let prop in feature.properties){
          keep.indexOf(prop) == -1 ? delete feature.properties[`${prop}`] : null
        }
      })
      
      // add source to map
      map.addSource('stations', { type: 'geojson', data: agoStations })

      // base definition for station layer
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
      
      // add layer
      map.addLayer(layerDef, 'transit-railLabels')
    })
  })
}

/*
  LoadTAZ(map)
  @description:
    1. Load TAZ geometries from AGO and station data data from RTPS DB
    2. Add layer to map
  @param:
    - map: Mapbox GL element to add layer to
*/
const LoadTAZ = map =>{

  // hit AGO endpoint for TAZ geometries
  fetch('https://services1.arcgis.com/LWtWv6q6BJyKidj8/arcgis/rest/services/TAZ/FeatureServer/0/query?where=1%3D1&outFields=TAZN&geometryPrecision=4&outSR=4326&returnExceededLimitFeatures=true&f=pgeojson')
  
  // parse AGO return if successful
  .then(ago=>{ if (ago.status ==200){return ago.json() } })
  .then(agoZones=>{
    
    // hit RTPS API endpoint for TAZ data
    fetch('https://a.michaelruane.com/api/rtps/access?zones')
   
    // parse DB return if successful
    .then(dbReturn=>{if (dbReturn.status == 200) { return dbReturn.json() } })
    .then(dbZones=>{
      
      // join DB data to geometries
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
      
      // add source to map
      map.addSource('zones', {type: 'geojson', data: agoZones })
     
      // base definition for TAZ layer
      let layerDef = {
        "id": 'zones-analysis',
        "type": 'fill',
        "source": 'zones',
        "paint" : {
          "fill-color": "rgba(255,255,255,0)",
          "fill-opacity": .9
        },
      }
      
      // add layer to map
      map.addLayer(layerDef, 'base-muniOutline')
    })
  })
}

/*
  LoadLayers(map, styles)
  @description:
    Create basemap using predefined static map layers
  @param:
    - map: Mapbox GL element to add layers to
    - styles: Stylesheet containing layer definitions for each basemap layer
*/
const LoadLayers = (map, styles) =>{
  // iterate through sources
  for (let source in styles){

    // add source
    map.addSource(source, styles[source].sourceDef)

    // iterate through each layer in source
    for (let layer in styles[source].layers){

      // local reference
      let thisLayer = styles[source].layers[layer]

      // create layer definition object
      let layerDef = {
        "id": `${source}-${layer}`,
        "type": thisLayer.type,
        "source": source,
        "paint": thisLayer.paint
      }

      // apply appropriate properties
      !thisLayer.filter ? null : layerDef['filter'] = thisLayer.filter
      !thisLayer.layout ? null : layerDef['layout'] = thisLayer.layout
      !thisLayer.minzoom ? null : layerDef['minzoom'] = thisLayer.minzoom;
      styles[source].sourceDef.type != 'vector' ? null : layerDef['source-layer'] = thisLayer.source
      
      // add layer
      map.addLayer(layerDef, thisLayer.placement)
    }
  }
}

/*
  StationPopup(marker, map)
  @description:
    Create a popup for the feature that is interacted with and add to map
  @param:
    marker: data pertaining to the popup
      lat, long, properties
    map: Mapbox GL element to add popup to
  @return:
    popup object to add to map
*/
const StationPopUp = (marker, map) =>{
  
  // base popup definition
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

  // coordinates to anchor popup
  let coords = new mapboxgl.LngLat(marker.long, marker.lat)
  
  // set dynamic popup properties
  popup
    .setLngLat(coords)
    .setHTML(`${marker.props.STATION} Station`)
    .addTo(map)
  return popup
}

/*
  BuildMap(container, props)
  @description:
    Build Mapbox GL element 
  @param:
    container: HTML element that will contain the map canvas
    props: Accessibility Page properties
      page, map, content
        - used to set map property of module
  @return:
    map: Mapbox GL Element

*/
const BuildMap = (container, props) =>{

  // base extent 
  const extent = {
    center: [-75.247, 40.066],
    zoom: 8.4
  }
  mapboxgl.accessToken = 'pk.eyJ1IjoiYmVhdHR5cmUxIiwiYSI6ImNqOGFpY3o0cTAzcXoycXE4ZTg3d3g5ZGUifQ.VHOvVoTgZ5cRko0NanhtwA';

  // base map properties
  let map = new mapboxgl.Map({
    container: container,
    style: 'mapbox://styles/beattyre1/cjky7crbr17og2rldo6g7w5al',
    center: extent.center,
    zoom: extent.zoom,
    minZoom: 8
  })

  // needs function scope so it can be altered & destroyed
  let popup;

  // actions to run on map initiation
  map.on('load', _ => {

      // make sure it fills HTML element
      map.resize();

      // load basemap
      LoadLayers(map, styles)
      
      // Load TAZ layer
      LoadTAZ(map)

      // Load Stations layer
      LoadStations(map)

      // center on base extent
      map.flyTo({
        center: extent.center,
        zoom: extent.zoom
      })

      // add navigation control
        //@TODO: add home button from DVRPC's reusable components library
      CreateDvrpcNavControl(extent, map)
  })

  // add map action to create popups on station hover
  map.on('mouseenter', 'station-access', e=>{

    // change mouse pointer style
    map.getCanvas().style.cursor = "pointer"

    // create object to pass to StationPopup function
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

    // create popup
    popup = StationPopUp(marker, map)

    // set color depending on station accessibility
    document.querySelector('.mapboxgl-popup-content').style.backgroundColor = color
  })

  // reset after mouse leaves station feature
  map.on('mouseleave', 'station-access', e=>{
    map.getCanvas().style.cursor = ""
    popup.remove()    
  })

  return map

}

/*
  BuildPage(content)
  @description:
    Render whole accessibility page
  @param:
    - content: page data to use in rendering
*/
const BuildPage = content =>{

  /*
    ResymbolizeLayers()
    @description:
      Main functionality of scrolling is to set the appropriate map content
  */
  const ResymbolizeLayers = data =>{
    // local reference for map data
    let map = content.map

    // if there is map actions tied to this element, do them
    if (data) {
      map.setPaintProperty('zones-analysis', 'fill-color', data.paint)
      map.setPaintProperty('station-access', 'circle-color', data.stationPaint)
    }

    // if not, reset to default map
    else{
      map.setPaintProperty('zones-analysis', 'fill-color', 'rgba(0,0,0,0)')
      map.setPaintProperty('station-access', 'circle-color', ['match', ['get', 'accessibility'], 0, '#e89234', 1, '#8bb23f', 2, '#08506d', '#aaa'])
    }
    if(document.getElementById('caseStudy').classList.contains('active')){
      let extent = {
        center: [-75.064, 39.914],
        zoom: 13
      },
        map = content.map
        
      map.flyTo({
        center: extent.center,
        zoom: extent.zoom
      })
    }
  }

  /*
    BuildScene(element)
    @description:
      Create ScrollMagic scene and add to ScrollMagic Controller to handle functions when scrolling through content
    @param:
      - element: element to tie functions to
  */
  const BuildScene = element =>{

    // define ScrollMagic Scene
    new ScrollMagic.Scene({
      // element to trigger functions on
      triggerElement: element,
      // set scrolling duration
      duration: element.getBoundingClientRect().height + 100,
      offset: 50
    })
      .on('enter', e=>{
        // set active classes to section and corresponding dot navigation element
        let link = document.querySelector(`a[href='#${element.id}'`),
          data = content.props.sections[element.id].content.map
        
        link.classList.add('active')
        element.classList.add('active')

        // resymbolize layers
        ResymbolizeLayers(data)
      })

      // reset to default state
      .on('leave', e=>{ 
        let link = document.querySelector(`a[href='#${element.id}'`)
        link.classList.remove('active')
        element.classList.remove('active') 
      })

      // add to ScrollMagic Controller
      .addTo(content.scroll)
  }

  const ChangeCaseStudyContent = data =>{
    let container = document.getElementById('caseStudy'),
      subtitle = container.querySelector('h3'),
      text = container.querySelector('p')
      
    subtitle.innerText = data.title
    text.innerText = data.text

    new Legend(data)
    ResymbolizeLayers(data.map)
  }

  // accessibility content data
  let props = content.props,
    // content HTML container
    sectionBody = document.createElement('div')

  sectionBody.classList.add('accessibility__text-body')

  // add to page
  document.querySelector('.accessibility-text').appendChild(sectionBody)


  // build map
  content.map = BuildMap(document.querySelector(".accessibility-map"), content.props)

  // build section for each

  // i will be used to populate the dot nav
  let i = 1

  // create content for each section in component data
  for (let section in props.sections){
    // local content ref
    let data = props.sections[section]

    if (data.content.text){
      let content = data.content
      // HTML jawns
      let container = document.createElement('section'),
      text = document.createElement('p'),
      link = document.createElement('a'),
      linkContent = document.createElement('div'),
      tooltip = document.createElement('span')
  
      /* Create Dot Navigation Element*/
      
      // link
      link.href = `#${content.text.id}`
      link.rel = 'noopener'
      
      // section #
      linkContent.innerText = i
      linkContent.classList.add('accessibility__nav-link')
      
      // tooltip
      tooltip.classList.add('accessibility__nav-tooltip')
      tooltip.innerText = data.title != 'Overview' ? `${data.title.main}: ${data.title.scenario}` : data.title

      // send 'em
      linkContent.appendChild(tooltip)
      link.appendChild(linkContent)
      document.getElementById('accessibility-nav').appendChild(link)
  
      // housekeeping for section container
      container.classList.add('accessibility-section')
      container.id = content.text.id

      if (container.id != 'intro'){
        // title element
        let main = document.createElement('h1'),
          title = document.createElement('div'),
          scenario = document.createElement('h2'),
          sub = document.createElement('h3')
          
        title.classList.add('accessibility__titleDivider')
        
        main.innerText = data.title.main
        scenario.innerText = data.title.scenario
        sub.innerText =  data.title.sub

        title.appendChild(document.createElement('hr'))
        title.appendChild(scenario)
        title.appendChild(document.createElement('hr'))
    
        // send it
        container.appendChild(main)
        container.appendChild(title)
        container.appendChild(sub)
      }
      else{
        let title = document.createElement('h1')
        title.innerText = data.title
        container.appendChild(title)
      }
          
    
      // set text
      text.innerHTML = content.text.description
      container.appendChild(text)

  
      // send the whole thing
      sectionBody.appendChild(container)
      
      // if there is a map portion to the section (aka not overview), create the corresponding legend
      if (content.map) new Legend(content)
  
      // Build ScrollMagic Scene
      BuildScene(container)
    }
    else{
      let content = props.sections[section],
        container = document.createElement('section'),
        title = document.createElement('h1'),
        subtitle = document.createElement('h3'),
        text = document.createElement('p'),
        link = document.createElement('a'),
        linkContent = document.createElement('div'),
        tooltip = document.createElement('span'),
        tabNav = document.createElement('nav'),
        legend = document.createElement('div')

      // create dot nav
      link.href = `#${content.content.id}`
      link.rel = 'noopener'

      // section #
      linkContent.classList.add('accessibility__nav-link')
      linkContent.innerText = i

      // tooltip
      tooltip.classList.add('accessibility__nav-tooltip')
      tooltip.innerText = content.title

      // send 'em 
      linkContent.appendChild(tooltip)
      link.appendChild(linkContent)
      document.getElementById('accessibility-nav').appendChild(link)
      
      // housekeeping
      container.classList.add('accessibility-section')
      container.id = content.content.id
      text.id = `${content.content.id}-p`
      legend.id ='caseStudy-legend'
      
      title.innerText = content.title
      text.innerText = content.content[0]


      container.appendChild(title)
      container.appendChild(tabNav)
      container.appendChild(subtitle)
      container.appendChild(text)
      container.appendChild(legend)
      sectionBody.appendChild(container)


      BuildScene(container)


      for (let section in content.content){
        if (section != 0 && section != 'id'){
          let data = content.content[section],
            tab = document.createElement('a')
          
            tab.innerText = section

            tab.addEventListener('click', e =>{
              let links = document.querySelectorAll('#caseStudy a')
              for (let link of links){
                if (link == e.target) e.target.classList.add('active')
                else link.classList.remove('active')
              }
              ChangeCaseStudyContent(data) 
            })

            tabNav.appendChild(tab)

        }
      }


    }
    
    i++
  }
}

export class Accessibility{
  constructor(){

    // the important stuff -- reference for all content
    this.props = {
      container: document.querySelector('main'),
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
          title: {
            main: 'Non-Wheelchair Users',
            scenario: 'Existing',
            sub: 'Destinations Currently Reachable by Non-Wheelchair Users'
          },
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
          title: {
            main: 'Wheelchair Users',
            scenario: 'Existing',
            sub: 'Destinations Currently Reachable by Wheelchair Users'
          },
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
          title: {
            main: 'Difference',
            scenario: 'Existing',
            sub: 'Current Destination Disparity for Wheelchair Users in Comparison with Non-Wheelchair Users'
          },
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
          title: {
            main: 'Wheelchair Users',
            scenario: 'Future',
            sub: 'Destinations Reachable in the Future by Wheelchair Users'
          },
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
          title: {
            main: 'Difference',
            scenario: 'Future',
            sub: 'Remaining Future Destination Disparity for Wheelchair Users in Comparison with Non-wheelchair Users (Programmed Improvements Included)'
          },
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
              stationPaint: ['match', ['get', 'accessibility'], 1, '#8bb23f', 2, '#08506d', '#aaa'],
              legend:{
                stations: [[0, '#aaa'], [1, '#8bb23f'], [2, '#08506d']],
                zones: {
                  header: 'Destination Disparity for Wheelchair Users',
                  labels: ['Less', 'More'],
                  colors: ['#fed98e', '#fe9929', '#d95f0e', '#993404']
                }
              }
            }
          }
        },
        caseStudy: {
          title: 'Case Study: Collingswood',
          content: {
            id: 'caseStudy',
            0: 'This case study shows how to interpret the maps using Collingswood Station on the PATCO line as an example',
            1: {
              title: 'Destinations Reachable by Non-Wheelchair Users',
              text: 'The dark blue surrounding the Collingswood Station shows that non-wheelchair users can reach a large number of destinations',
              map: {
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
            },
            2: {
              title: 'Destinations Reachable by Wheelchair Users',
              text: 'The lack of color surrounding the Collingswood station shows that wheelchair users would not be able to reach any destinations via rail from that station. This is because the station is currently not wheelchair accessible',
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
            },
            3: {
              title: 'Current Destination Disparity for Wheelchair Users Compared to Non-Wheelchair Users',
              text: 'The dark orange surrounding the Collingswood station highlights the difference between maps 1 and 2, showing that wheelchair users are able to reach far fewer destinations than non-wheelchair users from this station.',
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
            4: {
              title: 'Destinations Reachable in the Future by Wheelchair Users',
              text: 'Wheelchair accessibility improvements are currently under construction at the Collingswood station. Therefore, this map accounting for programmed improvements shows darker blue surrounding the station. Wheelchair users are now able to reach many destinations via rail from Collingswood.',
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
            },
            5: {
              title: 'Remaining Future Destination Disparity for Wheelchair Users in Comparison with Non-Wheelchair Users (Programmed Improvements Included)',
              text: 'The light orange surrounding the Collingswood station shows the difference between map 1 and map 4. With the wheelchair accessibility improvement at the station, wheelchair users are now able to reach a similar amount of destinations as non-wheelchair users. Remaining differences would be due to wheelchair inaccessible stations on the destination end.',
              map: { 
                paint: [
                  'interpolate', ['linear'], ['get', 'DisFut'],
                  1, 'rgba(0,0,0,0.01)',
                  2, '#fed98e',
                  5, '#fe9929',
                  8, '#d95f0e',
                  12, '#993404',
                ],
                stationPaint: ['match', ['get', 'accessibility'], 1, '#8bb23f', 2, '#08506d', '#aaa'],
                legend:{
                  stations: [[0, '#aaa'], [1, '#8bb23f'], [2, '#08506d']],
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
    }

    // render
    this.render()
  }

  render(){
    if (!document.querySelector('header')) headerRender(HeaderElements)
    let main = document.querySelector('main')
    main.id = 'accessibility'
    if (!document.querySelector('footer')) new Footer();

    // build base skeleton for page
    let page = document.createElement('div'),
      map = document.createElement('div'),
      sidebar = document.createElement('aside'),
      nav = document.createElement('nav')
  

    // housekeeping
    page.classList.add('accessibility-page')
    map.classList.add('accessibility-map')
    sidebar.classList.add('accessibility-text')
    nav.id = 'accessibility-nav'

    // send 'em
    page.appendChild(nav)
    page.appendChild(map)
    page.appendChild(sidebar)
    this.props.container.appendChild(page)

    // initiate the scroll
    this.scroll = new ScrollMagic.Controller({
      container: this.props.container,
      loglevel: 4
    })

    // populate the page with content
    BuildPage(this)

  }
}