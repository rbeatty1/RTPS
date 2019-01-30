
const CreateLegend = data =>{
  let container = document.createElement('div'),
    label = document.createElement('div'),
    legend = document.createElement('table'),
    row = document.createElement('tr')
  let cnt = 0
  data.colors.map(color=>{
    let cell = document.createElement('TD')
    cell.className = 'map__sidebar-legendCell'
    cell.style.backgroundColor = color
    row.appendChild(cell)
  })
  label.classList.add('map__sidebar-legendLabel')
  label.innerHTML = '<h4>Transit Improvement Priority</h4>'
  container.appendChild(label)
  legend.appendChild(row)
  container.appendChild(legend)
  return container.outerHTML

}

const CreateSummary = data =>{
  let insert;
  data.direction == ''
  data.type == 'municipality' ? insert = `the selected area — <span class="map__sidebar-legendEmphasis">${document.querySelector(`option[value='${data.location}']`).innerText}</span>` : insert = 'the selected area'
  return `The results being displayed show the average network gap score for <abbr class="map__abbr" title="Traffic Analysis Zone">TAZ</abbr> connections <span class="map__sidebar-legendEmphasis">${data.direction}</span> ${insert}. Only <abbr class="map__abbr" title="Traffic Analysis Zone">TAZ</abbr>s with demand <span class="map__sidebar-legendEmphasis">${data.direction} the selected area</span> are being displayed, a total of <span class="map__sidebar-legendEmphasis">${data.count}</span>, with darker colors indicating a higher priority for transit connections in relation to ${insert}.`
}

const CreateViz = data =>{
  return '<p>Some distribution visualizations?</br>Total demand summary?</br>The world is our oyster</p>'
}

const BuildSummary = (props) => {
  let content= {
    legend: {
      create: document.createElement('div'),
      colors: ["#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603", "#7f2704"]
    },
    summary: {
      create: document.createElement('div'),
      direction: props.queryData.direction.split(' ')[0].toLowerCase(),
      location: props.queryData.selection,
      count: Object.keys(props.data).length,
      type: props.queryData.type
    },
    results: {
      create: document.createElement('div'),
      stuff: []
    }
  }

  let summaryContainer = document.querySelector('#summary_dropdownContent')
  summaryContainer.innerHTML = ''
  for (let container in content){
    let section = content[container].create
    section.classList.add('map__sidebar-summaryContent')
    section.id = container
    let insert = ''
    switch(container){
      case 'legend':
        insert = CreateLegend(content.legend)
        break;
      case 'summary':
        insert = CreateSummary(content.summary)
        break;
      case 'results':
        insert = CreateViz(content.results)
        break;
      default:
        return 'error'
        break;
    }
    section.innerHTML = insert
    summaryContainer.appendChild(section)
  }
}

export class ResultsSummary{
  constructor(input, output){
    this.props = {
      queryData: input,
      data: output
    }
    this.render()
  }

  render(){
    BuildSummary(this.props)
  }
}