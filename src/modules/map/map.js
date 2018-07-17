import '../../css/map/map.css'
import {queryInputs} from '../header/queryInput/queryInput'


function __buildFilter(arr){
    var filter = ['in', 'letters']
    if (arr.length === 0){
        return filter;
    }
    for(var i = 0; i < arr.length; i++){
        filter.includes(arr[i]) ? true : filter.push(arr[i])
    }
}

const options = [{
    zones: [
        {
            id: "zone-hover",
            type: "fill",
            source: "zones",
            sourceLayer: "tim-zones",
            paint: {
                "fill-translate-anchor": "map",
                "fill-color": "rgb(255,255,255)",
                "fill-opacity" : 0                
            }            
        },
        {
            id: "zone-hover-fill",
            type: "fill",
            source: "zones",
            sourceLayer: "tim-zones",
            paint: {
                "fill-translate-anchor": "map",
                "fill-color": "rgba(139,178,63, 0.5)",
                "fill-opacity" : 1               
            }   
        },
        {
            id: "zone-click-fill",
            type: "fill",
            source: "zones",
            sourceLayer: "tim-zones",
            paint: {
                "fill-translate-anchor": "map",
                "fill-color": "rgba(255,223,0, 0.75)",
                "fill-opacity" : 1        
            },
            filter: ["==", "no", ""]
        },
        {
            id: "zone-bound",
            type: "line",
            source: "zones",
            sourceLayer: "tim-zones",
            paint: {
                "line-color": "rgba(8, 80, 109, 1)",
                "line-width": {
                  "stops": [
                    [
                      6,
                      0.1
                    ],
                    [
                      7,
                      0.2
                    ],
                    [
                      9,
                      0.5
                    ],
                    [
                      10,
                      0.75
                    ],
                    [
                      11,
                      1.25
                    ]
                  ]
                },
                "line-opacity": {
                  "stops" :[
                  [6,0.2],
                  [7,0.3],
                  [9, 0.5],
                  [10, 0.75]
                ]}
              },
            minzoom: 8
        }
    ]},
    {
        mcds: 'test'
    }
]

function __GeographyChecker(options){
    let indicator = document.getElementById('geography');
    indicator.addEventListener('change', x=>{
        let geo = x.target.value;
        if (geo == 'Zone'){
            return details = options[0]
        }
        else if (geo == 'MCD'){
            return details = options[1]
        }
        console.log(details)
    })
}
class Map{
    constructor(){
        this.render()
    }

    get state(){
        return this._state
    }
    set state(options){
        this._state = {
            active: options
        }
        this.render()
    }

    render(){
        const appBody = document.querySelector('#app');
        const mapBody = document.createElement('div');
        mapBody.className = "map__container"
        appBody.appendChild(mapBody);
        mapboxgl.accessToken = 'pk.eyJ1IjoiYmVhdHR5cmUxIiwiYSI6ImNqOGFpY3o0cTAzcXoycXE4ZTg3d3g5ZGUifQ.VHOvVoTgZ5cRko0NanhtwA';
        // initiate map
        let map = new mapboxgl.Map({
            container: mapBody,
            style: './modules/map/map_styles/rtps.json',
            center: [-75.148, 40.018],
            zoom: 8.5,
            hash : true
        })
        
        // __GeographyChecker(options)

        // add navigation control 
        const nav = new mapboxgl.NavigationControl();
        map.addControl(nav, 'top-left');

        // trick canvas into filling the entire container because it won't initially for whatever stupid reasion
        map.on('load', _=>{
            map.resize();
        });

        // // filter functions
        map.on('mousemove', "zone-hover", (e)=>{
            let zone = e.features[0].properties['no'];
            map.setFilter("zone-hover-fill", ["==", "no", zone]);
        })

        map.on('mouseleave', "zone-hover", (e)=>{
            map.setFilter("zone-hover-fill", ["==", "no", ""]);
        })

        map.on('click', "zone-hover", (e)=>{
            let zone = e.features[0].properties['no'];
            let zoneArray = queryInputs.zones;
            zoneArray.push(zone);
            map.setFilter('zone-click-fill', ['==', 'no', zone])
        })
    }
}


export {Map, options};