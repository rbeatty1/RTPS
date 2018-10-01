// collections of functions to add appropriate layers on top of mapbox light base map

const layers = {
  zones: {
    source: 'https://tiles.dvrpc.org/data/dvrpc-tim-zones.json',
    type: 'vector',
    style: {
      reference: {
        type: 'fill',
        layer: 'tim-zones',
        paint: {
          "fill-translate-anchor": "map",
          "fill-color": "rgb(255,255,255)",
          "fill-opacity": 0
        },
        visibility: "none"
      },
      hoverFill:  {
        type: 'fill',
        layer: 'tim-zones',
        paint: {
          "fill-translate-anchor": "map",
          "fill-color": "rgba(139,178,63, 0.5)",
          "fill-opacity": 0.66
        },
        filter: [
          "==",
          "no",
          ""
        ]
      },
      clickFill:  {
        type: 'fill',
        layer: 'tim-zones',
        paint: {
          "fill-translate-anchor": "map",
          "fill-color": "#d8c72e",
          "fill-opacity": 0.66
        },
        filter: [
          "==",
          "no",
          ""
        ]
      },
      base:{
        type: 'line',
        layer: 'tim-zones',
        paint: {
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            7, .1,
            12, 1
          ],
          'line-color': '#08506d'
        },
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