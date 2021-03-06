// collections of functions to add appropriate layers on top of mapbox light base map

const layers = {
  zones: {
    sourceDef: {
      url: 'https://tiles.dvrpc.org/data/dvrpc-tim-zones.json',
      type: 'vector',
    },
    layers: {
      hoverFill:  {
        type: 'fill',
        source: 'tim-zones',
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
        source: 'tim-zones',
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
        source: 'tim-zones',
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
    sourceDef: {
      url: 'https://tiles.dvrpc.org/data/dvrpc-tim-zones.json',
      type: 'vector',
    },
    layers: {
      base: {
        type: 'fill',
        source: 'tim-zones',
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
    sourceDef: {
      data: 'https://opendata.arcgis.com/datasets/e1e3beb6aa144f2b8dd07693567077cc_0.geojson',
      type: 'geojson',
    },
    layers:{
      base:{
        type: 'fill',
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
  county: {
    sourceDef: {
      url: 'https://tiles.dvrpc.org/data/dvrpc-municipal.json',
      type: 'vector',
    },
    layers:{
      county: {
        type: 'line',
        source: 'county',
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
      }
    }
  },
  boundaries:{
    sourceDef: {
      type: 'geojson',
      data: 'https://opendata.arcgis.com/datasets/e1e3beb6aa144f2b8dd07693567077cc_0.geojson',
    },
    layers:{
      muni: {
        type: 'line',
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
      }
    }
  }
}

export {layers}