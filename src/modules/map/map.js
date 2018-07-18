import '../../css/map/map.css'
import {queryInputs} from '../header/queryInput/queryInput'

// build array based on map clicks
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
            mapBody = document.createElement('div');
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
    }
}


export {Map};