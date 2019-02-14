import { Legend } from "./legend";

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
      colors:{
        "Not Served": ['#b5dfd1', '#90d1be', '#2cb99a', '#599f8c', '#5d8078', '#4f5c5a'],
        "Served": [ '#8d7355', '#ba864e', '#e89232', '#eda559', '#f5cea4', '#fae4cd']
      }
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

  let summaryContainer = document.querySelector('#gap__results-section')
  summaryContainer.innerHTML = ''
  for (let container in content){
    let section = content[container].create
    section.classList.add('map__sidebar-summaryContent')
    section.id = container
    let insert = ''
    switch(container){
      case 'legend':
        new Legend(summaryContainer)
        break;
      case 'summary':
        insert = CreateSummary(content.summary)
        break;
      case 'results':
        insert = CreateViz(content.results)
        break;
      default:
        return 'error'
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