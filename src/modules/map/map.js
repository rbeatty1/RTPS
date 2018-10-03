import '../../css/map/map.css'
import { geography } from '../header/queryInput/queryInput'
import {layers} from './map_styles/styles.js'

/* BuildMap() -- rbeatty
    @desc: Build the map that the page lands on
    @params:
        NONE
    @returns: returns a map reference object that can be used throughout component
*/
const BuildMap = ()=>{
    // grab/create relevant HTML elements
    const appBody = document.querySelector('#app'),
        mapBody = document.createElement('div')
    mapBody.className = "map__container"
    appBody.appendChild(mapBody);
    mapboxgl.accessToken = 'pk.eyJ1IjoiYmVhdHR5cmUxIiwiYSI6ImNqOGFpY3o0cTAzcXoycXE4ZTg3d3g5ZGUifQ.VHOvVoTgZ5cRko0NanhtwA';
    // initiate map
    let map = new mapboxgl.Map({
        container: mapBody,
        style: 'mapbox://styles/beattyre1/cjdbtddl12scq2st5zybjm8r6',
        center: [-75.148, 40.018],
        zoom: 8.5,
        hash : true
    })
    return map
}

/* LoadLayers(map, layers) -- rbeatty
    @desc: Loop through layer reference object and add each source, as well as each variant of the source as defined by set layer definitions 
    @params:
        *!~ map: Map reference object returned by BuildMap():L158
        *!~ layers: Reference object imported from styles.js that contains nested objects that can be used to add sources and layers in a iterative fashion
*/
const LoadLayers = (map, layers)=>{
    // loop through layer object
    for (let l in layers){
        // create mapbox source definition object with vector tile source
        let sourceDef = {
            type: layers[l].type,
            url: layers[l].source
        }

        map.addSource(l, sourceDef)
        
        // iterate through each source's style and create mapbox layer definition object
        for (let s in layers[l].style){
            let style = layers[l].style[s]
            let layerDef = {
                "id": `${l}-${s}`,
                "type": style.type,
                "source": l,
                "source-layer": style.layer,
                "paint": style.paint,
                "visibility": style.visibility ? "none" : "visibile",
                "interactive": true
            }
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
const zoneSelection = (target, output) =>{
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
const ProcessData = (data, helper) =>{
    // iterate through json returned by API call
    data.forEach(item=>{
        if (!helper.check[item.no]){
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
        "paint":{
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
const PerformQuery = async input =>{
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
    let fetchData = input.type === 'zone' && input.direction? await fetch(`http://localhost:8000/zonequery?zones=[${input.selection}]&direction=${input.direction}`) : console.log('naw')
    if (fetchData.ok){
        let rawData = await fetchData.json()
        let processed = ProcessData(rawData, helpers) // process data
       helpers.analysisLayers = processed // return
    }
    return helpers.analysisLayers
}

/* ClearQuery(map) -- rbeatty
    @desc: Return map to base state and remove any zone selections
    @params:
        *!~ map: Map reference object returned by BuildMap():L158
    @returns: NONE
*/
const ClearQuery = map=>{

    // reset zone selection
    map.setFilter('zones-clickFill', ["==", "no", ""])
    map.setPaintProperty('zones-clickFill', "fill-color", "#d8c72e")
    map.setPaintProperty('zones-clickFill', "fill-outline-color", "#f00")

    // remove analysis layer
    if (map.getLayer('zones-analysis')){
        map.removeLayer('zones-analysis')
    }
}

/* AddListeners(map) -- rbeatty
    @desc: Add collection of listeners for the map for interactivity
    @params:
        *!~ map: Map reference object returned by BuildMap():L158
    @returns: NONE
*/
const AddListeners = map => {
    // hover => green fill
    map.on('mousemove', "zones-reference", (e)=>{
        map.setFilter("zones-hoverFill", ["==", "no", e.features[0].properties.no])
    })
    // leave hover => no fill
    map.on('mouseleave', "zones-reference", (e)=>{
        map.setFilter("zones-hoverFill", ["==", "no", ""]);
    })

    // click => yellow fill
    map.on('click', "zones-reference", (e)=>{
        if (geography && geography.type == 'zone'){
            var filtered = zoneSelection(e, geography)
            filtered.length != 0 ? map.setFilter('zones-clickFill', ['match', ['get', 'no'], filtered, true, false]) : map.setFilter('zones-clickFill', ['==', 'no', '']);
        }
        else{ alert('Select a geography before continuing!') }
    })

    // perform query
    document.querySelector('.input__query-execute').addEventListener('click',()=>{
        // if exists, remove
        if (map.getLayer('zones-analysis')){
            map.removeLayer('zones-analysis')
        }
        PerformQuery(geography).then(x=>{
            map.addLayer(x, "zones-base")

            // resymbolize other layers for aesthetics
            map.setPaintProperty("zones-clickFill", "fill-color", "#06bf9c")
            map.setPaintProperty('zones-clickFill', 'fill-outline-color', "#d8c72e")
        })
    })

    // clear query
    document.querySelector('.input__query-clear').addEventListener('click', ()=>{
        geography.type == 'zone' ? geography.selection = new Array() : undefined
        ClearQuery(map)
    })
}

class Map{
    constructor(){
        this.render()
    }
    
    render(){
        let map = BuildMap()

        // trick canvas into filling the entire container because it won't initially for whatever stupid reasion
        map.on('load', _=>{
            map.resize();

            // add navigation control 
            const nav = new mapboxgl.NavigationControl();
            map.addControl(nav, 'top-left');

            LoadLayers(map, layers)
            AddListeners(map)
        });
    }
}


export {Map};