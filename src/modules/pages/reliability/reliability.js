import '../../../css/pages/reliability/reliability.css'
import {LoadLayers} from '../../../utils/loadMapLayers';
import { styles } from '../map/map_styles/reliability.js'


const BuildPage = structure =>{
  let page = document.createElement('div')
  page.id = 'reliability__page'

  for (let section in structure){
    let sectionElem = document.createElement('div')
    sectionElem.id = 'reliability__'+section
    page.appendChild(sectionElem)
    structure[section] = sectionElem
  }
  document.querySelector('#main').appendChild(page)
  return page

}

const BuildMap = pageContent =>{
  const LoadData = data =>{
    let endpoints = ['score', 'tti', 'speed', 'otp', 'weighted', 'njt', 'septa' ]
    endpoints.map(query=>{
      fetch(`http://localhost:8000/api/rtps/reliability?${query}`)
      .then(response=>{
        if (response.ok) return response.json()
      })
      .then(jawn=>{
        data[query] = jawn.cargo
        return data[query]
      })
    })
  
  }

  const LayerVisibilityCheck = layerId =>{
    if (map.getLayoutProperty(layerId, 'visibility') == 'visible') document.querySelector(`input[name=${layerId.split('-')[1]}]`).checked = true
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

  map.on('load', ()=> {
    map.resize()
    map.flyTo({
      center: extent.center,
      zoom: extent.zoom
    })
    LoadLayers(map, styles)

    LoadData(pageContent.data)

    for (let layer in styles.reliability.layers) LayerVisibilityCheck(`reliability-${layer}`)
  })

  return map
}


const BuildSidebar = map =>{
  const BuildSidebarNav = () =>{
    let tabs = document.createElement('ul'),
      sections = ['About', 'Layers', 'Legend']
    
    tabs.classList.add('reliability__sidebar-tabs')
    
    sections.map(section=>{
      let tab = document.createElement('li')
      tab.classList.add('reliability__sidebar-nav')
      tab.innerText = section
      tab.id = `nav-${section.toLowerCase()}`
      if (section == 'About') tab.classList.add('active')
      tab.addEventListener('click', e=>{
        let tabs = document.querySelectorAll('.reliability__sidebar-nav')
        for (let section of tabs){
          e.target === section ? section.classList.add('active') : section.classList.remove('active')
        }
        let sections = document.querySelectorAll('.reliability__sidebar-sectionContent')
        for (let section of sections){
          if (e.target.id.split('-')[1] == section.id.split('-')[1]){
            section.classList.add('active')
          }
          else { section.classList.remove('active')}
        }
      })
      tabs.appendChild(tab)
    })
    return tabs
  }

  const BuildAboutSection = parent =>{
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

    let element = document.createElement('div')
    element.classList.add('reliability__sidebar-sectionContent')
    element.classList.add('active')
    element.id = 'content-about'
    for (let section in content){
      let container = document.createElement('div')
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
    parent.appendChild(element)
  }

  const BuildLayerTab = element =>{
    const BuildLayerControl = element =>{

      const LayerVisibilityChange = layer =>{
        let layerID = `reliability-${layer}`
        let visibility = map.getLayoutProperty(layerID, 'visibility')
        for (let refLayer in styles.reliability.layers){
          if (refLayer == layer){
            visibility == 'none' ? map.setLayoutProperty(layerID, 'visibility', 'visible') : map.setLayoutProperty(layerID, 'visibility', 'none')
          }
        }
      }

      let layers = [
        ['reliability-score', '<span class="reliability__layer-emphasis">Result:</span> Reliability Score'],
        ['reliability-weighted', '<span class="reliability__layer-emphasis">Result:</span> Ridership Weighted Reliability Score'],
        ['reliability-speed', '<span class="reliability__layer-emphasis">Input:</span> Average Speed by Line'],
        ['reliability-otp', '<span class="reliability__layer-emphasis">Input:</span> On Time Performance'],
        ['reliability-tti', '<span class="reliability__layer-emphasis">Input:</span> Travel Time Index'],
        ['reliability-septa', '<span class="reliability__layer-emphasis">Input:</span> SEPTA Surface Transit Loads'],
        ['reliability-njt', '<span class="reliability__layer-emphasis">Input:</span> New Jersey Transit Ridership']
      ]

      element.classList.add('reliability__sidebar-control')

      layers.map(layer=>{
        let checkbox = document.createElement('div'),
          input = document.createElement('input'),
          label = document.createElement('label')
        
        checkbox.classList.add('reliability__layer-option')
        input.classList.add('reliability__layer-checkbox')
        
        input.setAttribute('type', 'checkbox')
        input.setAttribute('name', layer[0].split('-')[1])
  
        label.setAttribute('for', layer[0].split('-')[1])
        label.innerHTML = layer[1]

        input.addEventListener('input', ()=> LayerVisibilityChange(input.name))

        checkbox.appendChild(input)
        checkbox.appendChild(label)
        element.appendChild(checkbox)
      })

    }

    const BuildFilterControl = element =>{
      element.classList.add('reliability__sidebar-control')

      element.innerHTML = '<h2 class="reliability__control-title">Filter</h2>'

    }

    let container = document.createElement('div'),
      layerControl = document.createElement('div'),
      filterControl = document.createElement('div')

    container.classList.add('reliability__sidebar-sectionContent')

    container.id = 'content-layers'

    BuildLayerControl(layerControl)
    BuildFilterControl(filterControl)

    container.appendChild(layerControl)
    container.appendChild(filterControl)
    element.appendChild(container)
  }
  
  let sidebar = document.querySelector('#reliability__sidebar'),
    content = document.createElement('div'),
    tabs = BuildSidebarNav()
  content.classList.add('reliability__sidebar-content')
  sidebar.appendChild(tabs)
  sidebar.appendChild(content)
  
  BuildAboutSection(content)
  BuildLayerTab(content)

}
export class Reliability{
  constructor(){
    this.content = {
      map: undefined,
      sidebar: undefined,
      table: undefined
    }
    this.data = new Object();
    this.render()
  }

  render(){
    BuildPage(this.content)
    let map = BuildMap(this)
    BuildSidebar(map)

  }

}