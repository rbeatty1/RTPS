import '../../../css/pages/accessibility/legend.css'

const BuildLegend = () =>{
  let legend = document.createElement('section')
  legend.classList.add('accessibility-legend')
  legend.innerHTML = `
  <h2>Legend</h2>
  <section class="accessibility__legend-content">
    <div class="accessibility__legend-section" id="transit-stations">
      <div class="accessibility__legend-row">
        <div class="station-icon" id="station-no"></div><p class="legend-label">No Current or Programmed Access</p>
      </div>
      <div class="accessibility__legend-row">
        <div class="station-icon" id="station-yes"></div><p class="legend-label">Wheelchair Accessible</p>
      </div>
      <div class="accessibility__legend-row">
        <div  class="station-icon" id="station-future"></div><p class="legend-label">Programmed Improvement</p>
      </div>
    </div>
  </section>
  <section class="accessibility__legend-content" id="zones">
    <span class="legend-descriptor">Number of Reachable Destinations</span>
    <div class="accessibility__legend-section">
      <div class="accessibility__legend-row" id="zones-row">
        <p class="legend__row-label">Few</p>
        <div class="accessibility__legend-zoneBox"></div>
        <div class="accessibility__legend-zoneBox"></div>
        <div class="accessibility__legend-zoneBox"></div>
        <div class="accessibility__legend-zoneBox"></div>
        <p class="legend__row-label">Many</p>
      </div>
    </div>
  </section>
  `
  document.querySelector('.accessibility-text').appendChild(legend)

  
}

class Legend{
  constructor(){
    this.render()
  }

  render(){
    BuildLegend()
  }

}

export { Legend }