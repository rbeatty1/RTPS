import "../../../css/pages/frequency/frequency.css"



const contentRef = {
  overview : {
    active: true,
    title: 'Overview',
    content: {
      map: false,
      table: false,
      text: 'What happens if we double transit service frequency for all lines?<br>How does the doubled service frequency scenario compare to the existing scenario?</br></br>The answers below help us understand where potential latent demand for higher frequency transit exists. Want to know how your neighborhood or favorite routes might respond? Go ahead and explore!'
    }
  },
  existing : {
    active: false,
    title: 'Existing Transit Scenario: AM Peak Frequency',
    content: {
      map: {
        layers: ['transitLines'],
        filter: undefined,
        scheme: ['#A63603', '#E6550D', '#FD8D3C', '#FDAE6B', '#FDD0A2', '#FEEDDE']
      },
      table: false,
      text: 'this map depicts the current AM peak transit frequency (base scenario). Darker colors represent transit routes with more frequenct service.</br></br>When clicking lines on the map, the pop-up will show the peak frequency as well as the mid-day frequency.'
    }
  },
  transitChange: {
    active: false,
    title: 'Doubled Frequencies Scenario: Changes in Transit Activity',
    content: {
      map: {
        layers: ['zones'],
        filter: 'greater than 1',
        scheme: ['#D9F0A3', '#ADDD8E', '#78C679', '#31A354', '#006837']
      },
      table: {
        labels : {
          rows: {
            NJ: ['Burlington', 'Camden', 'Gloucester', 'Mercer'],
            PA: ['Bucks', 'Chester', 'Delaware','Montgomery','Philadelphia']
          },
          columns: ['Geography','Base Scenario', '2x Transit Frequency', 'Difference', 'Percent Difference']
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
        }
      },
      text: 'This change in zonal transit activity map shows traffic analysis zones (TAZs) symbolized using the change in public transit activity in that zone under our doubled frequencies scenario. Transit acivity refers to the average number of passengers entering and leaving the zone via public transit within 24 hours. The darker the color, the greater the increase in transit activity when all frequencies are doubled.'
    }
  },
  autoChange: {
    active: false,
    title: 'Doubled Frequencies Scenario: Reductions in Car Trips',
    content: {
      map: {
        layers: ['zones'],
        filter: 'greater than 1',
        scheme: ['#FDD0A2', '#FDAE6B', '#FD8D3C', '#E6550D', '#A63603']
      },
      table: {
        labels : {
          rows: {
            NJ: ['Burlington', 'Camden', 'Gloucester', 'Mercer'],
            PA: ['Bucks', 'Chester', 'Delaware','Montgomery','Philadelphia']
          },
          columns: ['Geography','Base Scenario', '2x Transit Frequency', 'Difference', 'Percent Difference']
        },
        datasets : {
          NJ: { 
            Burlington: [1087429, 1086168, 1261, 0.12],
            Camden: [1530889, 1527518, 3371, 0.22],
            Gloucester:[802337, 801037, 1300, 0.16],
            Mercer: [1320146, 1316283, 3863, 0.29]
          },
          PA: {
            Bucks: [1503945,1501437, 2508, 0.17],
            Chester: [1284892, 1282801, 2091, 0.16],
            Delaware: [1179321, 1170955, 5367, 0.46],
            Montgomery: [2057847, 2050725, 7122, 0.35],
            Philadelphia: [2859025, 2835172, 23854, 0.83]
          }
        }
      },
      text: 'This change in zonal vehicle activity shows TAZs symbolized using the change in passenger vehicle activity entering and leaving the zone in 24 hours. The darker the color, the greater the decrease in vehicular activity when public transit frequencies are doubled.'
    }
  }
}

const CreateTable = data =>{
  const FormatNumber = num =>{
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  let labels = data.labels,
    datasets = data.datasets

  let table = document.createElement('table'),
    header = document.createElement('thead')
  labels.columns.map(col=>{
    let label = document.createElement('td')
    label.innerText = col
    header.appendChild(label)
  })
  table.appendChild(header)
  for (let set in labels.rows){
    let state = set,
        counties = labels.rows[set]
    counties.map(county=>{
      let dataRow = document.createElement('tr')
      dataRow.id = county
      let cell = document.createElement('td')
      cell.innerText = county
      dataRow.appendChild(cell)
      datasets[state][county].map(d=>{
        cell = document.createElement('td')
        cell.innerText = FormatNumber(d)
        dataRow.appendChild(cell)
      })
      table.appendChild(dataRow)
    })
  }
  return table
}
const ScrolledIntoView = element =>{
  let rect = element.getBoundingClientRect(),
    top = rect.top,
    height = rect.height,
    el = element.parentNode

  // console.log(top)

  do{
    rect = el.getBoundingClientRect()
    if (!(top <= rect.bottom)) return false
    if ((top+height <= rect.top)) return false
    el = el.parentNode
  }
  while(el != document.body)
  return top <= document.documentElement.clientHeight
}
const AttachEvent = (element, callback) =>{
  if (element.addEventListener) { 
    console.log('addEventListener')
    element.addEventListener("scroll", callback, false) }
  else if(element.AttachEvent) { 
    console.log('AttachEvent')
    element.AttachEvent('onscroll',  callback) }
}

const BuildContent = (content, key) =>{
  let masterContainer = document.querySelector('.frequency__content-story')
  let section = document.createElement('div')
  section.classList.add('frequency__story-section')
  if (contentRef[key].active) section.classList.add('active')
  section.innerHTML = `
  <h2 class="frequency__storySection-title">${contentRef[key].title}</h2>
  <div class="frequency__storySection-content">${content.text}</div>
  `
  section.id = key
  section.style.minHeight = `${masterContainer.clientHeight/2}px`
  if (content.table) { section.querySelector('.frequency__storySection-content').appendChild(CreateTable(content.table)) }
  masterContainer.appendChild(section)
  section.style.height = section.clientHeight+'px'
  // AttachEvent(section, "scroll",  ScrolledIntoView(section))
}


const BuildNav = sections =>{
  const nav = document.querySelector('.frequency__nav-container')
  for (let i in sections){
    let sectionLink = document.createElement('div')
    let title = sections[i].title
    title.indexOf(':') != -1 ? title = title.split(': ')[1] : null
    sectionLink.innerText = title
    sectionLink.classList.add('frequency__nav-link')
    sectionLink.addEventListener('click', e=>{
      for (let node of document.querySelectorAll('.frequency__story-section')){ 
        node.id == i ? node.classList.add('active') : node.classList.remove('active')
        document.querySelector(`#${i}`).scrollIntoView()
      }
      let nodes = document.querySelectorAll(`.${sectionLink.classList[0]}`)
      for (let node of nodes){ node.classList.contains('active') ? node.classList.remove('active') : null }
      sectionLink.classList.toggle('active')
    })
    BuildContent(sections[i].content, i)
    nav.appendChild(sectionLink)
  }
}



export class Frequency{
  constructor(){
    this.render()
  }
  render(){
    console.log('render frequency page')
    document.querySelector('#main').innerHTML = `
    <div id="frequency-page">
      <div class="frequency__nav-container"></div>
      <div class="frequency__content-container">
        <div class="frequency__content-story"></div>
        <div class="frequency__content-map"></div>
      </div>
    </div>
    `
    BuildNav(contentRef)
    // BuildMap(layers)
    // ScrollStory()
  }
}

