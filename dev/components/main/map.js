(function(){
    const currentDoc = document.currentScript.ownerDocument;
    function _loadMap(mbToken, zoneSelections, container){
        mapboxgl.accessToken = mbToken;
        // initiate map
        let map = new mapboxgl.Map({
            container: container.querySelector('#map__container'),
            style: '/components/main/map_styles/rtps.json',
            center: [-75.148, 40.018],
            zoom: 8.5,
            hash : true
          });
        
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
    class PageMap extends HTMLElement{
        constructor(){
            super();
        }
        connectedCallback(){
            const shadow = this.attachShadow({mode: 'open'});
            const temp = currentDoc.querySelector('#map-template');
            const instance = temp.content.cloneNode(true);
            const mbToken = MainElements[0].content;
            let zoneSelections = MainElements[1].content;
            shadow.appendChild(instance);
            _loadMap(mbToken, zoneSelections, shadow);
        }
    }
    customElements.define('page-map', PageMap);
})();