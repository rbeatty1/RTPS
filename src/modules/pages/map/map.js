import '../../../css/pages/map/map.css'
import { geography } from './sidebar/queryInput/queryInput.js'
import { layers } from './map_styles/styles.js'
import { Sidebar } from "./sidebar/sidebar.js"
import { ResultsSummary } from './sidebar/resultsSummary';

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
        zoom: extent.zoom,
        hash: true
    })
    return map
}

/* LoadLayers(map, layers) -- rbeatty
    @desc: Loop through layer reference object and add each source, as well as each variant of the source as defined by set layer definitions 
    @params:
        *!~ map: Map reference object returned by BuildMap():L158
        *!~ layers: Reference object imported from styles.js that contains nested objects that can be used to add sources and layers in a iterative fashion
*/
const LoadLayers = (map, layers) => {
    // loop through layer object
    for (let l in layers) {
        // create mapbox source definition object with vector tile source
        let sourceDef = {
            type: layers[l].type,
            url: layers[l].source
        }

        map.addSource(l, sourceDef)

        // iterate through each source's style and create mapbox layer definition object
        for (let s in layers[l].style) {
            let style = layers[l].style[s]
            let layerDef = {
                "id": `${l}-${s}`,
                "type": style.type,
                "source": l,
                "source-layer": style.layer,
                "paint": style.paint,
                "interactive": true
            }
            !style.visibility ? null : layerDef["layout"] = {visibility: style.visibility}
            !style.filter ? null : layerDef["filter"] = style.filter
            map.addLayer(layerDef, style.placement)
        }
    }
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
    data.forEach(item => {
        if (!helper.check[item.no]) {
            // create fill expression item for zones that don't already have one
            helper.fillExpression.push(item.no, helper.colorScheme[item.rank])
            helper.check[item.no] = item.no
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
            "fill-opacity": 0.5
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
            0: "rgba(255,255,255,0)",
            1: "#7f2704",
            2: "#a63603",
            3: "#d94801",
            4: "#f16913",
            5: "#fd8d3c",
            6: "#fdae6b",
            7: "#fdd0a2"
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
        let processed = ProcessData(rawData, helpers) // process data
        helpers.analysisLayers = processed // return
        new ResultsSummary(input, rawData)
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
        map.setFilter("boundaries-hover", ["==", "name", e.features[0].properties.name])
    })
    // leave hover => no fill
    map.on('mouseleave', "muniReference-base", (e) => {
        map.setFilter("boundaries-hover", ["==", "name", ""]);
    })
    // click => yellow fill
    map.on('click', "muniReference-base", (e) => {
        let muni = e.features[0].properties.name
        document.querySelector('#muni').value = muni
        geography.selection = muni
        muni ? map.setFilter('boundaries-click', ['==', 'name', muni]) : null
        let buttons = document.querySelectorAll('.input__query-button')
        for (let btn of buttons){
            btn.classList.contains('active') ? null : btn.classList.add('active')
        }
        document.querySelector('.sidebar__input-dropdowns').setAttribute('data-selection', muni)
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
                map.setFilter('boundaries-muni', ['==', 'name', geography.selection])
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
        let muni = e.target.value
        map.getLayer('boundaries-click') ? map.setFilter('boundaries-click', ['==', 'name', muni]) : null
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