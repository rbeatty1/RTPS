import '../../../css/pages/reliability/reliability.css'
import {LoadLayers} from '../../../utils/loadMapLayers';
import { styles } from '../map/map_styles/reliability.js'
import { FormatNumber } from '../../../utils/formatNumber';
import { CreateDvrpcNavControl } from '../../../utils/defaultExtentControl';
import { Footer } from "../../footer/footer";

let layerRef = {
  purpose: "The goal of the surface transit reliability analysis was to identify corridors where surface transit service is particularly slow or delayed as places where road or transit improvements could increase reliability.",
  inputs:{
    speed: {
      title: "Average Speed by Line",
      info: "The average speed for bus routes that use a road segment was calcluated using the distance between stop points and the scheduled time for each stop point as provided in the <abbr class='reliability__abbr' title='General Transit Feed Specification'>GTFS</abbr>. If multiple bus routes use a road segment, a weighted average was calculated to ensure that the buses using the segment most throughout the day were considered more heavily."
    },
    otp:{
      title: "On Time Performance (OTP)",
      info: "<abbr class='reliability__abbr' title='On Time Performance'>OTP</abbr> represents the percent of time the bus route is considered on time. A trip is considered on time when it arrives between 0 and 6 minutes after the scheduled time. Low <abbr class='reliability__abbr' title='On Time Performance'>OTP</abbr> is indicative of reliability issues."
    },
    tti: {
      title: "Travel Time Index (TTI)",
      info: "<abbr class='reliability__abbr' title='Travel Time Index'>TTI</abbr> is the ratio of peak hour travel time to free flow travel time. The <abbr class='reliability__abbr' title='Travel Time Index'>TTI</abbr> is used in this analysis accounts for all vehicle types, not just transit vehicles. High <abbr class='reliability__abbr' title='Travel Time Index'>TTI</abbr> indicates congestion which negatively impacts surface transit reliability. <abbr class='reliability__abbr' title='Travel Time Index'>TTI</abbr> was available from INRIX on many roads throughout the region. An estimate of <abbr class='reliability__abbr' title='Travel Time Index'>TTI</abbr> from the regional travel model was used to fill gaps in the INRIX data."
    },
    septa: {
      title: "SEPTA Ridership (2017)",
      info: "2017 daily average ridership for <abbr class='reliability__abbr' title='Southeastern Pennsylvania Transportation Authority'>SEPTA</abbr> bus routes was available at the stop level."
    },
    njt: {
      title: "NJ Transit Ridership (2016)",
      info: "2016-2017 daily average ridership for <abbr class='reliability__abbr' title='New Jersey'>NJ</abbr> Transit bus routes was provided at the stop level."
    }
  },
  outputs:{
    score: "The input layers were combined to calculate the overall measure of reliability. The <span class='reliability__sidebar-emphasis'>Reliability Score</span> layer shows the results of combining <abbr class='reliability__abbr' title='Travel Time Index'>TTI</abbr>, <abbr class='reliability__abbr' title='On Time Performance'>OTP</abbr>, and scheduled speed. A high reliability score is indicative of segments that may benefit from targeted improvements to improve transit operations.",
    weight: "The results were then weighted by ridership (<span class='reliability__sidebar-emphasis'>Ridership Weighted Reliability Score</span>) to highlight segments that impact high ridership surface transit service an allow for further prioritization of improvements."
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
    LayerVisibilityCheck(layerName)
    @purpose: function to update checkbox status and load legend when layer is activated.
    @params:
      layerName: name of layer to check status of appropriate checkbox
  */
  const LayerVisibilityCheck = layerName =>{
    let layerId = `reliability-${layerName}`,
      checkboxId = `#legend-${layerName}`

    // @TODO: add a check here to see IF the layer exists (like in the tourism map)
      // true: run the set visibility jawn
      // false: fetch and add it to the data object
    if (map.getLayoutProperty(layerId, 'visibility') == 'visible') {
      const name = layerId.split('-')[1]
      document.querySelector(`input[name=${name}]`).checked = true
      document.querySelector(checkboxId).style.display = 'block'
    }
  }

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
      title.innerText = (layer == 'score' || layer == 'weighted') ? `Routes ${props.lines}` : `Route ${props.linename}`
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



  let extent = {
    center: [-75.234, 40.061],
    zoom: 8.4
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

    // display correct layers
    for (let layer in styles.reliability.layers) LayerVisibilityCheck(layer)
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
        unit: false
      },
      'reliability-weighted': {
        title: 'Reliability Score Weighted by Ridership',
        unit: false
      },
      'reliability-tti': {
        title: 'Travel Time Index',
        unit: false
      },
    },
    input: {
      'reliability-speed':  {
        title: 'Average Speed by Line',
        unit: 'Miles per Hour (MPH)'
      },
      'reliability-otp':  {
        title: 'On Time Performance',
        unit: 'Percent of On-Time Stops (%)'
      },
      'reliability-septa':  {
        title: 'SEPTA Surface Transit Loads',
        unit: 'Average Daily Ridership'
      },
      'reliability-njt':  {
        title: 'New Jersey Transit Ridership',
        unit: 'Average Daily Ridership'
      }
    }
  }
  // function to build sidebar tabs
  const BuildSidebarNav = () =>{
    let tabs = document.createElement('nav'),
      sections = {
        regional: 'Regional Layers',
        input: 'Route Detail',
        about: 'About'
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

        let checked = document.querySelectorAll('input[type="checkbox"]:checked')

        // displayed previously visible layers for newly active tab
        for (let box of checked){
          let layer = 'reliability-'+box.name

          if (layers[target] && layers[target][layer]) map.setLayoutProperty(layer, 'visibility', 'visible')
        }
      }

      tabs.appendChild(title)
    }
    return tabs
  }

  const BuildControlToggle = (parent, text) =>{
    let toggle = document.createElement('button')

    toggle.innerText = `Toggle ${text}`

    if (text.toLowerCase() == 'filter'){
      toggle.onclick = e =>{
        let modal = document.getElementById('filter-modal')
        modal.classList.toggle('active')
      }

    }
    else{
      toggle.onclick = e =>{
        e.preventDefault()
        let content = e.target.nextElementSibling
        content.classList.toggle('display')
      }
    }

    parent.appendChild(toggle)
  }

  // build layer control portion of layer section
  const BuildLayerControl = (element, layers) =>{
    // function to run when checkbox is changed. Displays correct layer on map and corresponding legend item
    const LayerVisibilityChange = layer =>{
      let layerID = `reliability-${layer}`,
        boxes = document.querySelectorAll('.reliability__layer-input'),
        visibility = map.getLayoutProperty(layerID, 'visibility'),
        mapLayer = map.getLayer(layerID)

      for (let refLayer in styles.reliability.layers) if (refLayer == layer) visibility == 'none' ? map.setLayoutProperty(layerID, 'visibility', 'visible') : map.setLayoutProperty(layerID, 'visibility', 'none')

      for (let box of boxes) box.checked ? document.querySelector(`#legend-${box.name}`).style.display = 'block' : document.querySelector(`#legend-${box.name}`).style.display = 'none'
    }

    // build legends
    const BuildLegendSection = (element, layer) =>{
      let legendSection = document.createElement('div'),
        title = document.createElement('h3'),
        items = document.createElement('div')
      
      legendSection.classList.add('reliability__legend-section')
      legendSection.id = `legend-${layer}`

      title.innerText = layers[`reliability-${layer}`].title
      
      items.classList.add('reliability__legend-items')
      // get appropriate colors from map styles
      let colorExpression = styles.reliability.layers[layer].paint['line-color'],
        colors = new Array(),
        labels = new Array() ;
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

    let layerSection = document.createElement('div'),
      legendSection = document.createElement('div')

    layerSection.classList.add('reliability__sidebar-control')
    legendSection.classList.add('reliability__sidebar-control')

    // build layer check boxes
    for (let layer in layers){
      let option = document.createElement('div'),
        checkbox = document.createElement('div'),
        input = document.createElement('input'),
        label = document.createElement('label')
      
      option.classList.add('reliability__layer-option')
      checkbox.classList.add('reliability__layer-checkbox')
      
      input.setAttribute('type', 'checkbox')
      input.setAttribute('name', layer.split('-')[1])
      input.classList.add('reliability__layer-input')

      label.setAttribute('for', layer.split('-')[1])
      label.innerHTML = layers[layer].title

      input.addEventListener('input', ()=> LayerVisibilityChange(input.name))

      checkbox.appendChild(input)
      checkbox.appendChild(label)

      option.appendChild(checkbox)
      BuildLegendSection(legendSection, input.name)
      layerSection.appendChild(option)
    }



    BuildControlToggle(element, 'Layer Controls')
    element.appendChild(layerSection)
    BuildControlToggle(element, 'Legend')
    element.appendChild(legendSection)

  }

  // function to build filter functionality
  const BuildFilterControl = element =>{
    
    // build filter dropdown
    const BuildDropdownOption = (container, item) =>{
      // listener to fire when one of the filter options is selected
      const CheckboxListeners = list =>{
        // function to update map filter through all layers
        const SetMapFilters = filter =>{
          // grab map layers
          let layers = styles.reliability.layers
          for (let layer in layers){
            // only filter "route detail" routes
            if (layer == 'speed' || layer == 'otp' || layer == 'njt' || layer == 'septa'){
              let filterExp = ['any']
              // build important stuff of filter expression
              filter.map(route=>{
                if (route == 'core'){
                  filterRef[route].map(coreRoute=>{
                    let statement = ['==', 'linename', coreRoute]
                    filterExp.push(statement)
                  })
                }
                else{
                  let statement = ['==', 'linename', route]
                  filterExp.push(statement)
                }
              })
              // set filter
              map.setFilter(`reliability-${layer}`, filterExp)
            }

          }
        }
        let filtered = []
        // grab all of the filter checkboxes
        let allBoxes = list.querySelectorAll('input[type="checkbox"]')
        // push all checked options to an array
        for (let box of allBoxes){
          box.checked == true && filtered.indexOf(box.value) == -1 ? filtered.push(box.value) : null
        }
        let summary = list.previousElementSibling
        summary.innerHTML = ''
        // build little element to display each selected filter option
        filtered.map(route=>{
          let selected = document.createElement('div')
          selected.classList.add('reliability__filter-selection')
          selected.innerHTML = `Route ${route}`
          summary.appendChild(selected)
        })

        let remove = document.querySelectorAll('.reliability__filter-selection')
        for (let x of remove){
          // listener to remove filtered routes
          x.addEventListener('click', e=>{
            let item = e.target.childNodes[0],
              // we only want the number of the route
              route = item.textContent.split(' ')[1],
              // grab specific checkbox
              box = document.querySelector(`input[type="checkbox"][name="${route}"]`)
            // delete the jawn
            e.target.outerHTML = ''
            // unchecked the jawn
            box.checked = false

            let index = filtered.indexOf(route)
            filtered.splice(index, 1)
            // update the map jawn
            if (filtered.length > 0) SetMapFilters(filtered)
            else for (let layer in styles.reliability.layers){ map.setFilter(`reliability-${layer}`, undefined)}

          })
        }

        if (filtered.length > 0) SetMapFilters(filtered)
        else for (let layer in styles.reliability.layers){ map.setFilter(`reliability-${layer}`, undefined)}
      }
      let listItem = document.createElement('li'),
        option = document.createElement('input'),
        label = document.createElement('label')

      listItem.classList.add('reliability__filter-item')

      option.type = 'checkbox'
      option.id = `filterOption-${item}`
      option.name = item
      option.value = item
      option.onchange = e => CheckboxListeners(e.target.parentNode.parentNode)

      label.setAttribute('for', item)
      label.innerText = 'Route '+item

      listItem.appendChild(option)
      listItem.appendChild(label)
      container.querySelector('.reliability__filter-options').appendChild(listItem)
      return listItem
      
    }

    let filterRef = {
      core: ['6', '17', '21', '23', '33', '46', '47', '52', '56', '58', '60', '66', '79', '108', '113', 'R', '18', '26', 'G', '7', '10', '11', '13', '34', '36', 'MFL', 'BSL'],
    }

    let dropdown = document.createElement('div'),
      summary = document.createElement('div')

    dropdown.id = 'filter-modal'
  

    element.appendChild(dropdown)

    // get all of the routes to build filter
    fetch('https://a.michaelruane.com/api/rtps/reliability?filter')
    .then(response=> response.ok ? response.json() : null)
    .then(jawn=>{
      for (let route in jawn.cargo){
        route.replace(' ', '_')
        filterRef[route.toString()] = route.toString()
      }
      return filterRef
    })
    .then(data=>{

      /*
        TO-DO:
          - Aria-ify modal opening/dropdown display
          - Restructure to handle division by operator/mode
          - Close modal on click event outside of modal content 
      */

      
      dropdown.classList.add('reliability__filter-dropdown')
      summary.classList.add('reliability__filter-summary')


      dropdown.innerHTML = `<div id="filter-modal-content"><span id="close-filter-modal">&times;</span><span class="reliability__filter-default">Surface Transit Route Filter</span>${summary.outerHTML}<ul class="reliability__filter-options"></ul></div>`
      
      
      for (let route in data)  BuildDropdownOption(dropdown, route)


      let accordian = dropdown.querySelector('.reliability__filter-default'),
        close = document.getElementById('close-filter-modal')

      accordian.onclick = e =>{
        let ul = e.target.parentNode.querySelector('ul')
        if (ul.classList.contains('visible')){
          ul.classList.remove('visible')
          accordian.classList.remove('active')
          accordian.parentNode.parentNode.parentNode.style.height = '40%'
        }
        else{
          ul.classList.add('visible')
          accordian.classList.add('active')
          accordian.parentNode.parentNode.parentNode.style.height = '75%'
        }
      }

      close.onclick = e =>{
        e.preventDefault()
        e.stopPropagation()

        let modal = document.getElementById('filter-modal')

        modal.classList.remove('active')
      }
    })

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
      if (section == 'purpose'){
        let purposeSection = document.createElement('p')
        purposeSection.innerHTML = layerRef[section]
        // purposeSection.classList.add('reliability__sidebar-contentSection')
        item.appendChild(purposeSection)
      }
      else if (section == 'outputs'){
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