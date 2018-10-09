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
          "fill-opacity": 1
        },
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
          "fill-outline-color": "#f00"
        },
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
          ]
        },
        placement: "admin-2-boundaries"
      }
    }
  },
  reference: {
    source: 'https://tiles.dvrpc.org/data/dvrpc-tim-zones.json',
    type: 'vector',
    style: {
      base: {
        type: 'fill',
        layer: 'tim-zones',
        paint: {
          "fill-translate-anchor": "map",
          "fill-color": "rgb(255,255,255)",
          "fill-opacity": 0
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
  muni: {
    source: 'https://tiles.dvrpc.org/data/dvrpc-municipal.json',
    type: 'vector',
    style: {
      base: {
        type: 'fill',
        layer: 'municipalities',
        paint: {
          "fill-translate-anchor": "map",
          "fill-color": "#d8c72e",
          "fill-outline-color": "#f00"
        },
        filter: [
          "==",
          "name",
          ""
        ],
        placement: null
      }
    }
  }
  // transit: {
  //   source: 'https://tiles.dvrpc.org/data/dvrpc-tim-transit.json',
  //   type: 'vector',
  //   style: {
  //     base: {
  //       type: 'line',
  //       layer: 'transit_lines',
  //       paint: {
  //         'line-width': .05,
  //         'line-color': '#06bf9c'
  //       },
  //       filter: [
  //         "match",
  //         ['get', 'typeno'],
  //         0,
  //         true,
  //         false
  //       ]
  //     }
  //   }
  // }
}

export {layers}