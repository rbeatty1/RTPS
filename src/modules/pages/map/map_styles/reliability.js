const styles = {
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
        ]
      }
    }
  },
  reliability: {
    sourceDef: {
      type: 'vector',
      url: 'https://tiles.dvrpc.org/data/rtps-reliability-v2.json'
    },
    layers:{
      score: {
        type: 'line',
        source: 'score',
        paint: {
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, .5,
            12, 3
          ],
          'line-color': [
            'step',
            ['get', 'score'],
            '#fcfdbf',
            4, '#fc8761',
            8, '#b63679',
            12, '#50127b',
            16, '#000004',
          ]
        },
        layout: {
          visibility: 'visible'
        },
        placement: "admin-2-boundaries"
      },
      loads: { // regional view septa
        type: 'line',
        source: 'septasegload',
        paint: {
          'line-color': [
            'step',
            ['get', 'segload'],
            '#ffffcc',
            350, '#c2e699',
            850, '#78c679',
            1500, '#31a354',
            3000, "#006837"
          ],
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, .05,
            8, .5,
            12, 3
          ],
        },
        layout: {
          visibility: 'none'
        },
        placement: "admin-2-boundaries",
        layout: {
          visibility: 'none'
        },
        placement: "admin-2-boundaries"
      },
      weighted: {
        type: 'line',
        source: 'weighted',
        paint: {
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, .2,
            12, 3
          ],
          'line-color': [
            'step',
            ['get', 'riderrelis'],
            '#fcfdbf',
            4, '#fc8761',
            8, '#b63679',
            12, '#50127b',
            16, '#000004',
          ]
        },
        layout: {
          visibility: 'none'
        },
        placement: "admin-2-boundaries"
      },
      otp: {
        type: 'line',
        source: 'otp',
        paint: {
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, .2,
            12, 3
          ],
          'line-color': [
            'step',
            ['get', 'otp'],
            '#0868ac',
            60, '#43a2ca',
            70, '#7bccc4',
            80, '#bae4bc',
            90, '#d6d6d6'
          ]
        },
        layout: {
          visibility: 'none'
        },
        placement: "admin-2-boundaries",
      },
      njt: {
        type: 'line',
        source: 'njt',
        paint: {
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, .2,
            12, 3
          ],
          'line-color': [
            'step',
            ['get', 'ridership'],
            '#e3b505',
            500, '#f18541',
            1500, '#b02c87',
            2000, '#045099'
          ]
        },
        placement: "admin-2-boundaries",
        layout: {
          visibility: 'none'
        }
      },
      septa: { // detail view septa jawn
        type: 'line',
        source: 'septalineload',
        paint: {
          'line-color': [
            'step',
            ['get', 'loads'],
            '#ffffcc',
            100, '#c2e699',
            300, '#78c679',
            600, '#31a354',
            900, "#006837"
          ],
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, .05,
            8, .5,
            12, 3
          ],
        },
        layout: {
          visibility: 'none'
        },
        placement: "admin-2-boundaries",
      },
      speed: {
        type: 'line',
        source: 'speed',
        paint: {
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, .05,
            8, .5,
            12, 3
          ],
          'line-color': [
            'step',
            ['get', 'speed'],
            '#762a83',
            10, '#af8dc3',
            20, '#e7d4e8',
            30, '#ffc4ce',
            40, '#7fbf7b',
            50, '#38a800',
            60, '#229846'
          ]
        },
        layout: {
          visibility: 'none'
        },
        placement: "admin-2-boundaries",
      },
      tti: {
        type: 'line',
        source: 'tti',
        paint: {
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, .2,
            12, 3
          ],
          'line-color': [
            'step',
            ['get', 'tti'],
            '#ffffb2',
            1, '#fecc5c',
            1.2, '#fd8d3c',
            1.5, '#e31a1c',
          ]
        },
        layout: {
          visibility: 'none'
        },
        placement: "admin-2-boundaries",
      }
    }
  }
}

export {styles}