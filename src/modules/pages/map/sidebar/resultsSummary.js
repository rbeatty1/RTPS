import { Legend } from "./legend";

/*
  CreateSummary(data)
  @purpose: Build summary text on query return
  @params:
    data: Summary data return upon query completion
  returns HTML string populated with appropriate summary values
*/
const CreateSummary = (data, score) =>{

  // data already HAS a municipality field. 
  //console.log('data is ', data)
  
  data.direction == ''
  // do da grammar
  // already doing a type check here, so it can be handled here but the data needs to get got too
  // none of the summaryData comes from any back end stuff, so @todo look into when/where the data is loaded and hope it's already there
  let insert, muniBonus;

  if(data.type === 'municipality'){
    insert = `the selected area — <strong>${document.querySelector(`option[value='${data.location}']`).innerText}</strong>`
    muniBonus = `<p>Average daily total demand for travel <strong>${data.direction} ${document.querySelector(`option[value='${data.location}']`).innerText}: <em>${score} </em></strong> trips per day.</p><small><em>Source: DVRPC TIM 2.3, base year 2015</em></small>` 
  }else{
    insert = 'the selected area'
  }
  let output = `The resulting map shows the average network gap score for connections <strong>${data.direction}</strong> ${insert}. Only <abbr class="map__abbr" title="Traffic Analysis Zone">TAZ</abbr>s with substantial demand <strong>${data.direction} the selected area</strong> are being displayed, a total of <strong>${data.count} <abbr class="map__abbr" title="Traffic Analysis Zone">TAZ</abbr>s</strong>. The darker colors indicate higher priority transit gaps in relation to ${insert}.`
  
  if(muniBonus) output += muniBonus

  return output
}


/*
  BuildSummary(props)
  @purpose: Build summary section 
  @params:
    props: return from query.

  NOTE: I don't know a component for this is totally necessary?? the legend has moved out of here, so that's that. Right now there's no data viz element but that could be incorporated
  later on.
*/
const BuildSummary = (props) => {
  const count = Object.keys(props.data).length
  const queryData = props.queryData

  console.log('score is ', props.demandScore)

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
      direction: queryData.direction.split(' ')[0].toLowerCase(),
      location: queryData.selection,
      count,
      type: queryData.type
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
        insert = CreateSummary(content.summary, props.demandScore)
        break;
      default:
        return 'error'
    }
    section.innerHTML = insert
    summaryContainer.appendChild(section)
  }
}

export class ResultsSummary{
  constructor(input, output, totalDemand){
    this.props = {
      queryData: input,
      data: output,
      demandScore: totalDemand
    }
    this.render()
  }

  render(){
    BuildSummary(this.props)
  }
}