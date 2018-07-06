import '../../css/map/map.css'

function mapRender(){
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
        
    // add navigation control 
    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

    // trick canvas into filling the entire container because it won't initially for whatever stupid reasion
    map.on('load', _=>{
        map.resize();
    });

    // filter functions
        // hovering is laggy, look into doing something else to make it faster? idk man
    map.on('mousemove', "zone-hover", (e)=>{
        let zone = e.features[0].properties['no'];
        map.setFilter("zone-hover-fill", ["==", "no", zone]);
    })

    map.on('mouseleave', "zone-hover", (e)=>{
        map.setFilter("zone-hover-fill", ["==", "no", ""]);
    })

    map.on('click', "zone-hover", (e)=>{
        let zone = e.features[0].properties['no'];
        console.log(zone)
        map.setFilter('zone-click-fill', ['==', 'no', zone])
    })
}

export {mapRender};