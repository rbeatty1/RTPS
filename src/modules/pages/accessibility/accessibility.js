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
    fetch('https://alpha.dvrpc.org/api/rtps/access?stations')
    
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
    fetch('https://alpha.dvrpc.org/api/rtps/access?zones')
   
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
  let stationName = marker.props.STATION
  let length = stationName.length
  const minusStation = length - 7

  // check if the db has a redundant 'Station' string and remove it if so. This is not a good solution, but it's a solution
  let station = stationName.substring(minusStation, length) != 'Station' ? stationName : stationName.slice(0, minusStation)
  
  // set dynamic popup properties
  popup
    .setLngLat(coords)
    .setHTML(`${station} Station`)
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
// putting mobileZoom in the global scope of this file so that buildScene can have access to device information without having to recalculate it. This should be a class property, but the functions aren't class methods so what's the point.
let mobileZoom;

const BuildMap = container =>{
  // adjust zoom level on mobile
  const windowWidth = window.innerWidth
  if(windowWidth <= 420) mobileZoom = 7.3

  // base extent 
  const extent = {
    center: [-75.247, 40.066],
    zoom: mobileZoom || 8.4
  }

  mapboxgl.accessToken = 'pk.eyJ1IjoiYmVhdHR5cmUxIiwiYSI6ImNqOGFpY3o0cTAzcXoycXE4ZTg3d3g5ZGUifQ.VHOvVoTgZ5cRko0NanhtwA';

  // base map properties
  let map = new mapboxgl.Map({
    container: container,
    style: 'mapbox://styles/beattyre1/cjky7crbr17og2rldo6g7w5al',
    center: extent.center,
    zoom: extent.zoom,
    minZoom: mobileZoom ? null : 8
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
      map.setPaintProperty('station-access', 'circle-color', ['match', ['get', 'accessibility'], 0, '#e89234', 1, '#8bb23f', 2, '#08506d', '#ccc'])
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

    // use the calculated check for mobile to adjust the scrollMagic offset parameters
    const offset = mobileZoom ? -80 : 110

    // define ScrollMagic Scene
    new ScrollMagic.Scene({
      // element to trigger functions on
      triggerElement: element,
      // set scrolling duration
      duration: element.getBoundingClientRect().height + 100,
      offset
    })
      .on("enter", e=>{
        console.log('calling on enter')
        // set active classes to section and corresponding dot navigation element
        let link = document.querySelector(`#${element.id}-link`).children[0],
          data = content.props.sections[element.id].content.map
        
        link.classList.add('active')
        element.classList.add('active')

        // resymbolize layers
        ResymbolizeLayers(data)
      })

      // reset to default state
      .on("leave", e=>{ 
        console.log('calling on leave')
        let link = document.querySelector(`#${element.id}-link`).children[0]
        link.classList.remove('active')
        element.classList.remove('active') 
      })

      // add to ScrollMagic Controller
      .addTo(content.scroll)
  }

  const setCaseStudyDefault = (text, p) => {
    p.innerText = text

    // query selector for multiple instances of the same jawn will return the first instance
    const defaultTab = document.querySelector('#caseStudy a')
    defaultTab.classList.add('active')
  }

  const ChangeCaseStudyContent = (data, legend) =>{
    const container = document.getElementById('caseStudy')

    let subtitle = container.querySelector('h3'),
      text = container.querySelector('p')
      
      // only create legend & resymbolize layers if on tab > 1 (aka is object w/data not just a string)
    if(data.text) {
        subtitle.innerText = data.title
        text.innerText = data.text
        new Legend(data)
        ResymbolizeLayers(data.map)
    
    // remove legend & subtitle if going to the first tab
    }else {
      legend.innerText = ''
      subtitle.innerText = ''
      text.innerText = data
    }
  }

  // handle sidelink story map interaction (abstracted to a helper function because links 1-6 and case study (7) are defined in different places)
  const clickSideLink = (nav, sectionContent, link, caseStudy) => {

    // toggle active class + remove any existing active classes
    const allLinks = nav.children
    const navLength = allLinks.length

    for(var i = 0; i < navLength; i++) {
      const linkDiv = allLinks[i].children[0]
      allLinks[i] === link ? linkDiv.classList.add('active') : linkDiv.classList.remove('active')
    }

    // scroll magic is configured weird for this component and the scrollTo method used in frequency doesn't work so we're going old school here
    // id of the section (handle the case study interaction which is built differently)
    const sectionId = caseStudy ? sectionContent : sectionContent.text.id
    const section = document.getElementById(sectionId)
    const textContainer = document.querySelector('.accessibility-text')

    // depending on mobile or desktop, get the offset + a buffer to scroll to
    let offsetAdjustment = mobileZoom ? 365 : 110
    const offsetTop = section.offsetTop - offsetAdjustment

    // do the scroll
    textContainer.scrollTo({
      top: offsetTop,
      left: 0,
      behavior: 'smooth'
    })
  }

  // accessibility content data
  let props = content.props,

  sectionBody = document.querySelector('.accessibility-text')

  // build map
  content.map = BuildMap(document.querySelector(".accessibility-map"), content.props)
  
  // i will be used to populate the dot nav
  let i = 1

  // nav was limited to the scope of (if(data.content.text) so link 7 couldnt access it. Move it here so that it can)
  let nav = document.getElementById('accessibility-nav')
  
  // create content for each section in component data
  for (let section in props.sections){
    // local content ref
    let data = props.sections[section]

    if (data.content.text){
      let sectionContent = data.content

      // HTML jawns
      let container = document.createElement('section'),
      link = document.createElement('a'),
      linkContent = document.createElement('div'),
      tooltip = document.createElement('span')
  
      /* Create Dot Navigation Element*/
      
      // link
      link.id = `${sectionContent.text.id}-link`

      // trigger scroll actions with side nav links
      link.onclick = () => clickSideLink(nav, sectionContent, link)
      
      // section #
      linkContent.innerText = i
      linkContent.classList.add('accessibility__nav-link')
      
      // tooltip
      tooltip.classList.add('accessibility__nav-tooltip')
      tooltip.innerText = data.title != 'Overview' ? `${data.title.main}: ${data.title.scenario}` : data.title

      // send 'em
      linkContent.appendChild(tooltip)
      link.appendChild(linkContent)
      nav.appendChild(link)
  
      // housekeeping for section container
      container.classList.add('accessibility-section')
      container.id = sectionContent.text.id

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
        let title = document.createElement('div'),
          main = document.createElement('h1')

        title.classList.add('accessibility__titleDivider')
        main.innerText = data.title
        
        title.appendChild(document.createElement('hr'))
        title.appendChild(main)
        title.appendChild(document.createElement('hr'))
        container.appendChild(title)
      }
          
    
      // set text
      container.insertAdjacentHTML('beforeend', sectionContent.text.description)

  
      // send the whole thing
      sectionBody.appendChild(container)
      
      new Legend(sectionContent)
  
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
        legend = document.createElement('div'),
        // grab the id for clickSideLink to get a handle of the parent container
        sectionContent = content.content.id

      // create dot nav
      link.id = 'caseStudy-link'
      link.rel = 'noopener'

      // trigger scroll actions with side nav links
      link.onclick = () => clickSideLink(nav, sectionContent, link, true)

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
                if(link === e.target) link.classList.add('active')
                else link.classList.remove('active')
              }
              ChangeCaseStudyContent(data, legend)
            })

            tabNav.appendChild(tab)
        }
      }

      // set default after tabs are created
      setCaseStudyDefault(content.content[1], text)
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
              description: `<p><strong>Where can station accessibility improvements have the greatest impact for wheelchair users and persons with mobility assistance needs?</strong></p>
              <p>This analysis identifies essential services (jobs, grocery stores, medical offices, etc) that can be reached via transit where wheelchair users and
              persons with mobility impairments are most impacted by wheelchair inaccessible rail stations. These maps can be used to help prioritize rail station improvements.</p>
              <p>This analysis considers programmed accessibility improvements such as adding an elevator. The lists of programmed improvements was obtained from transit agencies
              in 2018.</p>`
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
              stationPaint: ['match', ['get', 'accessibility'], 0, '#e89234', 1, '#8bb23f', 2, '#08506d', '#ccc'],
              legend:{
                stations: [[0, '#e89234'], [1, '#8bb23f'], [2, '#08506d']]
              }

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
              description: `<p>This map serves as the baseline. It shows the number of destinations reachable via rail from each zone for passengers that do not need mobility
              assistance. The darker the color, the more essential service destinations are reachable from that <abbr title="Traffic Analysis Zone">TAZ</abbr> via rail.</p>`
            },
            map:{
              paint: [
                'interpolate', ['linear'], ['get', 'AccAll'],
                1, 'rgba(0,0,0,0.01)',
                2, '#cbc9e2',
                5, '#9e9ac8',
                7, '#756bb1',
                10, '#54278f'
              ],
              stationPaint: ['match', ['get', 'accessibility'], 0, '#e89234', 1, '#8bb23f', 2, '#08506d', '#ccc'],
              legend:{
                stations: [[0, '#e89234'], [1, '#8bb23f'], [2, '#08506d']],
                zones: {
                  header : 'Reachable Destinations',
                  labels: ['Few', 'Many'],
                  colors: ['#cbc9e2', '#9e9ac8', '#756bb1', '#54278f']
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
              description: `<p>This map shows the destinations reachable by wheelchair users and persons who can only use wheelchair accessible stations. The darker the color,
              the more essential service destinations are reachable from that <abbr title="Traffic Analysis Zone">TAZ</abbr> via rail.</p>`
            },
            map: {
              paint: [
                'interpolate', ['linear'], ['get', 'AccCur'],
                1, 'rgba(0,0,0,0.01)',
                2, '#cbc9e2',
                5, '#9e9ac8',
                7, '#756bb1',
                10, '#54278f'
              ],
              stationPaint: ['match', ['get', 'accessibility'], 0, '#ccc', 1, '#8bb23f', 2, '#666', '#666'],
              legend:{
                stations: [[0, '#ccc'], [1, '#8bb23f'], [2, '#666']],
                zones: {
                  header : 'Reachable Destinations',
                  labels: ['Few', 'Many'],
                  colors: ['#cbc9e2', '#9e9ac8', '#756bb1', '#54278f']
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
              description: `<p>This map highlights the differences between the baseline map (2) and the wheelchair accessible map (3). The darker the color, the greater the disparity 
              for wheelchair users and persons with mobility impairments in comparison with all users.</p>`
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
              stationPaint: ['match', ['get', 'accessibility'], 0, '#ccc', 1, '#8bb23f', 2, '#666', '#ccc'],
              legend: {
                stations: [[0, '#ccc'], [1, '#8bb23f'], [2, '#666']],
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
              description: `<p>This map considers which stations are programmed for wheelchair accessibility and mobility assistance improvements or have improvements in progress. Again, the darker the color, the more essential service destinations are reachable via rail from that zone.</p>`
            },
            map: {
              paint: [
                'interpolate', ['linear'], ['get', 'AccFut'],
                1, 'rgba(0,0,0,0.01)',
                2, '#cbc9e2',
                5, '#9e9ac8',
                7, '#756bb1',
                10, '#54278f'
              ],
              stationPaint: ['match', ['get', 'accessibility'], 1, '#8bb23f', 2, '#08506d', 0, '#ccc', '#666'],
              legend:{
                stations: [[0, '#ccc'], [1, '#8bb23f'], [2, '#08506d']],
                zones: {
                  header : 'Reachable Destinations',
                  labels: ['Few', 'Many'],
                  colors: ['#cbc9e2', '#9e9ac8', '#756bb1', '#54278f']
                }
              }
            }
          }
        },
        DisFut:{
          title: {
            main: 'Difference',
            scenario: 'Future',
            sub: 'Remaining Destination Disparity for Wheelchair Users in Comparison with Non-wheelchair Users (including programmed improvements)'
          },
          content: {
            text: {
              id: 'DisFut',
              description: `<p>This map compares the previous map (5) to the baseline map (2). It shows where the disparity remains after the programmed improvements
              are completed. These are the places that could be the focus of future improvements at rail stations.</p>`
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
              stationPaint: ['match', ['get', 'accessibility'], 1, '#8bb23f', 2, '#08506d', '#ccc'],
              legend:{
                stations: [[0, '#ccc'], [1, '#8bb23f'], [2, '#08506d']],
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
            1: 'At the time of this analysis, an elevator was under construction at the Collingswood station, scheduled to open in Spring 2019. This case study shows how to interpret the maps using Collingswood Station on the PATCO line as an example. Click the numbers above to cycle through the maps of the area.',
            2: {
              title: 'Destinations Reachable by Non-Wheelchair Users',
              text: 'The dark purple surrounding the Collingswood Station shows that non-wheelchair users can reach a large number of destinations',
              map: {
                paint: [
                  'interpolate', ['linear'], ['get', 'AccAll'],
                  1, 'rgba(0,0,0,0.01)',
                  2, '#cbc9e2',
                  5, '#9e9ac8',
                  7, '#756bb1',
                  10, '#54278f'
                ],
                stationPaint: ['match', ['get', 'accessibility'], 0, '#e89234', 1, '#8bb23f', 2, '#08506d', '#ccc'],
                legend:{
                  stations: [[0, '#e89234'], [1, '#8bb23f'], [2, '#08506d']],
                  zones: {
                    header : 'Reachable Destinations',
                    labels: ['Few', 'Many'],
                    colors: ['#cbc9e2', '#9e9ac8', '#756bb1', '#54278f']
                  }
                }  
              }
            },
            3: {
              title: 'Destinations Reachable by Wheelchair Users',
              text: 'The lack of color surrounding the Collingswood station shows that wheelchair users would not be able to reach any destinations via rail from that station. This is because the station is currently not wheelchair accessible.',
              map: {
                paint: [
                  'interpolate', ['linear'], ['get', 'AccCur'],
                  1, 'rgba(0,0,0,0.01)',
                  2, '#cbc9e2',
                  5, '#9e9ac8',
                  7, '#756bb1',
                  10, '#54278f'
                ],
                stationPaint: ['match', ['get', 'accessibility'], 0, '#ccc', 1, '#8bb23f', 2, '#666', '#666'],
                legend:{
                  stations: [[0, '#ccc'], [1, '#8bb23f'], [2, '#666']],
                  zones: {
                    header : 'Reachable Destinations',
                    labels: ['Few', 'Many'],
                    colors: ['#cbc9e2', '#9e9ac8', '#756bb1', '#54278f']
                  }
                }
              }
            },
            4: {
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
                stationPaint: ['match', ['get', 'accessibility'], 0, '#ccc', 1, '#8bb23f', 2, '#666', '#ccc'],
                legend: {
                  stations: [[0, '#ccc'], [1, '#8bb23f'], [2, '#666']],
                  zones:{
                    header: 'Destination Disparity for Wheelchair Users',
                    labels: ['Less', 'More'],
                    colors: ['#fed98e', '#fe9929', '#d95f0e', '#933404']
                  }
                }
              } 
            },
            5: {
              title: 'Destinations Reachable in the Future by Wheelchair Users',
              text: 'Wheelchair accessibility improvements are currently under construction at the Collingswood station. Therefore, this map accounting for programmed improvements shows darker purple surrounding the station. Wheelchair users are now able to reach many destinations via rail from Collingswood.',
              map: {
                paint: [
                  'interpolate', ['linear'], ['get', 'AccFut'],
                  1, 'rgba(0,0,0,0.01)',
                  2, '#cbc9e2',
                  5, '#9e9ac8',
                  7, '#756bb1',
                  10, '#54278f'
                ],
                stationPaint: ['match', ['get', 'accessibility'], 1, '#8bb23f', 2, '#08506d', 0, '#ccc', '#666'],
                legend:{
                  stations: [[0, '#ccc'], [1, '#8bb23f'], [2, '#08506d']],
                  zones: {
                    header : 'Reachable Destinations',
                    labels: ['Few', 'Many'],
                    colors: ['#cbc9e2', '#9e9ac8', '#756bb1', '#54278f']
                  }
                }
              }
            },
            6: {
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
                stationPaint: ['match', ['get', 'accessibility'], 1, '#8bb23f', 2, '#08506d', '#ccc'],
                legend:{
                  stations: [[0, '#ccc'], [1, '#8bb23f'], [2, '#08506d']],
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

    // // add the footer after everything else gets added
    const footer = new Footer().footer
    sidebar.appendChild(footer)
  }
}