// collections of functions to add appropriate layers on top of mapbox light base map

const layers = {
  zones: {
    source: 'https://tiles.dvrpc.org/data/dvrpc-tim-zones.json',
    type: 'vector',
    style: {
      hoverFill:  {
        type: 'fill',
        layer: 'tim-zones',
        paint: {
          "fill-translate-anchor": "map",
          "fill-color": "rgb(139,178,63)",
          "fill-opacity": 1,
        },
        visibility: "none",
        filter: [
          "==",
          "no",
          ""
        ],
        placement: "waterway-label"
      },
      clickFill:  {
        type: 'fill',
        layer: 'tim-zones',
        paint: {
          "fill-translate-anchor": "map",
          "fill-color": "#d8c72e",
          "fill-outline-color": "#f00",
        },
        visibility: "none",
        filter: [
          "==",
          "no",
          ""
        ],
        placement: "waterway-label"
      },
      base:{
        type: 'line',
        layer: 'tim-zones',
        paint: {
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            7, 0.1,
            12, 1
          ],
          'line-color': '#08506d',
          'line-opacity': [
            'interpolate', ['linear'], ['zoom'],
            7, 0.1,
            12, 1
          ],
        },
        visibility: "none",
        placement: "admin-2-boundaries"
      }
    }
  },
  zoneReference: {
    source: 'https://tiles.dvrpc.org/data/dvrpc-tim-zones.json',
    type: 'vector',
    style: {
      base: {
        type: 'fill',
        layer: 'tim-zones',
        paint: {
          "fill-translate-anchor": "map",
          "fill-color": "rgb(255,255,255)",
          "fill-opacity": 0,
        },
        visibility: "none",
        placement: null,
        filter: [
          "!=",
          "no",
          ""
        ]
      },
    }
  },
  muniReference:{
    source: 'https://tiles.dvrpc.org/data/dvrpc-municipal.json',
    type: 'vector',
    style:{
      base:{
        type: 'fill',
        layer: 'municipalities',
        paint: {
          "fill-translate-anchor": "map",
          "fill-color": "rgb(255,255,255)",
          "fill-opacity": 0,
        },
        visibility: "none",
        placement: null,
        filter: [
          "!=",
          "no",
          ""
        ]
      }
    }
  },
  boundaries: {
    source: 'https://tiles.dvrpc.org/data/dvrpc-municipal.json',
    type: 'vector',
    style: {
      muni: {
        type: 'line',
        layer: 'municipalities',
        paint: {
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            7, 0.1,
            12, 1
          ],
          'line-color': '#08506d',
          'line-opacity': [
            'interpolate', ['linear'], ['zoom'],
            7, 0.1,
            12, 1
          ],
        },
        visibility: "none",
        placement: null
      },
      hover:  {
        type: 'fill',
        layer: 'municipalities',
        paint: {
          "fill-translate-anchor": "map",
          "fill-color": "rgb(139,178,63)",
          "fill-opacity": 1,
        },
        visibility: "none",
        filter: [
          "==",
          "name",
          ""
        ],
        placement: "waterway-label"
      },
      click:  {
        type: 'fill',
        layer: 'municipalities',
        paint: {
          "fill-translate-anchor": "map",
          "fill-color": "#d8c72e",
          "fill-outline-color": "#f00",
        },
        visibility: "none",
        filter: [
          "==",
          "name",
          ""
        ],
        placement: "waterway-label"
      },
      county: {
        type: 'line',
        layer: 'county',
        paint: {
          "line-color": "#aaa",
          "line-width": 1
        },
        filter: [
          "==",
          "dvrpc",
          "Yes"
        ],
        placement: "admin-2-boundaries"
      },
    }
  }
}

export {layers}