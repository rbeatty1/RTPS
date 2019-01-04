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
      url: 'https://tiles.dvrpc.org/data/rtps-reliability.json'
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
        placement: "admin-2-boundaries",
        // filter: [
        //   'case',
        //   ['all', 
        //     ['<', ['zoom'], 8],
        //     ['any',
        //       ['>=', ['number', ['get', 'score']], 16],
        //       ['<=', ['number', ['get', 'score']], 4]
        //     ]
        //   ], true, 
        //   ['all', 
        //     ['all',
        //       ['<', ['zoom'], 9],
        //       ['>=', ['zoom'], 8]
        //     ],
        //     ['any',
        //       ['>=', ['number', ['get', 'score']], 12],
        //       ['<=', ['number', ['get', 'score']], 8]
        //     ]
        //   ], true,
        //   ['>=', ['zoom'], 9], true, 
        //   false
        // ]
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
            ['get', 'weighted'],
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
        placement: "admin-2-boundaries",
        // filter: [
        //   'case',
        //   ['all', 
        //     ['<', ['zoom'], 8],
        //     ['any',
        //       ['>=', ['number', ['get', 'weighted']], 19],
        //       ['<=', ['number', ['get', 'weighted']], 4]
        //     ]
        //   ], true, 
        //   ['all', 
        //     ['all',
        //       ['<', ['zoom'], 9],
        //       ['>=', ['zoom'], 8]
        //     ],
        //     ['any',
        //       ['>=', ['number', ['get', 'weighted']], 16],
        //       ['<=', ['number', ['get', 'weighted']], 6]
        //     ]
        //   ], true,
        //   ['all', 
        //     ['all',
        //       ['<', ['zoom'], 10],
        //       ['>=', ['zoom'], 9]
        //     ],
        //     ['any',
        //       ['>=', ['number', ['get', 'weighted']], 14],
        //       ['<=', ['number', ['get', 'weighted']], 8]
        //     ]
        //   ], true,  
        //   ['all', 
        //     ['all',
        //       ['<', ['zoom'], 11],
        //       ['>=', ['zoom'], 10]
        //     ],
        //     ['any',
        //       ['>=', ['number', ['get', 'weighted']], 12],
        //       ['<=', ['number', ['get', 'weighted']], 10]
        //     ]
        //   ], true,
        //   ['>=', ['zoom'], 11], true, 
        //   false
        // ]
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
            '#e2e2e2',
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
      // septa: {
      //   type: 'line',
      //   source: 'septa',
      //   paint: {
      //     'line-color': '#f00',
      //     'line-width': 1
      //   },
      //   layout: {
      //     visibility: 'none'
      //   }
      // },
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
            '#730000',
            10, '#e60000',
            20, '#f07d02',
            30, '#ffcb0d',
            40, '#FF0',
            50, '#AF0',
            60, '#38a800'
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