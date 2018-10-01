import '../../css/map/map.css'
import {queryInputs, zoneData} from '../header/queryInput/queryInput'
import {layers} from './map_styles/styles.js'

/* zoneSelection(target, output) -- rbeatty
    @desc: Grab the zones based on user interaction (click) that should be passed to API query
    @params:
        @target: object return by click event, used to grab the zone number based on user interaction
        @output: object returned by this function that will be based to the API query 
    @usage:
        - L89
*/
function zoneSelection(target, output){
    let zone = target.features[0].properties['no'],
        selection = output.zones,
        index = selection.indexOf(zone);
    // if value is already in array, remove it, otherwise add it
    index != -1 ? selection.splice(index, 1) : selection.push(zone);
    return selection;
}

class Map{
    constructor(){
        this.render()
    }

    
    render(){
        const appBody = document.querySelector('#app'),
            mapBody = document.createElement('div'),
            execute = document.querySelector('.input__query-execute');
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
        
        // add navigation control 
        const nav = new mapboxgl.NavigationControl();
        map.addControl(nav, 'top-left');

        // trick canvas into filling the entire container because it won't initially for whatever stupid reasion
        map.on('load', _=>{
            map.resize();

            // add each source
            Object.keys(layers).forEach(key=>{
                let sourceDef = {
                    type: layers[key].type,
                    url: layers[key].source,
                }
                map.addSource(key, sourceDef)
                
                // add base styles for source features
                for (let style in layers[key].style){
                    let layerDef = {
                        "id": `${key}-${style}`,
                        "type": layers[key].style[style].type,
                        "source": key,
                        "paint": layers[key].style[style].paint,
                        "source-layer": layers[key].style[style].layer,
                        "visibility": layers[key].style[style].visibility ? "none" : "visible",
                        "interactive": true
                    }
                    !layers[key].style[style].filter ? null : layerDef["filter"] = layers[key].style[style].filter

                    map.addLayer(layerDef, "admin-2-boundaries")
                }
            })
        });

        // filter functions
            // hover => green fill
        map.on('mousemove', "zones-reference", (e)=>{
            map.setFilter("zones-hoverFill", ["==", "no", e.features[0].properties['no']]);
        })
            // leave hover => no fill
        map.on('mouseleave', "zones-reference", (e)=>{
            map.setFilter("zones-hoverFill", ["==", "no", ""]);
        })

            // click => yellow fill
            // click => create object passed to query
        map.on('click', "zones-reference", (e)=>{
            var filtered = zoneSelection(e, queryInputs)
            filtered.length != 0 ? map.setFilter('zones-clickFill', ['match', ['get', 'no'], filtered, true, false]) : map.setFilter('zones-clickFill', ['==', 'no', '']);
        })

        execute.addEventListener('click', function(){
            // if exists, remove
            if (map.getLayer('zone-analysis')){
                map.removeLayer('zone-analysis')
            }
            // call Django API
                // inputs: TAZ numbers
            fetch(`http://localhost:8000/zonequery?zones=[${queryInputs.zones}]`)
                .then(response=> response.status != 200 ? console.error("Server Error") : response.json())
                .then(api=>{
                    let colorScheme = {
                        1: "#7f2704",
                        2: "#a63603",
                        3: "#d94801",
                        4: "#f16913",
                        5: "#fd8d3c",
                        6: "#fdae6b",
                        7: "#fdd0a2"
                    }
                    let fillExpression = ["match", ["get", "no"]]
                    let check = {};
                    api.forEach(zone=>{
                        if (!check[zone.no]){
                            fillExpression.push(zone.no, colorScheme[zone.rank])
                            check[zone.no] = zone.no
                        }
                    })
                    fillExpression.push("rgba(0,0,0,0)")
                    let analysisLayer = {
                        "id": `zones-analysis`,
                        "type": "fill",
                        "source": "zones",
                        "source-layer": "tim-zones",
                        "paint":{
                            "fill-color": fillExpression,
                            "fill-opacity": 0.5
                        }                     
                    }
                    map.addLayer(analysisLayer, "zones-base")
                    map.setPaintProperty("zones-base", "line-opacity", 0.25 )
                })
        })
    }
}


export {Map};