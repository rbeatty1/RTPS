import '../../css/map/map.css'
import {queryInputs, zoneData} from '../header/queryInput/queryInput'

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


/* zoneStyling(id, stat) -- rbeatty
    @desc: Accept API response and symbolize according to standardized classification bins
    @params:
        @id -- tile id to assign in stylesheet (~/src/map/map_styles/rtps.json)
        @status -- whether this data set should be symbolized as transit served or not
            // API Response ->- w_avg_con >= 5.5 (metric of transit gap)
    @usage: 
        - L124
*/
function zoneStyling(id, status){
    if (status == 'served'){
        return {
            'id' : `${id}-${status}`,
            'type': 'fill',
            'source' : id,
            'filter' : ['match', ['get', 'SERVED'], 1, true, false],
            'paint': {
                'fill-color': {
                    property: 'GAPSCORE',
                    type: 'interval',
                    stops: [
                        [10, '#e2e2e2'],
                        [20, '#cbe5c2'],
                        [30, '#7dc57c'],
                        [40, '#2a9249'],
                        [60, '#0d4420']
                    ]
                }
            },
            'fill-opacity': 0.6
        }
    }
    else{
        return {
            'id' : `${id}-${status}`,
            'type': 'fill',
            'source' : id,
            'filter' : ['match', ['get', 'SERVED'], 0, true, false],
            'paint': {
                'fill-color': {
                    property: 'GAPSCORE',
                    type: 'interval',
                    stops: [
                        [10, '#d8d5eb'],
                        [20, '#9296ca'],
                        [30, '#586bb2'],
                        [40, '#2d51a3'],
                        [60, '#22418d']
                    ]
                },
                'fill-opacity': 0.6
            }
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

        // filter functions
            // hover => green fill
        map.on('mousemove', "zone-hover", (e)=>{
            map.setFilter("zone-hover-fill", ["==", "no", e.features[0].properties['no']]);
        })
            // leave hover => no fill
        map.on('mouseleave', "zone-hover", (e)=>{
            map.setFilter("zone-hover-fill", ["==", "no", ""]);
        })

            // click => yellow fill
            // click => create object passed to query
        map.on('click', "zone-hover", (e)=>{
            var filtered = zoneSelection(e, queryInputs)
            filtered.length != 0 ? map.setFilter('zone-click-fill', ['match', ['get', 'no'], filtered, true, false]) : map.setFilter('zone-click-fill', ['==', 'no', '']);
        })

        execute.addEventListener('click', function(){
            // if exists, remove
            if (map.getSource('zone-fill')){
                map.removeLayer('zone-analysis-fill')
                map.removeSource('zone-fill')
            }
            // call Django API
                // inputs: TAZ numbers
            fetch(`http://localhost:8000/zonequery?zones=[${queryInputs.zones}]`)
                .then(response=> response.status != 200 ? console.error("Server Error") : response.json())
                .then(api=>{
                    fetch(`https://services1.arcgis.com/LWtWv6q6BJyKidj8/arcgis/rest/services/TAZ/FeatureServer/0/query?where=1%3D1&outFields=TAZN&outSR=4326&geometryPrecision=4&f=pgeojson`)
                    .then(response=>{
                        if(response.ok){
                            response.json()
                            .then(esri=>{
                                // array to contain zone numbers of django output 
                                let apiReturn = []
                                api.forEach(apiFeat => {
                                    if (queryInputs.zones.indexOf(apiFeat.FromZone) === -1){
                                        apiReturn.push(apiFeat.FromZone)
                                    }
                                })
                                // remove ESRI returns that don't match django output
                                esri.features = esri.features.filter(item=>{
                                    if(apiReturn.indexOf(item.properties.TAZN) != -1){
                                        return true
                                    }
                                })
                                // add gap score to ESRI return
                                api.forEach(apiFeat=>{
                                    for (let x in esri.features){
                                        if (esri.features[x].properties.TAZN === apiFeat.FromZone){
                                            apiFeat.w_avg_con >= 5.5 ? esri.features[x].properties.SERVED = 0 : esri.features[x].properties.SERVED = 1
                                            esri.features[x].properties.GAPSCORE = apiFeat.w_avg_gap
                                        }
                                    }
                                })
                                map.addSource('zone-fill', {
                                    type: 'geojson',
                                    data: esri
                                })
                                map.addLayer(zoneStyling('zone-fill', 'served'), 'zone-bound')
                                map.addLayer(zoneStyling('zone-fill', 'notServed'), 'zone-bound')
                                map.setPaintProperty('zone-bound', 'line-opacity', .2)
                            })
                        }
                    })
                    /* @TODO: get geographical bounds and zoom map to area
                    .finally({
                        // SEE: &returnExtentOnly option for arcgis api call

                        // assign bounds to object

                        // pass extent to mapbox object
                    })
                    */

                })
        })
    }
}


export {Map};