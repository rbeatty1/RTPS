import '../../css/map/map.css'
import {queryInputs, zoneData} from '../header/queryInput/queryInput'

// build array based on map clicks
function zoneSelection(target, output){
    let zone = target.features[0].properties['no'],
        selection = output.zones,
        index = selection.indexOf(zone);
    // if value is already in array, remove it, otherwise add it
    index != -1 ? selection.splice(index, 1) : selection.push(zone);
    return selection;
}

function zoneStyling(id){
    return {
        'id' : id,
        'type': 'fill',
        'source' : id,
        'paint': {
            property: 'GAPSCORE',
            type: 'interval',
            stops: [
                [0, '#e1e1e1'],
                [10, '#f00'],
                [20, '#0f0'],
                [30, '#00f']
            ]
        }
    }
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
            style: './modules/map/map_styles/rtps.json',
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
        });

        // // filter functions
        map.on('mousemove', "zone-hover", (e)=>{
            map.setFilter("zone-hover-fill", ["==", "no", e.features[0].properties['no']]);
        })

        map.on('mouseleave', "zone-hover", (e)=>{
            map.setFilter("zone-hover-fill", ["==", "no", ""]);
        })

        map.on('click', "zone-hover", (e)=>{
            var filtered = zoneSelection(e, queryInputs)
            filtered.length != 0 ? map.setFilter('zone-click-fill', ['match', ['get', 'no'], filtered, true, false]) : map.setFilter('zone-click-fill', ['==', 'no', '']);
        })

        execute.addEventListener('click', function(){
            if (map.getSource('zone-fill')){
                map.removeLayer('zone-analysis-fill')
                map.removeSource('zone-fill')
            }
            fetch(`http://localhost:8000/zonequery?zones=[${queryInputs.zones}]`)
                .then(response=> response.status != 200 ? console.error("Server Error") : response.json())
                .then(api=>{
                    fetch(`https://services1.arcgis.com/LWtWv6q6BJyKidj8/arcgis/rest/services/TAZ/FeatureServer/0/query?where=1%3D1&outFields=TAZN&outSR=4326&f=pgeojson`)
                    .then(response=>{
                        if(response.ok){
                            response.json()
                            .then(esri=>{
                                let apiReturn = []
                                api.forEach(apiFeat => {
                                    apiReturn.push(apiFeat.FromZone)
                                })
                                // console.log({apiReturn})
                                // console.log({esri})
                                esri.features = esri.features.filter(item=>{
                                    if(apiReturn.indexOf(item.properties.TAZN) != -1){
                                        return true
                                    }
                                })
                                api.forEach(apiFeat=>{
                                    for (let x in esri.features){
                                        if (esri.features[x].properties.TAZN === apiFeat.FromZone){
                                            esri.features[x].properties.GAPSCORE = apiFeat.w_avg_gap
                                        }
                                    }
                                })

                                map.addSource('zone-fill', {
                                    type: 'geojson',
                                    data: esri
                                })
                                map.addLayer({
                                    'id': 'zone-fill',
                                    'source': 'zone-fill',
                                    'type' : 'fill',
                                    'paint': {
                                        'fill-color': 'red'
                                    }}, 'zone-bound')
                            })
                        }
                    })

                })
        })
    }
}


export {Map};