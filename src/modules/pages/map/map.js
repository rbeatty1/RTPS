import '../../../css/pages/map/map.css'
import { geography } from './sidebar/queryInput/queryInput.js'
import { layers } from './map_styles/styles.js'
import { Sidebar } from "./sidebar/sidebar.js"
import { ResultsSummary } from './sidebar/resultsSummary';
import { LoadLayers } from '../../../utils/loadMapLayers.js'

const extent = {
  center: [-75.234, 40.061],
  zoom: 8.4
}
/* BuildMap() -- rbeatty
    @desc: Build the map that the page lands on
    @params:
        NONE
    @returns: returns a map reference object that can be used throughout component
*/
const BuildMap = () => {
    // grab/create relevant HTML elements
    const appBody = document.querySelector('.gap'),
        mapBody = document.createElement('div')
    mapBody.className = "map__container"
    appBody.appendChild(mapBody);
    mapboxgl.accessToken = 'pk.eyJ1IjoiYmVhdHR5cmUxIiwiYSI6ImNqOGFpY3o0cTAzcXoycXE4ZTg3d3g5ZGUifQ.VHOvVoTgZ5cRko0NanhtwA';
    // initiate map
    let map = new mapboxgl.Map({
        container: mapBody,
        style: 'mapbox://styles/beattyre1/cjdbtddl12scq2st5zybjm8r6',
        center: extent.center,
        zoom: extent.zoom
    })
    return map
}

/* zoneSelection(target, output) -- rbeatty
    @desc: Grab the zones based on user interaction (click) that should be passed to API query
    @params:
        *!~ target: object return by click event, used to grab the zone number based on user interaction
        *!~ output: object returned by this function that will be based to the API query 
*/
const zoneSelection = (target, output) => {
    let zone = target.features[0].properties['no'],
        selection = output.selection,
        index = selection.indexOf(zone);
    // if value is already in array, remove it, otherwise add it
    index != -1 ? selection.splice(index, 1) : selection.push(zone);
    return selection;
}

/* ProcessData(data, helper) -- rbeatty
    @desc: Iterate through API query return and create mapbox gl layer definition object that will be used to add and style the analysis layer for display 
    @params: 
        *!~ data: raw API json that needs to be cleaned for use
        *!~ helper: Object to be used as a helper reference to build the paint property for the layer definition 
    @returns:
        *!~ layerDef: Layer definition object that contains information specified in mapbox gl documentation that will be passed to map.addLayer() to symbolize analysis
*/
const ProcessData = (data, helper) => {
    // iterate through json returned by API call
    Object.keys(data).forEach(item => {
        if (!helper.check[item]) {
            // create fill expression item for zones that don't already have one
            helper.fillExpression.push(parseInt(item), helper.colorScheme[data[item]])
            helper.check[item] = item
        }
    })
    helper.fillExpression.push("rgba(0,0,0,0)") // default color (nothing)
    let layerDef = {
        "id": `zones-analysis`,
        "type": "fill",
        "source": "zones",
        "source-layer": "tim-zones",
        "paint": {
            "fill-color": helper.fillExpression, // big long match expression
            "fill-opacity": 0.75
        }
    }
    return layerDef
}

/* PerformQuery(selection) -- rbeatty
    @desc: Make API call and parse it into a json that will be processed to create the symbology for the analysis layer
    @params:
        *!~ selection: array containing zone no. to be used in the API call
    @returns:
        *!~ helpers: object that contains layer definition
*/
const PerformQuery = async input => {
    // move helper to ProcessData() function?
    let helpers = {
        colorScheme: {
            1: "rgb(250,228,205)",
            2: "rgb(245,206,164)",
            3: "rgb(237,165,89)",
            4: "rgb(232,146,50)",
            5: "rgb(186,134,78)",
            6: "rgb(141,115,85)",
            7: "rgb(181,223,209)",
            8: "rgb(144,209,190)",
            9: "rgb(44,185,154)",
            10: "rgb(89,159,140)",
            11: "rgb(93,128,120)",
            12: "rgb(79,82,90)",
            13: null
        },
        fillExpression: ["match", ["get", "no"]],
        check: {},
        analysisLayers: {}
    }
    let fetchData = input.type === 'zone' && input.direction ?
        await fetch(`https://a.michaelruane.com/api/rtps/gap?zones=[${input.selection}]&direction=${input.direction}`) :
        await fetch(`https://a.michaelruane.com/api/rtps/gap?muni=${input.selection}&direction=${input.direction}`)
    if (fetchData.ok) {
        let rawData = await fetchData.json()
        if (rawData.status == 'success'){
            let processed = ProcessData(rawData.cargo, helpers) // process data
            helpers.analysisLayers = processed // return
            new ResultsSummary(input, rawData.cargo)
        }
        else{
            alert(`Error! ${rawData.message}`)
        }
    }
    return helpers.analysisLayers
}

/* ClearQuery(map) -- rbeatty
    @desc: Return map to base state and remove any zone selections
    @params:
        *!~ map: Map reference object returned by BuildMap():L158
    @returns: NONE
*/
const ClearQuery = map => {

    // reset zone selection
    map.setFilter('zones-clickFill', ["==", "no", ""])
    map.setPaintProperty('zones-clickFill', "fill-color", "#d8c72e")
    map.setFilter('zones-base', undefined)

    // remove analysis layer
    if (map.getLayer('zones-analysis')) {
        map.removeLayer('zones-analysis')
    }

    let queryContainer = document.querySelector('.sidebar__input-dropdowns')
    // reset query inputs
    for (let key in geography){
        queryContainer.setAttribute(`data-${key}`, '')
        geography[key] = undefined
    }
    // mute colors of buttons
    let buttons = document.querySelectorAll('.input__query-button')
    for (let btn of buttons){
        if (btn.classList.contains('active')){ 
            btn.classList.remove('active')
        } 
    }

    // reset dropdowns to default option
    let inputs = document.querySelectorAll('.input__query-input')
    for (let option of inputs){
        option.selectedIndex = 0
    }

    ['boundaries-muni', 'muniReference-base', 'zoneReference-base', 'zones-base'].forEach(layer=>{
        map.setLayoutProperty(layer, 'visibility', 'none')
    })

    // clear results summary
    document.querySelector('#summary_dropdownContent').innerHTML = 'Please perform an analysis query to populate this area with results.'
}

/* AddListeners(map) -- rbeatty
    @desc: Add collection of listeners for the map for interactivity
    @params:
        *!~ map: Map reference object returned by BuildMap():L158
    @returns: NONE
*/
const AddListeners = map => {

// ZONE LISTENERS
    // hover => green fill
    map.on('mousemove', "zoneReference-base", (e) => {
        map.setFilter("zones-hoverFill", ["==", "no", e.features[0].properties.no])
    })
    // leave hover => no fill
    map.on('mouseleave', "zoneReference-base", (e) => {
        map.setFilter("zones-hoverFill", ["==", "no", ""]);
    })

    // click => yellow fill
    map.on('click', "zoneReference-base", (e) => {
        if (geography && geography.type == 'zone') {
            var filtered = zoneSelection(e, geography)
            filtered.length != 0 ? map.setFilter('zones-clickFill', ['match', ['get', 'no'], filtered, true, false]) : map.setFilter('zones-clickFill', ['==', 'no', '']);
            let buttons = document.querySelectorAll('.input__query-button')
            for (let btn of buttons){
                btn.classList.contains('active') ? null : btn.classList.add('active')
            }
        }
        else { alert('Select a geography before continuing!') }
    })

// MUNI LISTENERS
    // hover => green fill
    map.on('mousemove', "muniReference-base", (e) => {
        map.setFilter("boundaries-hover", ["==", "GEOID", e.features[0].properties.GEOID])
    })
    // leave hover => no fill
    map.on('mouseleave', "muniReference-base", (e) => {
        map.setFilter("boundaries-hover", ["==", "name", ""]);
    })
    // click => yellow fill
    map.on('click', "muniReference-base", (e) => {
        let geoid = e.features[0].properties.GEOID
        document.querySelector('#muni').value = geoid
        geography.selection = geoid
        muni ? map.setFilter('boundaries-click', ['==', 'GEOID', geoid]) : null
        let buttons = document.querySelectorAll('.input__query-button')
        for (let btn of buttons){
            btn.classList.contains('active') ? null : btn.classList.add('active')
        }
        document.querySelector('.sidebar__input-dropdowns').setAttribute('data-selection', geoid)
    })



    // perform query
    document.querySelector('#execute').addEventListener('click', () => {

        // if exists, remove
        if (map.getLayer('zones-analysis')) {
            map.removeLayer('zones-analysis')
        }
        let spinner = document.querySelector(".map__spinner")
        spinner.style.display = 'block';
        PerformQuery(geography).then(x => {
            map.addLayer(x, "zones-base")
            spinner.style.display = 'none'
            
            // resymbolize other layers for aesthetics
            if (geography.type == 'zone'){
                map.setLayoutProperty('zones-hoverFill', 'visibility', 'none')
                map.setPaintProperty("zones-clickFill", "fill-color", "#06bf9c")
                map.setFilter("zones-base", ['==', 'no', ''])
            }
            else{
                map.setLayoutProperty('boundaries-hover', 'visibility', 'none')
                map.setPaintProperty("boundaries-click", "fill-color", "#06bf9c")
                map.setFilter('boundaries-muni', ['==', 'GEOID', geography.selection])
            }
        })
    })

    // clear query
    document.querySelector('#clear').addEventListener('click', () => {
        geography.type == 'zone' ? geography.selection = new Array() : undefined
        if (geography.type == 'municipality') {
            map.setFilter('boundaries-muni', undefined)
            map.setFilter('boundaries-click', ['==', 'name', ''])
            map.setPaintProperty('boundaries-click', 'fill-color', '#d8c72e')
            geography.selection = undefined
        }
        ClearQuery(map)
    })

    document.querySelector('#muni').addEventListener('change', e => {
        let geoid = e.target.value
        map.getLayer('boundaries-click') ? map.setFilter('boundaries-click', ['==', 'GEOID', geoid]) : null
    })

    document.querySelector('#geography').addEventListener('change', e=>{
        let geom = e.target.value
        let layers = {
            zone: ['zoneReference-base','zones-base', 'zones-hoverFill', 'zones-clickFill'],
            muni: ['muniReference-base', 'boundaries-muni', 'boundaries-hover', 'boundaries-click']
        }
        if (geom == 'Zone'){
            layers.zone.map(item=>{
                map.setLayoutProperty(item, 'visibility', 'visible')
            })
            layers.muni.map(item=>{
                map.getLayoutProperty(item, 'visibility') != 'none' ?  map.setLayoutProperty(item, 'visibility', 'none') : null
            })
        }
        else{
            layers.muni.map(item=>{
                map.setLayoutProperty(item, 'visibility', 'visible')
            })
            layers.zone.forEach(item=>{
                map.getLayoutProperty(item, 'visibility') != 'none' ?  map.setLayoutProperty(item, 'visibility', 'none') : null
            })
        }
    })
}

const AddLoadingSpinner = (target) =>{
    let container = document.createElement('div')
    container.classList = 'map__spinner'
    target._container.appendChild(container)
}

class Map {
    constructor() {
        this.render()
    }

    render() {
        let appPage = document.querySelector('#main')
        appPage.innerHTML = '';
        let gap = document.createElement('div')
        gap.classList = 'gap'
        appPage.appendChild(gap)
        let map = BuildMap()
        AddLoadingSpinner(map)
        map.on('load', _ => {
            map.resize();
            map.flyTo({
                center: extent.center,
                zoom: extent.zoom
            })
            // add navigation control 
            new Sidebar();
            map.addControl(new mapboxgl.NavigationControl(), 'top-left');

            LoadLayers(map, layers)
            AddListeners(map)
        });

    }
}


export { Map };