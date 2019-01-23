import '../../../css/pages/reliability/reliability.css'
import {LoadLayers} from '../../../utils/loadMapLayers';
import { styles } from '../map/map_styles/reliability.js'
import { FormatNumber } from '../../../utils/formatNumber';

// function to build overall page structure
const BuildPage = structure =>{
  let page = document.createElement('div')
  page.id = 'reliability__page'

  // create HTML element for each defined page section. 
  for (let section in structure){
    let sectionElem = document.createElement('div')
    sectionElem.id = 'reliability__'+section
    // append element to page
    page.appendChild(sectionElem)
    // update state to include element
    structure[section] = sectionElem
  }
  // append page to application
  document.querySelector('#main').appendChild(page)
}

// function to build map and all of it's layers
const BuildMap = pageContent =>{
  // load data for each layer and add to state
  const LoadData = data =>{
    // all API endpoints
    let endpoints = ['score', 'tti', 'speed', 'otp', 'weighted', 'njt', 'septa' ]
    endpoints.map(query=>{
      fetch(`https://a.michaelruane.com/api/rtps/reliability?${query}`)
      .then(response=>{
        if (response.ok) return response.json()
      })
      .then(jawn=>{
        data[query] = jawn.cargo
        return data[query]
      })
    })
  
  }

  // function to update checkbox status and load legend when layer is activated.
  const LayerVisibilityCheck = layerName =>{
    let layerId = `reliability-${layerName}`,
      checkboxId = `#legend-${layerName}`
    if (map.getLayoutProperty(layerId, 'visibility') == 'visible') {
      // check to see which layers are visible
      document.querySelector(`input[name=${layerId.split('-')[1]}]`).checked = true
      document.querySelector(checkboxId).style.display = 'flex'
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
    // load map layers
    LoadLayers(map, styles)
    // assign data to local state
    LoadData(pageContent.data)
    // display correct layers
    for (let layer in styles.reliability.layers) LayerVisibilityCheck(layer)
  })

  return map
}

const BuildSidebar = (map, data) =>{
  // function to build sidebar tabs
  const BuildSidebarNav = () =>{
    let tabs = document.createElement('ul'),
      sections = ['About', 'Layers']
    
    tabs.classList.add('reliability__sidebar-tabs')
    
    // build sidebar tabs.
    sections.map(section=>{
      let tab = document.createElement('li')
      tab.classList.add('reliability__sidebar-nav')
      tab.innerText = section
      tab.id = `nav-${section.toLowerCase()}`
      if (section == 'About') tab.classList.add('active')
      // listener to switch sidebar content on tab click
      tab.addEventListener('click', e=>{
        let tabs = document.querySelectorAll('.reliability__sidebar-nav')
        for (let section of tabs) e.target === section ? section.classList.add('active') : section.classList.remove('active')
        let sections = document.querySelectorAll('.reliability__sidebar-sectionContent')
        for (let section of sections) e.target.id.split('-')[1] == section.id.split('-')[1] ? section.classList.add('active') : section.classList.remove('active')
        })
      tabs.appendChild(tab)
    })
    return tabs
  }

  const BuildAboutSection = parent =>{
    // local content reference to populate about section
    let content = {
      purpose: "The goal of the surface transit reliability analysis was to identify corridors where surface transit service is particularly slow or delayed as places where road or transit improvements could increase reliability.",
      inputs:{
        speed: {
          title: "Average Speed by Line",
          info: "The average speed for bus routes that use a road segment was calcluated using the distance between stop points and the scheduled time for each stop point as provided in the GTFS. If multiple bus routes use a road segment, a weighted average was calculated to ensure that the buses using the segment most throughout the day were considered more heavily."
        },
        otp:{
          title: "On Time Performance (OTP)",
          info: "OTP represents the percent of time the bus route is considered on time. A trip is considered on time when it arrives between 0 and 6 minutes after the scheduled time. Low OTP is indicative of reliability issues."
        },
        tti: {
          title: 'Travel Time Index (TTI)',
          info: "TTI is the ratio of peak hour travel time to free flow travel time. The TTI is used in this analysis accounts for all vehicle types, not just transit vehicles. High TTI indicates congestion which negatively impacts surface transit reliability. TTI was available from INRIX on many roads throughout the region. An estimate of TTI from the regional travel model was used to fill gaps in the INRIX data."
        },
        septa: {
          title: 'SEPTA Ridership (2017)',
          info: '2017 Ridership for SEPTA bus routes was available at the stop level.'
        },
        njt: {
          title: "NJ Transit Ridership (2016)",
          info: "2016-2017 ridership for NJ Transit bus routes was provided at the stop level."
        }
      },
      score: "The input layers were combined to calculate the overall measure of reliability. The <span class='reliability__sidebar-emphasis'>Reliability Score</span> layer shows the results of combining TTI, OTP, and scheduled speed. A high reliability score is indicative of segments that may benefit from targeted improvements to improve transit operations.",
      weight: "The results were then weighted by ridership (<span class='reliability__sidebar-emphasis'>Ridership Weighted Reliability Score</span>) to highlight segments that impact high ridership surface transit service an allow for further prioritization of improvements."
    }

    let container = document.createElement('div'),
      element = document.createElement('div')
    container.classList.add('reliability__sidebar-sectionContent')
    container.classList.add('active')
    container.id = 'content-about'
    element.classList.add('reliability__sidebar-control')
    // build about sections and fill with content
    for (let section in content){
      let container = document.createElement('div')
      // input sections are styled differently to draw attention
      if (section != 'inputs'){
        container.innerHTML = content[section]
        container.classList.add('reliability__sidebar-contentSection')
      }
      else{
        for (let input in content[section]){
          let inputSection = document.createElement('div'),
            title = content[section][input].title,
            info = content[section][input].info
          
          inputSection.classList.add('reliability__sidebar-inputSection')
          inputSection.innerHTML = `<span class="reliability__sidebar-inputTitle">${title}:</span> ${info}`
          container.appendChild(inputSection)
        }
        container.classList.add('reliability__sidebar-contentSection')
      }
      element.appendChild(container)
    }
    container.appendChild(element)
    parent.appendChild(container)
  }

  // build layer section of sidebar
  const BuildLayerSection = element =>{

    // build layer control portion of layer section
    const BuildLayerControl = element =>{
      // function to run when checkbox is changed. Displays correct layer on map and corresponding legend item
      const LayerVisibilityChange = layer =>{
        let layerID = `reliability-${layer}`,
          boxes = document.querySelectorAll('input[type=checkbox]')
        let visibility = map.getLayoutProperty(layerID, 'visibility')
        for (let refLayer in styles.reliability.layers) if (refLayer == layer) visibility == 'none' ? map.setLayoutProperty(layerID, 'visibility', 'visible') : map.setLayoutProperty(layerID, 'visibility', 'none')

        for (let box of boxes) box.checked ? document.querySelector(`#legend-${box.name}`).style.display = 'flex' : document.querySelector(`#legend-${box.name}`).style.display = 'none'

      }

      // build legends
      const BuildLegendSection = (element, layer) =>{
        let legendSection = document.createElement('div'),
          items = document.createElement('div')
  
        
        legendSection.classList.add('reliability__legend-section')
        legendSection.id = `legend-${layer}`
        
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
          // TTI layer has labels that need to be formatted different because of the small number
        colors.map((color, index)=>{
          let test = document.createElement('div')
          test.classList.add('reliability__legend-item')
          // not last item in colors array and layer is NOT TTI
          if (labels[index] && layer != 'tti') index == 0 ? test.innerText = `0–${FormatNumber(labels[index])}` : test.innerText = `${FormatNumber(labels[index-1]+1)}–${FormatNumber(labels[index])}`
          // not last item in colors array and layer IS TTI
          else if (labels[index] && layer == 'tti') index == 0 ? test.innerText = `0–${labels[index]}` : test.innerText = `${labels[index-1]+.1}–${labels[index]}`
          // last item in colors array and layer IS TTI
          else if (!labels[index] && layer == 'tti') test.innerText = `${labels[index-1]+.1} +`
          // last item in colors array and layer is NOT TTI
          else test.innerText = `${FormatNumber(labels[index-1])} +`
          test.style.borderBottom = `10px solid ${color}`
          test.style.width = `${100/colors.length}%`
          items.appendChild(test)
        })
  
        legendSection.appendChild(items)
        element.appendChild(legendSection)
      }

      let layers = [
        ['reliability-score', '<span class="reliability__layer-emphasis">Output:</span> Reliability Score'],
        ['reliability-weighted', '<span class="reliability__layer-emphasis">Output:</span> Ridership Weighted Reliability Score'],
        ['reliability-speed', '<span class="reliability__layer-emphasis">Input:</span> Average Speed by Line'],
        ['reliability-otp', '<span class="reliability__layer-emphasis">Input:</span> On Time Performance'],
        ['reliability-tti', '<span class="reliability__layer-emphasis">Input:</span> Travel Time Index'],
        // ['reliability-septa', '<span class="reliability__layer-emphasis">Input:</span> SEPTA Surface Transit Loads'],
        ['reliability-njt', '<span class="reliability__layer-emphasis">Input:</span> New Jersey Transit Ridership']
      ]

      element.classList.add('reliability__sidebar-control')
      // build layer check boxes
      layers.map(layer=>{
        let option = document.createElement('div'),
          checkbox = document.createElement('div'),
          input = document.createElement('input'),
          label = document.createElement('label')
        
        option.classList.add('reliability__layer-option')
        checkbox.classList.add('reliability__layer-checkbox')
        
        input.setAttribute('type', 'checkbox')
        input.setAttribute('name', layer[0].split('-')[1])
  
        label.setAttribute('for', layer[0].split('-')[1])
        label.innerHTML = layer[1]

        input.addEventListener('input', ()=> LayerVisibilityChange(input.name))

        checkbox.appendChild(input)
        checkbox.appendChild(label)

        option.appendChild(checkbox)
        BuildLegendSection(option, input.name)
        element.appendChild(option)
      })

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
              // speed, otp, njt have single routes per feature
              if (layer == 'speed' || layer == 'otp' || layer == 'njt'){
                let filterExp = ['any']
                // build important stuff of filter expression
                filter.map(route=>{
                  if (route != 'core'){
                    let statement = ['==', 'linename', route]
                    filterExp.push(statement)
                  }
                  else{
                    let core = filterRef[route]
                    core.map(x=>{
                      let statement = ['==', 'linename', x]
                      filterExp.push(statement)
                    })
                  }
                })
                // set filter
                map.setFilter(`reliability-${layer}`, filterExp)
              }
              // score and weighted layers have multiple routes per feature -.-
              else if (layer == 'score' || layer == 'weighted'){
                let filterExp = ['any']
                filter.map(route=>{
                  for (let segment in data[layer]){
                    let feature = data[layer][segment]
                    if (feature.lines != null){
                      // grab individual routes from feature
                      let lines = feature.lines.split(',')
                      lines.map(line=>{
                        let statement = ['==', 'gid']
                        // build filter expression
                        if (line == route){
                          statement.push(parseInt(segment))
                          filterExp.push(statement)
                        }
                      })
                    }
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
            route != 'core' ? selected.innerHTML = `Route ${route}` : selected.innerHTML = 'SEPTA Core Routes'
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
        item != 'core' ? label.innerHTML = `Route ${item}` : label.innerHTML = 'SEPTA Core Routes'

        listItem.appendChild(option)
        listItem.appendChild(label)
        container.querySelector('.reliability__filter-options').appendChild(listItem)
        return listItem
        
      }

      let filterRef = {
        core: ['6', '17', '21', '23', '33', '46', '47', '52', '56', '58', '60', '66', '79', '108', '113', 'R', '18', '26', 'G', '7', '10', '11', '13', '34', '36', 'MFL', 'BSL'],
      }
      element.classList.add('reliability__sidebar-filter')

      let dropdown = document.createElement('div'),
        summary = document.createElement('div')
    

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
        dropdown.classList.add('reliability__filter-dropdown')
        summary.classList.add('reliability__filter-summary')
        dropdown.innerHTML = `<span class="reliability__filter-default">Surface Transit Route Filter</span>${summary.outerHTML}<ul class="reliability__filter-options"></ul>`
        for (let route in data)  BuildDropdownOption(dropdown, route)
        let accordian = dropdown.querySelector('.reliability__filter-default')
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
      })

    }

    let container = document.createElement('div'),
      layerControl = document.createElement('div'),
      filterControl = document.createElement('div')

    container.classList.add('reliability__sidebar-sectionContent')

    container.id = 'content-layers'

    BuildLayerControl(layerControl)
    BuildFilterControl(filterControl)

    container.appendChild(layerControl)
    layerControl.appendChild(filterControl)
    element.appendChild(container)
  }
  
  let sidebar = document.querySelector('#reliability__sidebar'),
    content = document.createElement('div'),
    tabs = BuildSidebarNav()
  content.classList.add('reliability__sidebar-content')
  sidebar.appendChild(tabs)
  sidebar.appendChild(content)
  
  BuildAboutSection(content)
  BuildLayerSection(content)
  

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
    BuildPage(this.content)
    let map = BuildMap(this)
    BuildSidebar(map, this.data)

  }

}