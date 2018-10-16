import '../../../css/pages/accessibility/legend.css'

const BuildLegend = () =>{
  let legend = document.createElement('div')
  legend.classList.add('accessibility-legend')
  legend.innerHTML = `
  <h2>Legend</h2>
  <div class="accessibility__legend-content" id="transit-stations">
    <table class="accessibility__legend-section">
      <tr class="accessibility__legend-row">
        <td class="station-icon" id="station-no"></td><td class="legend-label">No Current or Programmed Access</td>
      </tr>
      <tr class="accessibility__legend-row">
        <td class="station-icon" id="station-yes"></td><td class="legend-label">Wheelchair Accessible</td>
      </tr>
      <tr class="accessibility__legend-row">
        <td class="station-icon" id="station-future"></td><td class="legend-label">Programmed Improvement</td></td>
      </tr>
    </table>
  </div>
  <div class="accessibility__legend-content" id="transit-line">
      <div class="legend__lines-row">
        <hr style="background-color: #004d6e"></td><div class="legend-label">AMTRAK</div>
      </div>
      <div class="legend__lines-row">
        <hr style="background-color: #f18541"></td><div class="legend-label">NJ Transit</div>
      </div>
      <div class="legend__lines-row">
        <hr style="background-color: #ffc424"></td><div class="legend-label">NJ Transit Light Rail</div>
      </div>
      <div class="legend__lines-row">
        <hr style="background-color: #ed164b"></td><div class="legend-label">PATCO</div>
      </div>
      <div class="legend__lines-row">
        <hr style="background-color: #9e3e97"></td><div class="legend-label">Rapid Transit</div>
      </div>
      <div class="legend__lines-row">
        <hr style="background-color: #487997"></td><div class="legend-label">Regional Rail</div>
      </div>
      <div class="legend__lines-row">
        <hr style="background-color: #f58221"></td><div class="legend-label">Subway</div>
      </div>
      <div class="legend__lines-row">
        <hr style="background-color: #067dc1"><div class="legend-label">Subway - Elevated</div>
      </div>
      <div class="legend__lines-row">
        <hr style="background-color: #529442"><div class="legend-label">Surface Trolley</div>
      </div>
  </div>
  <div class="accessibility__legend-content" id="zones">
    <span class="legend-descriptor">Number of Reachable Destinations</span>
    <table class="accessibility__legend-section">
      <tr class="accessibility__legend-row">
        <td class="legend__row-label">Few</td>
        <td class="accessibility__legend-zoneBox"></td>
        <td class="accessibility__legend-zoneBox"></td>
        <td class="accessibility__legend-zoneBox"></td>
        <td class="accessibility__legend-zoneBox"></td>
        <td class="legend__row-label">Many</td>
      </tr>
    </table>
  </div>
  `
  document.querySelector('.accessibility-text').appendChild(legend)

  
}

class Legend{
  constructor(props){
    this.render()
  }

  render(){
    BuildLegend()
  }

}

export { Legend }