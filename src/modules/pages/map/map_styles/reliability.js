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
            8, .2,
            12, 3
          ],
          'line-color': [
            'step',
            ['get', 'score'],
            '#053061',
            4, '#2166AC',
            6, '#4393C3',
            8, '#92C5DE',
            10, '#D1E5F0',
            12, '#FDDBC7',
            14, '#F4A582',
            16, '#D6604D',
            18, '#B2182B',
            19, '#67001F'
          ]
        },
        layout: {
          visibility: 'visible'
        },
        placement: "admin-2-boundaries",
        filter: [
          'case',
          ['all', 
            ['<', ['zoom'], 8],
            ['any',
              ['>=', ['number', ['get', 'score']], 19],
              ['<=', ['number', ['get', 'score']], 4]
            ]
          ], true, 
          ['all', 
            ['all',
              ['<', ['zoom'], 9],
              ['>=', ['zoom'], 8]
            ],
            ['any',
              ['>=', ['number', ['get', 'score']], 16],
              ['<=', ['number', ['get', 'score']], 6]
            ]
          ], true,
          ['all', 
            ['all',
              ['<', ['zoom'], 10],
              ['>=', ['zoom'], 9]
            ],
            ['any',
              ['>=', ['number', ['get', 'score']], 14],
              ['<=', ['number', ['get', 'score']], 8]
            ]
          ], true,  
          ['all', 
            ['all',
              ['<', ['zoom'], 11],
              ['>=', ['zoom'], 10]
            ],
            ['any',
              ['>=', ['number', ['get', 'score']], 12],
              ['<=', ['number', ['get', 'score']], 10]
            ]
          ], true,
          ['>=', ['zoom'], 11], true, 
          false
        ]
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
            '#053061',
            4, '#2166AC',
            6, '#4393C3',
            8, '#92C5DE',
            10, '#D1E5F0',
            12, '#FDDBC7',
            14, '#F4A582',
            16, '#D6604D',
            18, '#B2182B',
            19, '#67001F'
          ]
        },
        layout: {
          visibility: 'none'
        },
        placement: "admin-2-boundaries",
        filter: [
          'case',
          ['all', 
            ['<', ['zoom'], 8],
            ['any',
              ['>=', ['number', ['get', 'weighted']], 19],
              ['<=', ['number', ['get', 'weighted']], 4]
            ]
          ], true, 
          ['all', 
            ['all',
              ['<', ['zoom'], 9],
              ['>=', ['zoom'], 8]
            ],
            ['any',
              ['>=', ['number', ['get', 'weighted']], 16],
              ['<=', ['number', ['get', 'weighted']], 6]
            ]
          ], true,
          ['all', 
            ['all',
              ['<', ['zoom'], 10],
              ['>=', ['zoom'], 9]
            ],
            ['any',
              ['>=', ['number', ['get', 'weighted']], 14],
              ['<=', ['number', ['get', 'weighted']], 8]
            ]
          ], true,  
          ['all', 
            ['all',
              ['<', ['zoom'], 11],
              ['>=', ['zoom'], 10]
            ],
            ['any',
              ['>=', ['number', ['get', 'weighted']], 12],
              ['<=', ['number', ['get', 'weighted']], 10]
            ]
          ], true,
          ['>=', ['zoom'], 11], true, 
          false
        ]
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
            '#007F99',
            60, '#40A7B9',
            70, '#9CADB4',
            80, '#C3BEB9',
            90, '#EBE6DF'
          ]
        },
        layout: {
          visibility: 'none'
        },
        placement: "admin-2-boundaries",
        filter: [
          'case',
          ['all', 
            ['<', ['zoom'], 8],
            ['any',
              ['>=', ['number', ['get', 'otp']], 90],
            ]
          ], true, 
          ['all', 
            ['all',
              ['<', ['zoom'], 9],
              ['>=', ['zoom'], 8]
            ],
            ['any',
              ['>=', ['number', ['get', 'otp']], 80],
            ]
          ], true,
          ['all', 
            ['all',
              ['<', ['zoom'], 10],
              ['>=', ['zoom'], 9]
            ],
            ['any',
              ['>=', ['number', ['get', 'otp']], 70],
            ]
          ], true,  
          ['all', 
            ['all',
              ['<', ['zoom'], 11],
              ['>=', ['zoom'], 10]
            ],
            ['any',
              ['>=', ['number', ['get', 'otp']], 60],
            ]
          ], true,
          ['>=', ['zoom'], 11], true, 
          false
        ]
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
            '#E6EECF',
            200, '#9BC4C1',
            750, '#69A8B7',
            1500, '#4B7E98',
            2000, '#2E557A'
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
        filter: [
          'case',
          ['all', 
            ['<', ['zoom'], 8],
            ['any',
              ['>=', ['number', ['get', 'speed']], 60],
            ]
          ], true, 
          ['all', 
            ['all',
              ['<', ['zoom'], 9],
              ['>=', ['zoom'], 8]
            ],
            ['any',
              ['>=', ['number', ['get', 'speed']], 50],
            ]
          ], true,
          ['all', 
            ['all',
              ['<', ['zoom'], 10],
              ['>=', ['zoom'], 9]
            ],
            ['any',
              ['>=', ['number', ['get', 'speed']], 40],
            ]
          ], true,
          ['all', 
            ['all',
              ['<', ['zoom'], 11],
              ['>=', ['zoom'], 10]
            ],
            ['any',
              ['>=', ['number', ['get', 'speed']], 30],
            ]
          ], true,
          ['>=', ['zoom'], 11], true, 
          false
        ]
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
            '#FBE9BD',
            1, '#EEB177',
            1.2, '#E58B48',
            1.5, '#B24625',
          ]
        },
        layout: {
          visibility: 'none'
        },
        placement: "admin-2-boundaries",
        filter: [
          'case',
          ['all', 
            ['<', ['zoom'], 8],
            ['any',
              ['>=', ['number', ['get', 'tti']], 1.5],
            ]
          ], true, 
          ['all', 
            ['all',
              ['<', ['zoom'], 9],
              ['>=', ['zoom'], 8]
            ],
            ['any',
              ['>=', ['number', ['get', 'tti']], 1.2],
            ]
          ], true,
          ['all', 
            ['all',
              ['<', ['zoom'], 10],
              ['>=', ['zoom'], 9]
            ],
            ['any',
              ['>=', ['number', ['get', 'tti']], 1],
            ]
          ], true,
          ['>=', ['zoom'], 10], true, 
          false
        ]
      }
    }
  }
}

export {styles}