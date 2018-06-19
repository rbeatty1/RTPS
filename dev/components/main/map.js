(function(){
    const currentDoc = document.currentScript.ownerDocument;
    function _loadMap(mbToken, container){
        mapboxgl.accessToken = mbToken;
        let map = new mapboxgl.Map({
            container: container.querySelector('#map__container'),
            style: '/components/main/map_styles/highway.json',
            center: [-75.148, 40.018],
            zoom: 12,
            hash : true
          });
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
            shadow.appendChild(instance);
            // _loadMap(mbToken, shadow);
        }
    }
    customElements.define('page-map', PageMap);
})();