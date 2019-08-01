import '../../../css/pages/reliability/reliability.css'
import {LoadLayers} from '../../../utils/loadMapLayers';
import { styles } from '../map/map_styles/reliability.js'
import { FormatNumber } from '../../../utils/formatNumber';
import { CreateDvrpcNavControl } from '../../../utils/defaultExtentControl';
import { Footer } from "../../footer/footer";
import { makeFilter, populateDatalist } from './makeFilter.js';

let layerRef = {
  purpose: "The goal of the surface transit reliability analysis was to identify corridors where surface transit service is particularly slow or delayed as places where road or transit improvements could increase reliability.",
  inputs:{
    speed: {
      title: "Average Scheduled Speed",
      info: "The average scheduled speed for bus routes that use a road segment was calcluated using the distance between stop points and the scheduled time for each stop point as provided in the General Transit Feed Specification <abbr class='reliability__abbr' title='General Transit Feed Specification'>(GTFS)</abbr>. If multiple bus routes use a road segment, a weighted average was calculated to ensure that the buses using the segment most throughout the day were considered more heavily."
    },
    otp:{
      title: "On Time Performance (OTP)",
      info: "<abbr class='reliability__abbr' title='On Time Performance'>OTP</abbr> represents the percent of time the bus route is considered on time. A trip is considered on time when it arrives between 0 and 6 minutes after the scheduled time. Low <abbr class='reliability__abbr' title='On Time Performance'>OTP</abbr> is indicative of reliability issues."
    },
    tti: {
      title: "Travel Time Index (TTI)",
      info: "<abbr class='reliability__abbr' title='Travel Time Index'>TTI</abbr> is the ratio of peak hour travel time to free flow travel time. The <abbr class='reliability__abbr' title='Travel Time Index'>TTI</abbr> used in this analysis accounts for all vehicle types, not just transit vehicles. High <abbr class='reliability__abbr' title='Travel Time Index'>TTI</abbr> indicates congestion which negatively impacts surface transit reliability. <abbr class='reliability__abbr' title='Travel Time Index'>TTI</abbr> was available from INRIX on many roads throughout the region. An estimate of <abbr class='reliability__abbr' title='Travel Time Index'>TTI</abbr> from the regional travel model was used to fill gaps in the INRIX data."
    },
    septa: {
      title: "SEPTA Surface Transit Loads (2017)",
      info: "2017 daily average ridership for SEPTA bus routes was available at the stop level. General Transit Feed Specification <abbr class='reliability__abbr' title='General Transit Feed Specification'>(GTFS)</abbr> was used to convert stop-level ridership to segment-level passenger loads."
    },
    njt: {
      title: "NJ TRANSIT Ridership (2016)",
      info: "2016-2017 daily average ridership for <abbr class='reliability__abbr' title='New Jersey'>NJ</abbr> Transit bus routes was provided at the stop level."
    }
  },
  outputs:{
    score: "The input layers were combined to calculate the overall measure of reliability. The <span class='reliability__sidebar-emphasis'>Reliability Score</span> layer shows the results of combining <abbr class='reliability__abbr' title='Travel Time Index'>TTI</abbr>, <abbr class='reliability__abbr' title='On Time Performance'>OTP</abbr>, and scheduled speed. A high reliability score is indicative of segments that may benefit from targeted improvements to transit operations.",
    weight: "The results were then weighted by ridership (<span class='reliability__sidebar-emphasis'>Ridership Weighted Reliability Score</span>) to highlight segments that impact high ridership surface transit service an allow for further prioritization of improvements."
  },
  sources: {
    main: {
      title: 'Reliability Data',
      info: '<a href="https://drive.google.com/drive/folders/1aXwLVweE9xqqZgYIgT6ZC3XREJRwgfHB?usp=sharing" target="blank"> View and download reliability data</a>.'
    }
  }
}


/*
  BuildPage(structure)
  @purpose: Build the map and sidebar HTML elements
  @params
    structure: component state that outlines what those elements are
*/
const BuildPage = structure =>{
  // build container for entire page
  let page = document.createElement('div')
  page.id = 'reliability__page'

  // create HTML element for each defined page section. 
  for (let section in structure){
    let sectionElem = section == 'sidebar' ? document.createElement('aside') : document.createElement('div')
    sectionElem.id = 'reliability__'+section
    // append element to page
    page.appendChild(sectionElem)
    // update state to include element
    structure[section] = sectionElem
  }
  // append page to application
  document.querySelector('main').appendChild(page)
}

/*
  BuildMap(pageContent)
  @purpose: Build mapbox-gl element and populate with map layers
  @params:
    pageContent: component state
*/
const BuildMap = pageContent =>{

  /*
    BuildPopUps(layers)
    @purpose: Build listener events to handle popup creation
    @params: 
      layers: collection of layers from mapbox-gl stylesheet 
  */
  const BuildPopUps = layers =>{
    /*
      BuildPopUpContent(layer, props)
      @purpose: Build popup for clicked layer
      @params:
        layer: layer that was clicked
        props: properties that will drive content creation of clicked layer
    */
    const BuildPopUpContent = (layer, props) =>{

      // set variables
      let colorRef = styles.reliability.layers[layer].paint['line-color'],
        field = colorRef[1][1],
        data = props[field],
        container = document.createElement('div'),
        title = document.createElement('h3'),
        property = document.createElement('p'),
        dataContent = document.createElement('p')

      // set classes for popup content
      container.classList.add('reliability__popup-container')
      property.classList.add('reliability__popup-field')
      dataContent.classList.add('reliability__popup-data')

      // grammar (reliability score layers have multiple routes, other layers do not)
      let route;
      if(props.lines && layer === 'score' || layer === 'weighted') {
        const lines = props.lines.split(',').join(', ')
        route = `Routes ${lines}`
      }else{
        route = `Route ${props.linename}`
      }
      title.innerText = route
      
      switch(layer){
        case 'score':
          property.innerText = 'Reliabilty Score'
          break;
        case 'weighted':
          property.innerText = 'Ridership Weighted Reliability Score';
          break;
        default:
          property.innerText = layerRef.inputs[layer].title
          break;
      }
      dataContent.innerText = data

      container.appendChild(title)
      container.appendChild(property)
      container.appendChild(dataContent)

      return container.outerHTML
    }

    // set events for all layers
    for (let l in layers){
      map.on('mouseover', `reliability-${l}`, e=>map.getCanvas().style.cursor = 'pointer')
      map.on('mouseleave', `reliability-${l}`, e=>map.getCanvas().style.cursor = '')
      map.on('click', `reliability-${l}`, e=>{
        let props = e.features[0].properties
        let content = BuildPopUpContent(l, props)
        let offsets = {
          top: [0, 0],
          "top-left": [0, 0],
          "top-right": [0, 0],
          bottom: [0, 0],
          "bottom-left": [0, 0],
          "bottom-right": [0, 0],
          left: [0, 0],
          right: [0, 0]
        };
        new mapboxgl.Popup({
          offset: offsets,
        })
          .setLngLat(e.lngLat)
          .setHTML(content)
          .addTo(map)
      })
    }
  }

  // adjust zoom level on mobile
  let mobileZoom;
  const windowWidth = window.innerWidth
  if(windowWidth <= 420) mobileZoom = 7.3

  let extent = {
    center: [-75.234, 40.061],
    zoom: mobileZoom || 8.4
  }
  mapboxgl.accessToken = 'pk.eyJ1IjoiYmVhdHR5cmUxIiwiYSI6ImNqOGFpY3o0cTAzcXoycXE4ZTg3d3g5ZGUifQ.VHOvVoTgZ5cRko0NanhtwA';
  let map = new mapboxgl.Map({
      container: pageContent.content.map,
      style: 'mapbox://styles/mapbox/light-v9',
      center: extent.center,
      zoom: extent.zoom
  })

  // load initial state of map
  map.on('load', ()=> {
    // fill canvas
    map.resize()
    // center map on DVRPC region
    map.flyTo({
      center: extent.center,
      zoom: extent.zoom
    })

    CreateDvrpcNavControl(extent, map)
    let layers = styles.reliability.layers

    // load map layers
    LoadLayers(map, styles)

    BuildPopUps(layers)
  })

  return map
}

/*
  BuildSidebar(map, data)
  @purpose: Build sidebar and all of its pertaining content
  @params:
    map: mapbox gl element, needed for layer control actions
    data: 
*/
const BuildSidebar = (map, data) =>{
  let layers = {
    regional: {
      'reliability-score': {
        title: 'Reliability Score',
        unit: false,
        page: 'regional'
      },
      'reliability-weighted': {
        title: 'Reliability Score Weighted by Ridership',
        unit: false,
        page: 'regional'
      },
      'reliability-tti': {
        title: 'Travel Time Index',
        unit: false,
        page: 'regional'
      },
    },
    filter: {

    },
    input: {
      'reliability-speed':  {
        title: 'Average Scheduled Speed',
        unit: 'Miles per Hour (MPH)',
        page: 'detail'
      },
      'reliability-otp':  {
        title: 'On Time Performance',
        unit: 'Percent of On-Time Stops (%)',
        page: 'detail'
      },
      'reliability-septa':  {
        title: 'SEPTA Surface Transit Loads',
        unit: 'Average Daily Ridership',
        page: 'detail'
      },
      'reliability-njt':  {
        title: 'NJ TRANSIT Ridership',
        unit: 'Average Daily Ridership',
        page: 'detail'
      }
    }
  }
  // function to build sidebar tabs
  const BuildSidebarNav = () =>{
    let tabs = document.createElement('nav'),
      sections = {
        regional: 'Regional Layers',
        input: 'Route Detail',
        about: 'Glossary'
      }
    
    tabs.classList.add('reliability__sidebar-tabs')

    for (let section in sections){
      let title = document.createElement('h3')

      title.classList.add('reliability__sidebar-nav')
      if (section == 'regional') title.classList.add('active')
      title.innerText = sections[section]
      title.id = `nav-${section}`

      title.onclick = e =>{

        e.preventDefault()
        e.stopPropagation()

        let target = e.target.id.split('-')[1]

        // style active tab
        for (let tab of tabs.childNodes) e.target == tab ? tab.classList.add('active') : tab.classList.remove('active')

        // display correct section
        let contentSections = document.querySelectorAll('.reliability__sidebar-sectionContent')

        for (let section of contentSections) {
          let sectionId = section.id.split('-')[1]

          // display active section
          if (target == sectionId) section.classList.add('active')
          else {
            // if there are layers associated with former active tab
            if (layers[sectionId]){
              // hide layers
              for (let layer in layers[sectionId]){
                map.setLayoutProperty(layer, 'visibility', 'none')
              }
            }

            // hide inactive section
            section.classList.remove('active')
          }
        }

        let checked = document.querySelectorAll('input[type="radio"]:checked')

        // displayed previously visible layers for newly active tab
        for (let box of checked){
          let layer = 'reliability-'+box.id

          if (layers[target] && layers[target][layer]) map.setLayoutProperty(layer, 'visibility', 'visible')
        }
      }

      tabs.appendChild(title)
    }
    return tabs
  }

  const BuildControlToggle = (parent, text) =>{
    let toggle = document.createElement('button')

    toggle.classList.add('reliability__sidebar-sectionContent-button')

    toggle.innerText = `Toggle ${text}`

    toggle.onclick = e =>{
      e.preventDefault()
      let content = e.target.nextElementSibling
      content.classList.toggle('display')
    }

    parent.appendChild(toggle)
  }

  // build layer control portion of layer section 
  const BuildLayerControl = (element, layers) =>{

    // function to run when radio is changed. Displays correct layer on map and corresponding legend item
    const LayerVisibilityChange = e =>{
      e.preventDefault()

      // get the layer/legend to be toggled on and the correct set of inputs to loop thru (regional or detail)
      const target = e.target
      const layerId = target.id
      const page = target.classList[0].split('-')[2] // this is so janky
      let layer = `reliability-${layerId}`

      // get all other form inputs from that particular page (regional or detail)
      const otherInputs = document.querySelectorAll(`.reliability__layer-input-${page}`)
      const length = otherInputs.length
      let i = 0

      // loop thru all the inputs to turn off all but the newly selected one
      for(i; i < length; i++){
        const loopedLayerId = otherInputs[i].id
        const legend = document.getElementById(`legend-${loopedLayerId}`)

        if(loopedLayerId === layerId){
          map.setLayoutProperty(layer, 'visibility', 'visible')
          legend.style.display = 'block'
        }else{
          const undoLayer = `reliability-${loopedLayerId}`
          map.setLayoutProperty(undoLayer, 'visibility', 'none')
          legend.style.display = 'none'
        }
      }
    }

    // build legends
    const BuildLegendSection = (element, layer) =>{
      let legendSection = document.createElement('div'),
        title = document.createElement('h3'),
        items = document.createElement('div')
      
      legendSection.classList.add('reliability__legend-section')
      legendSection.id = `legend-${layer}`

      // reliability legend on by default
      if(layer === 'score') legendSection.style.display = 'block'

      title.innerText = layers[`reliability-${layer}`].title
      
      items.classList.add('reliability__legend-items')
      // get appropriate colors from map styles
      let colorExpression = styles.reliability.layers[layer].paint['line-color'],
        colors = [],
        labels = [] ;
      colorExpression.map(statement=> {
        // get colors
        if (statement[0] == '#') colors.push(statement)
        // get labels
        else if (typeof statement == 'number') labels.push(statement)
      })

      // build legend HTML elements
        // TTI & reliability score layers have labels that need to be formatted differently
      colors.map((color, index)=>{
        let test = document.createElement('div')
        test.classList.add('reliability__legend-item')
        if (layer == 'weighted' || layer == 'score'){
          if (index == 0) test.innerText = 'More Reliable'
          else if (index == 4) test.innerText = 'Less Reliable'
        }
        else{
          // not last item in colors array and layer is NOT TTI
          if (labels[index] && layer != 'tti') index == 0 ? test.innerText = `0–${FormatNumber(labels[index])}` : test.innerText = `${FormatNumber(labels[index-1]+1)}–${FormatNumber(labels[index])}`
          // not last item in colors array and layer IS TTI
          else if (labels[index] && layer == 'tti') index == 0 ? test.innerText = `0–${labels[index]}` : test.innerText = `${labels[index-1]+.1}–${labels[index]}`
          // last item in colors array and layer IS TTI
          else if (!labels[index] && layer == 'tti') test.innerText = `${labels[index-1]+.1} +`
          // last item in colors array and layer is NOT TTI
          else test.innerText = `${FormatNumber(labels[index-1])} +`
        }
        test.style.borderBottom = `10px solid ${color}`
        test.style.width = `${100/colors.length}%`
        items.appendChild(test)
      })

      legendSection.appendChild(title)

      layers[`reliability-${layer}`].unit ? title.insertAdjacentHTML('afterend', `<h4>${layers[`reliability-${layer}`].unit}</h4>`) : null

      legendSection.appendChild(items)
      element.appendChild(legendSection)
    }

    let layerSection = document.createElement('form'),
      legendSection = document.createElement('form')

    layerSection.classList.add('reliability__sidebar-control')
    legendSection.classList.add('reliability__sidebar-control')

    // build layer check radio
    for (let layer in layers){
      
      let option = document.createElement('div'),
        radio = document.createElement('input'),
        label = document.createElement('label')
      
      // use page to determine it's associated layers
      const page = layers[layer].page

      option.classList.add('reliability__layer-option')
      
      radio.setAttribute('type', 'radio')
      radio.id = layer.split('-')[1]

      // default score to checked
      if(radio.id === 'score') radio.checked = true

      radio.setAttribute('name', 'reliability-regional-layers')
        
      radio.classList.add(`reliability__layer-input-${page}`)

      label.setAttribute('for', layer.split('-')[1])
      label.innerHTML = layers[layer].title

      option.appendChild(radio)
      option.appendChild(label)
      BuildLegendSection(legendSection, radio.id)
      layerSection.appendChild(option)
    }

    // handle layer toggles
    layerSection.onchange = e => LayerVisibilityChange(e)

    BuildControlToggle(element, 'Layer Controls')
    element.appendChild(layerSection)
    BuildControlToggle(element, 'Legend')
    element.appendChild(legendSection)
  }

  // function to update map filter through all layers
  const SetMapFilters = filter =>{

    // grab map layers
    let layers = styles.reliability.layers

    // go back to default if the filter array is empty
    if(!filter.length) {
      for(let layer in layers){
        map.setFilter(`reliability-${layer}`, undefined)
      }
      return
    
      // otherwise apply the new filter
    }else{
      for (let layer in layers){
        // only filter "route detail" routes
        if (layer == 'speed' || layer == 'otp' || layer == 'njt' || layer == 'septa'){
          let filterExp = ['any']
  
          // build important stuff of filter expression
          filter.forEach(route => {
            let statement = ['==', 'linename', route]
            filterExp.push(statement)
          })
  
          // set filter
          map.setFilter(`reliability-${layer}`, filterExp)
        }
      }
    }
  }

  // adds jawns for selected filter to their correct area
  const addSelectedFilter = (route, parent) => {
    parent = document.getElementById(`${parent}-filter-wrapper`)

    const selected = document.createElement('div')
    selected.classList.add('reliability__filter-selection')
    selected.textContent = `Route ${route}`
    
    parent.appendChild(selected)

    // return selected to add the remove functionality
    return selected
  }

  // removes a selected filter from the list of filters
  const removeFilter = (e, filteredRoutes) => {
    const routeDiv = e.target

    // extract the routename from the div (format is always Route #)
    const route = routeDiv.textContent.split(' ')[1].trim()

    // remove the selected route from the DOM
    routeDiv.remove()

    // update the filteredRoutes array
    filteredRoutes = filteredRoutes.filter(filteredRoute => filteredRoute !== route)

    // update the map filter
    SetMapFilters(filteredRoutes)

    // return an updated filterRoutes array
    return filteredRoutes
  }

  // function to build filter functionality
  const BuildFilterControl = element =>{
    let filteredRoutes = []
    
    const BuildDropdownOption = (container, category) =>{
      const route = container.value
      
      // make sure the inputted text exists in filterRef - if not, notify the user and reset the input value
      if (filterRef[category].indexOf(route) < 0) {
        alert('invalid route name - please try again')
        container.value = ''
        return
      }
      
      // do nothing if the selected route is alredy there
      if (filteredRoutes.length && filteredRoutes.indexOf(route) > -1) return

      // update the routes to be filtered
      filteredRoutes.push(route)

      // update the map filter
      SetMapFilters(filteredRoutes)

      // add a jawn for the selected filter to the sidebar
      const newFilter = addSelectedFilter(route, category)

      // let users remove filters + update filteredRoutes with the result
      newFilter.onclick = e => filteredRoutes = removeFilter(e, filteredRoutes)

      // clear the input field so users can add more routes
      container.value = ''
    }

    let filterRef = {
      septa: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','42','43','44','46','47','48','50','52','53','54','55','56','57','58','59','60','61','62','64','65','66','67','68','70','73','75','77','78','79','80','84','88','89','45','90','91','92','93','94','95','96','97','98','99','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','117','118','119','120','123','124','125','126','127','128','129','130','131','132','133','139','150','201','204','205','206','310','311','BSO','G','H','J','K','L','LUCYGO','LUCYGR','MFO','R','XH'],
      njtransit: ['313','315','317','400','401','402','403','404','405','406','407','408','409','410','412','413','414','417','418','419','450','451','452','453','455','457','459','463','551','554','559','600','601','603','605','606','607','608','609','610','611','612','613','619','624']
    }

    // make the filter and return elements that needed additional functionality
    let [septaFilter, njFilter] = [...makeFilter(element)]

    populateDatalist(septaFilter.septaRoutes, 'septa', filterRef)
    populateDatalist(njFilter.njRoutes, 'njtransit', filterRef)

    septaFilter.addSeptaFilter.onclick = () => BuildDropdownOption(septaFilter.septaInput, 'septa')
    njFilter.addNjFilter.onclick = () => BuildDropdownOption(njFilter.njInput, 'njtransit')
  }

  const BuildAboutSection = parent =>{
    let container = document.createElement('div')
    container.classList.add(`reliability__sidebar-sectionContent`)
    container.id = 'content-about'


    // build about sections and fill with content
    for (let section in layerRef){
      let item = document.createElement('section')
      item.id = `reliability__sidebar-${section}Content`
      let title = document.createElement('h2')
      title.classList.add('reliability__sidebar-sectionTitle')
      title.innerText = section
      item.appendChild(title)

      // input sections are styled differently to draw attention
      if (section === 'purpose'){
        let purposeSection = document.createElement('p')
        purposeSection.innerHTML = layerRef[section]
        // purposeSection.classList.add('reliability__sidebar-contentSection')
        item.appendChild(purposeSection)
      }
      else if (section === 'outputs'){
        for (let output in layerRef[section]){
          let outputSection = document.createElement('p')
          // outputSection.classList.add('reliability__sidebar-contentSection')
          outputSection.innerHTML = layerRef[section][output]
          item.appendChild(outputSection)
        }
      }
      else{
        for (let input in layerRef[section]){
          let inputSection = document.createElement('p'),
            title = layerRef[section][input].title,
            info = layerRef[section][input].info
          
          inputSection.classList.add('reliability__sidebar-inputSection')
          inputSection.innerHTML = `<span class="reliability__sidebar-inputTitle">${title}:</span> ${info}`
          item.appendChild(inputSection)
        }
      }
      container.appendChild(item)
    }
    parent.appendChild(container)
  }

  // build layer section of sidebar
  const BuildRegionalSection = element =>{
    let container = document.createElement('div'),
      layerControl = document.createElement('button'),
      descriptiveText = document.createElement('p')

    container.classList.add('reliability__sidebar-sectionContent')
    container.classList.add('active')
    descriptiveText.classList.add('reliability__descriptive-text')

    container.id = 'content-regional'
    
    descriptiveText.textContent = 'The goal of the surface transit reliability analysis was to identify corridors where surface transit service is particularly slow or delayed as places where road or transit improvements could increase reliability. These regional layers show aggregate measures for all surface transit routes that use a particular road segment.'
    layerControl.innerText = 'Show Layer List'
    
    container.appendChild(descriptiveText)
    element.appendChild(container)

    BuildLayerControl(container, layers.regional)

    layerControl.onclick = e =>{
      e.preventDefault()
      let content = e.target.nextElementSibling

      content.classList.toggle('display')
    }
  }

  const BuildRouteSection = element =>{
    let container = document.createElement('div'),
      layerControl = document.createElement('div'),
      filterControl = document.createElement('div'),
      descriptiveText = document.createElement('p');

    container.classList.add('reliability__sidebar-sectionContent')
    descriptiveText.classList.add('reliability__descriptive-text')

    container.id = 'content-input'

    descriptiveText.textContent = 'The layers on this tab are best viewed at the route level. Use the filter to select a surface transit route to examine in detail. When multiple routes are displayed, colors will reflect whichever route is on top.'

    container.appendChild(descriptiveText)

    BuildControlToggle(filterControl, 'Filter')
    container.appendChild(filterControl)
    container.appendChild(layerControl)
    element.appendChild(container)
    BuildFilterControl(filterControl)
    BuildLayerControl(layerControl, layers.input)
  }

  const footer = new Footer().footer
  let sidebar = document.querySelector('#reliability__sidebar'),
    content = document.createElement('div'),
    tabs = BuildSidebarNav()
  content.classList.add('reliability__sidebar-content')
  sidebar.appendChild(tabs)
  sidebar.appendChild(content)
  sidebar.appendChild(footer)

  BuildRegionalSection(content)
  BuildRouteSection(content)
  BuildAboutSection(content)
}
export class Reliability{
  constructor(){
    this.content = {
      map: undefined,
      sidebar: undefined,
    }
    this.data = new Object();
    this.render()
  }

  render(){
    let main = document.querySelector('main')
    main.id = 'reliability'
    BuildPage(this.content)
    let map = BuildMap(this)
    BuildSidebar(map, this.data)

  }

}