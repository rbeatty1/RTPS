import "../../../css/pages/frequency/frequency.css"
import { LoadLayers } from "../../../utils/loadMapLayers";
import { styles } from "../map/map_styles/frequency";



const contentRef = {
  overview : {
    active: true,
    title: 'Overview',
    scenario: undefined,
    content: {
      map: {
        source: 'transit',
        layer: 'overview'
      },
      table: false,
      text: 'What happens if we double transit service frequency for all lines?<br>How does the doubled service frequency scenario compare to the existing scenario?</br></br>The answers below help us understand where potential latent demand for higher frequency transit exists. Want to know how your neighborhood or favorite routes might respond? Go ahead and explore!'
    }
  },
  existing : {
    active: false,
    title: 'AM Peak Frequency',
    scenario: 'Existing',
    content: {
      map: {
        source: 'transit',
        layer: 'existing',
        filter: undefined,
        scheme: ['#A63603', '#E6550D', '#FD8D3C', '#FDAE6B', '#FDD0A2', '#FEEDDE']
      },
      table: false,
      text: 'This map depicts the current AM peak transit frequency (base scenario). Darker colors represent transit routes with more frequenct service. When clicking lines on the map, the pop-up will show the peak frequency as well as the mid-day frequency.'
    }
  },
  transitChange: {
    active: false,
    title: 'Changes in Transit Activity',
    scenario: "Doubled Frequency",
    content: {
      map: {
        source: 'taz',
        layer: 'transit',
        filter: ['>', 'tActual', 1],
        scheme: ['#D9F0A3', '#ADDD8E', '#78C679', '#31A354', '#006837']
      },
      table: {
        labels : {
          rows: {
            NJ: ['Burlington', 'Camden', 'Gloucester', 'Mercer'],
            PA: ['Bucks', 'Chester', 'Delaware','Montgomery','Philadelphia']
          },
          columns: ['Geography','Base', '2x Freq.', 'Difference', '% Diff']
        },
        datasets : {
          NJ: { 
            Burlington: [2571, 3932, 1361, 52.94],
            Camden: [20642, 25346, 4704, 22.79],
            Gloucester:[2091, 3476, 1385, 66.25],
            Mercer: [22289, 27509, 5220, 23.42]
          },
          PA: {
            Bucks: [5307, 8287, 2980, 56.15],
            Chester: [4402, 6998, 2596, 58.98],
            Delaware: [34871, 42335, 7465, 21.41],
            Montgomery: [29478, 39023, 9545, 32.38],
            Philadelphia: [561976, 596792, 34816, 6.20]
          }
        },
        summaries : {
          NJ: {
            temp: [[],[],[]],
            final: []
          },
          PA: {
            temp: [[],[],[]],
            final: []
          }
        }
      },
      text: 'This change in zonal transit activity map shows traffic analysis zones (TAZs) symbolized using the change in public transit activity in that zone under our doubled frequencies scenario. Transit acivity refers to the average number of passengers entering and leaving the zone via public transit within 24 hours. The darker the color, the greater the increase in transit activity when all frequencies are doubled.'
    }
  },
  autoChange: {
    active: false,
    title: 'Reductions in Car Trips',
    scenario: "Doubled Frequency",
    content: {
      map: {
        source: 'taz',
        layer: 'vehicles',
        filter: ['<', 'vActual', -1],
        scheme: ['#FDD0A2', '#FDAE6B', '#FD8D3C', '#E6550D', '#A63603']
      },
      table: {
        labels : {
          rows: {
            NJ: ['Burlington', 'Camden', 'Gloucester', 'Mercer'],
            PA: ['Bucks', 'Chester', 'Delaware','Montgomery','Philadelphia']
          },
          columns: ['Geography','Base', '2x Freq.', 'Difference', '% Diff']
        },
        datasets : {
          NJ: { 
            Burlington: [1087429, 1086168, -1261, -0.12],
            Camden: [1530889, 1527518, -3371, -0.22],
            Gloucester:[802337, 801037, -1300, -0.16],
            Mercer: [1320146, 1316283, -3863, -0.29]
          },
          PA: {
            Bucks: [1503945,1501437, -2508, -0.17],
            Chester: [1284892, 1282801, -2091, -0.16],
            Delaware: [1179321, 1170955, -5367, -0.46],
            Montgomery: [2057847, 2050725, -7122, -0.35],
            Philadelphia: [2859025, 2835172, -23854, -0.83]
          }
        },
        summaries : {
          NJ: {
            temp: [[],[],[]],
            final: []
          },
          PA: {
            temp: [[],[],[]],
            final: []
          }
        }
      },
      text: 'This change in zonal vehicle activity shows TAZs symbolized using the change in passenger vehicle activity entering and leaving the zone in 24 hours. The darker the color, the greater the decrease in vehicular activity when public transit frequencies are doubled.'
    }
  },
  railLineChange: {
    active: false,
    title: 'Changes in Rail Ridership',
    scenario: "Doubled Frequency",
    content: {
      map: {
        source: 'transit',
        layer: 'railLineChange',
        scheme: ['#FDD0A2', '#FDAE6B', '#FD8D3C', '#E6550D', '#A63603']
      },
      table: false,
      text: 'This map shows passenger rail lines symbolized by the estimated change in ridership if frequencies of all transit lines are doubled. Line color represents the absolute change in ridership, while the line weight represents the percent change. For example, a dark, thin line would imply a line where a large absolute increase in ridership is expected, but the change is relatively small due to high base ridership on the line. Nominal declines in forecasted ridership for a handful of lines reflect cases where passengers may be attracted to other (newly frequent) options, or simply variations in forecast results where percent changes are small.'
    }
  },
  busLineAbsChange: {
    active: false,
    title: 'Absolute Change in Bus Ridership',
    scenario: 'Doubled Frequency',
    content: {
      map: {
        source: 'transit',
        layer: 'busLineAbsChange',
        scheme: ['#FDD0A2', '#FDAE6B', '#FD8D3C', '#E6550D', '#A63603']
      },
      table: false,
      text: 'This map shows the 25 bus routes with the greatest expected absolute increase in dailyu ridership between the existing and doubled frequency scenarios. Bus ridership refers to the number of passengers using that bus route on an average weekday. The darker the blue color, the greater the absolute increase in ridership.'
    }
  },
  busLinePerChange: {
    active: false,
    title: 'Percent Change in Bus Ridership',
    scenario: 'Doubled Frequency',
    content: {
      map: {
        source: 'transit',
        layer: 'busLinePerChange',
        scheme: ['#FDD0A2', '#FDAE6B', '#FD8D3C', '#E6550D', '#A63603']
      },
      table: false,
      text: 'This map shows the 25 bus routes with the largest percent increase in daily ridership between the existing and doubled frequency scenarios. It is important to keep in mind that percent change is sometimes deceiving when base ridership is very low, making a small incrase appear as a substantial change. Only those bus routes with an estimated base scenario ridership of at least 100 are included. Many of the routes in this map are in suburban areas where base frequencies tend to be lower. The darker the blue color, the greater the percent increase in forecast ridership fi frequency is doubled.'
    }
  },
  mapData: {
    zones: undefined,
    rail: undefined,
    bus: undefined
  }
}

const ResymbolizeFeatureLayer = (map,section) =>{
  let info = section.content.map
  if (info && map.getLayer(`${info.source}-${info.layer}`)){
    map.setLayoutProperty(`${info.source}-${info.layer}`, "visibility", "visible")
    info.filter ? map.setFilter(`${info.source}-${info.layer}`, info.filter) : null
  }
}
const HideFeatureLayer = (map, section) =>{
  let info = section.content.map
  map.getLayer(`${info.source}-${info.layer}`) ? map.setLayoutProperty(`${info.source}-${info.layer}`, 'visibility', 'none') : null
}
const CreateTable = data =>{
  const FormatNumber = num =>  num.toString().indexOf('.') != -1 ? num+'%' : num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') 
  const CreateHeaderRow = (table, labels) =>{
    let header = document.createElement('thead')
    header.classList.add('frequency__storySection-tableHeader')
    labels.columns.map((col, index)=>{
      let label = document.createElement('td')
      label.innerText = col
      header.appendChild(label)
    })
    return table.appendChild(header)
  }
  const CreateCountyContent = (state, county) =>{
    let dataRow = document.createElement('tr'),
      cell = document.createElement('td')
    
    cell.innerText = county
    dataRow.appendChild(cell)    
    datasets[state][county].map((data,index)=>{
      let dataCell = document.createElement('td')
      summaries[state].temp[index] ? summaries[state].temp[index].push(data) : null
      dataCell.innerText = FormatNumber(data)
      dataRow.appendChild(dataCell)
    })
    return dataRow
  }
  const CreateSummaryContent = (state, dataset) =>{
    let dataRow = document.createElement('tr')
    dataRow.classList.add('summary')
    let cell = document.createElement('td')
    cell.innerText = state
    dataRow.appendChild(cell)
    dataset.map(data=> {
      let dataCell = document.createElement('td')
      dataCell.innerText = FormatNumber(data)
      dataRow.appendChild(dataCell)
    })
    return dataRow
  }

  let labels = data.labels,
    datasets = data.datasets,
    summaries = data.summaries,
    table = document.createElement('table')
  
  table.classList.add('frequency__storySection-table')
  CreateHeaderRow(table, labels)

  for (let set in labels.rows){
    let state = set,
        counties = labels.rows[set]
    if (summaries[state].final.length != 0) {
      summaries[state] = {
        temp: [[],[],[]],
        final: []
      }
    }
    counties.map(county=>{
      table.appendChild(CreateCountyContent(state, county))
    })
    summaries[state].temp.map(col=>{
      summaries[state].final.push(col.reduce((num, value)=> num + value, 0))
    })
    summaries[state].final.push((((summaries[state].final[2]/summaries[state].final[0])*100)).toFixed(2))
    table.appendChild(CreateSummaryContent(state, summaries[state].final))
  }
  return table
}
const BuildContent = (content, key, component) =>{
  const BuildScene = element=>{
    let link = document.querySelector(`#${element.id}-link`)
    new ScrollMagic.Scene({ triggerElement: element, duration: element.getBoundingClientRect().height+20 })
      .on('enter', e => {
        if (contentRef[element.id].content.map) ResymbolizeFeatureLayer(component.map, contentRef[element.id])
        link.classList.add('active');
        element.classList.add('active');
      })
      .on('leave', e => {
        if (contentRef[element.id].content.map) HideFeatureLayer(component.map, contentRef[element.id])
        link.classList.remove('active');
        element.classList.remove('active');
      })
      .addTo(component.scroll);
  }
  let masterContainer = document.querySelector('.frequency__content-story')
  let section = document.createElement('div')
  section.classList.add('frequency__story-section')
  if (contentRef[key].active) section.classList.add('active')
  switch(key){
    case 'overview':
      section.innerHTML =  `
      <div class="frequency__storySection-title">
        <div class="frequency__storySection-TitleDivider">
          <hr class="frequency__storySection-divider"><p class="frequency__storySection-SectionTitle">${contentRef[key].title}</p><hr class="frequency__storySection-divider">
        </div>
      </div>
      <div class="frequency__storySection-content"><p class="frequency__storySection-text">${content.text}</p></div>
      `
      break;
    default:
      section.innerHTML = `
      <div class="frequency__storySection-title">
        <p class="frequency__storySection-SectionTitle">${contentRef[key].title}</p>
        <div class="frequency__storySection-TitleDivider">
          <hr class="frequency__storySection-divider"><p class="frequency__storySection-ScenarioTitle">${contentRef[key].scenario}</p><hr class="frequency__storySection-divider">
        </div>
      </div>
      <div class="frequency__storySection-content"><p class="frequency__storySection-text">${content.text}</p></div>
      `
      break;
  }
  section.id = key
  if (content.table) { section.querySelector('.frequency__storySection-content').appendChild(CreateTable(content.table)) }
  section.style.height = masterContainer.getBoundingClientRect().height/2
  masterContainer.appendChild(section)
  BuildScene(section)
}
const BuildNav = (component, sections) =>{
  const nav = document.querySelector('.frequency__nav-container')
  let cnt = 1
  for (let i in sections){
    if (i != 'mapData'){
      let sectionLink = document.createElement('div'), 
        tooltip = document.createElement('div')
      tooltip.classList.add('tooltip')
      sectionLink.innerHTML = `<p>${cnt}</p>`
      sectionLink.classList.add('frequency__nav-link')
        
      tooltip.innerText = sections[i].title
      sectionLink.appendChild(tooltip)
      sectionLink.id = i+'-link'
      sections[i].active ? sectionLink.classList.add('active') : null
      sectionLink.addEventListener('click', e=>{
        for (let node of document.querySelectorAll('.frequency__story-section')){ 
          if (node.id == i){
            sections[i].active = true
            node.classList.add('active')
          }
          else{
            sections[node.id].active = false
            node.classList.remove('active')
          }
          component.scroll.scrollTo(`#${i}`)
        }
        let nodes = document.querySelectorAll(`.${sectionLink.classList[0]}`)
        for (let node of nodes){ node.classList.contains('active') ? node.classList.remove('active') : null }
        sectionLink.classList.toggle('active')
      })
      sectionLink.addEventListener('mouseenter', e=>{
        let target = e.target
        if (target.classList.contains('frequency__nav-link')){
          target.children[1].classList.contains('active') ? null : target.children[1].classList.add('active')
        }
      })
      sectionLink.addEventListener('mouseleave', e=>{
        let target = e.target
        if (target.classList.contains('frequency__nav-link')){
          target.children[1].classList.contains('active') ? target.children[1].classList.remove('active') : null
        }
      })
      nav.appendChild(sectionLink)
      BuildContent(sections[i].content, i, component)
      cnt += 1
    }
    document.querySelector('.frequency__content-story').addEventListener('scroll', e=>{
    })
  }
}
const LoadExisting = map =>{
  const OverviewColor = (data, target, line) =>{
    if (data < 15) target.push(line, '#E600A9')
    else if (data >= 15 && data < 30) target.push(line, '#028985')
    else if (data >= 30 && data < 60) target.push(line, '#999999')
    else target.push(line, '#ccc')
  }
  const ExistingColor = (data, target, line) =>{
    if (data < 21) target.push(line, '#EEE2CF')
    else if (data >= 21 && data < 45) target.push(line, '#AABDB5')
    else target.push(line, '#3B758C')
  }
  fetch('http://localhost:8000/api/rtps/frequency?transit')
  .then(response=> response.ok ? response.json() : console.error('error will robinson'))
  .then(existing=>{
    let layerDef = [
      {
        id: 'transit-overview',
        source: 'transit',
        'source-layer': 'transit_lines',
        type: 'line',
        paint: {
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            7, 1,
            13, 3
          ],
          'line-color': [
            'match',
            ['get', 'linename']
          ]
        },
        layout: {visibility : 'visible'}
      },
      {
        id: 'transit-existing',
        source : 'transit',
        type: 'line',
        'source-layer': 'transit_lines',
        paint: {
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            7, 1,
            13, 3
          ],
          'line-color': [
            'match',
            ['get', 'linename']
          ]
        },
        layout: {visibility : 'none'}
      }
    ]
    for (let line in existing.cargo){
      OverviewColor(existing.cargo[line].midday, layerDef[0].paint["line-color"], line)
      ExistingColor(existing.cargo[line].midday, layerDef[1].paint["line-color"], line)
    }
    layerDef[0].paint["line-color"].push('rgba(255,255,255,0)')
    layerDef[1].paint["line-color"].push('rgba(255,255,255,0)')
    layerDef.map(layer=>{
      map.addLayer(layer, 'base-hwyLabels')
    })
  })
}
const LoadTaz = map =>{
  fetch('https://services1.arcgis.com/LWtWv6q6BJyKidj8/arcgis/rest/services/TAZ/FeatureServer/0/query?where=1%3D1&outFields=TAZN&geometryPrecision=4&outSR=4326&returnExceededLimitFeatures=true&f=pgeojson')
  .then(response=>  response.ok ? response.json(): console.error('nah dawg'))
  .then(taz=>{
    fetch('http://localhost:8000/api/rtps/frequency?zone')
    .then(response=> response.ok ? response.json() : console.error('error will robinson'))
    .then(apiJson=>{
      taz.features.map(zone=>{
        if (apiJson.cargo[zone.properties.TAZN.toString()]){
          zone.properties['tActual'] = apiJson.cargo[zone.properties.TAZN.toString()].tActual 
          zone.properties['vActual'] = apiJson.cargo[zone.properties.TAZN.toString()].vActual
        }
      })
      let sourceDef = {
        data: taz,
        type: 'geojson'
      }
      map.addSource('taz', sourceDef)
  
      let layerDefs = [
        {
          id: 'taz-transit',
          source: 'taz',
          type: 'fill',
          paint: {
            'fill-color': [
              'step',
              ['get', 'tActual'],
              'rgba(255,255,255,0)',
              37, '#D9F0A3',
              71, '#ADDD8E',
              123, '#78C679',
              222, '#31A354',
              419, '#006837'
            ],
            'fill-opacity': .75
          },
          layout: {
            visibility: 'none'
          }
        },
        {
          id: 'taz-vehicles',
          source: 'taz',
          type: 'fill',
          paint: {
            'fill-color': [
              'step',
              ['get', 'vActual'],
              '#A63603',
              -197, '#E6550D',
              -90, '#FD8D3C',
              -45.1, '#FDAE6B',
              -23.4, '#FDD0A2',
              -1, 'rgba(255,255,255,0)'
            ],
            'fill-opacity': .75
          },
          layout: {
            visibility: 'none'
          }
        }
      ]
      layerDefs.map(layer=>{
        map.addLayer(layer, 'base-muniOutline')
      })
    })
  })
}
const LoadBus = map =>{
  fetch('http://localhost:8000/api/rtps/frequency?bus')
  .then(response=> response.ok ? response.json() : console.error('error, will robinson'))
  .then(bus=>{
    let busLayers = [
      {
        id: 'transit-busLineAbsChange',
        source: "transit",
        'source-layer' : 'transit_lines',
        type: 'line',
        paint: {
          'line-width' : 1,
          'line-color': [
            'match',
            ['get', 'linename']
          ]
        },
        layout: { visibility: 'none'}
      },
      {
        id: 'transit-busLinePerChange',
        source: "transit",
        'source-layer' : 'transit_lines',
        type: 'line',
        paint: {
          'line-width' : 1,
          'line-color': [
            'match',
            ['get', 'linename']
          ]
        },
        layout: { visibility: 'none'}
      }
    ]
    contentRef.mapData.bus = { absolute: [], percent: [] }
    bus.cargo.forEach(route=>{
      contentRef.mapData.bus.absolute.push(route)
      contentRef.mapData.bus.percent.push(route)
    })
    contentRef.mapData.bus.absolute.sort((a,b)=> b.AllBusAbsolute - a.AllBusAbsolute )
    contentRef.mapData.bus.percent.sort((a,b)=> b.AllBusPercent - a.AllBusPercent )
    contentRef.mapData.bus.absolute.map((value, index)=>{
      if(index<25){
        if (value.AllBusAbsolute < 1400) busLayers[0].paint['line-color'].push(value.linename, "#E6EECF")
        else if (value.AllBusAbsolute <= 1600 && value.AllBusAbsolute > 1400) busLayers[0].paint['line-color'].push(value.linename, "#9BC4C1")
        else if (value.AllBusAbsolute <= 1800 && value.AllBusAbsolute > 1600) busLayers[0].paint['line-color'].push(value.linename, "#69A8B7")
        else if (value.AllBusAbsolute <= 2200 && value.AllBusAbsolute > 1800) busLayers[0].paint['line-color'].push(value.linename, "#4B7E98")
        else if (value.AllBusAbsolute > 2200) busLayers[0].paint['line-color'].push(value.linename, "#2E557A")
      }
    })
    contentRef.mapData.bus.percent.map((value, index)=>{
      if(index<25){
        if (value.AllBusPercent <= 85) busLayers[1].paint['line-color'].push(value.linename, "#E6EECF")
        else if (value.AllBusPercent <= 100 && value.AllBusPercent > 85) busLayers[1].paint['line-color'].push(value.linename, "#9BC4C1")
        else if (value.AllBusPercent <= 130 && value.AllBusPercent > 100) busLayers[1].paint['line-color'].push(value.linename, "#69A8B7")
        else if (value.AllBusPercent > 130) busLayers[1].paint['line-color'].push(value.linename, "#3D6A89")
      }
    })
    for (let layer in busLayers){
      busLayers[layer].paint['line-color'].push('rgba(255,255,255,0)')
    }
    busLayers.map(layer=>{
      map.addLayer(layer, 'base-hwyLabels')
    })
  })
}
const LoadRail = map =>{
  const LineWidth = (data, target, name) =>{
    if (data < 0) target.push(name, 1)
    else if (data >= 0 && data < 30) target.push(name, 1.5)
    else if (data >= 30 && data < 50) target.push(name, 2.5)
    else if (data >= 50 && data < 80) target.push(name, 4)
    else if (data >= 80 && data < 100) target.push(name, 6)
    else if (data >=100) target.push(name, 8)
  }
  const LineColor = (data, target, name) =>{
    if (data < -100 ) target.push(name, '#de425b')
    else if (data >= -100 && data < 0) target.push(name, '#f09fa2')
    else if (data >= 0 && data < 1000) target.push(name, '#d8c72e')
    else if (data >=1000 && data < 5000) target.push(name, '#8cbcac')
    else if (data >= 5000) target.push(name, '#488f31')
  }
  fetch('http://localhost:8000/api/rtps/frequency?rail')
  .then(response=> response.ok ? response.json() : console.error('error will robinson'))
  .then(rail=>{
    contentRef.mapData.rail = rail
    let layerDef = {
      id: 'transit-railLineChange',
      source: 'transit',
      'source-layer': 'transit_lines',
      type: 'line',
      layout: {visibility: 'none'},
      paint: {
        'line-width' : [
          'match',
          ['get', 'linename']
        ],
        'line-color':  [
          'match',
          ['get', 'linename']
        ],
        'line-opacity': .75
      }
    }
    for (let line in rail.cargo){
      let data = rail.cargo[line]
      LineWidth(data.percent, layerDef.paint["line-width"], line)
      LineColor(data.absolute, layerDef.paint['line-color'], line)
    }
    layerDef.paint['line-width'].push(0)
    layerDef.paint['line-color'].push('rgba(255,255,255,0)')
    map.addLayer(layerDef, 'base-hwyLabels')
  })
}
const BuildMap = container =>{
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
    minZoom: 7,
    hash: true
  })
  map.on('load', ()=>{
    map.addSource('transit', {
      type: 'vector',
      url: 'https://tiles.dvrpc.org/data/dvrpc-tim-transit.json'
    })
    map.resize()
    LoadLayers(map, styles)
    LoadExisting(map)
    LoadTaz(map)
    LoadBus(map)
    LoadRail(map)
    map.flyTo({
      center: extent.center,
      zoom: extent.zoom
    })
    // map.scrollZoom.disable();
    map.addControl(new mapboxgl.NavigationControl, "top-right")
  })
  return map
}

export class Frequency{
  constructor(){
    this.render()
  }
  render(){
    document.querySelector('#main').innerHTML = `
    <div id="frequency-page">
      <div class="frequency__nav-container"></div>
      <div class="frequency__content-container">
        <div class="frequency__content-story"></div>
        <div class="frequency__content-map"></div>
      </div>
    </div>
    `
    this.scroll = new ScrollMagic.Controller({
      container: document.querySelector('.frequency__content-story'),
      loglevel: 4
    });
    BuildNav(this, contentRef)
    this.map = BuildMap(document.querySelector('.frequency__content-map'))
  }
}



