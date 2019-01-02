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
            0, .05,
            8, .5,
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
        filter: [
          '==',
          'gid',
          ''
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
            0, .05,
            8, .5,
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
        filter: [
          '==',
          'gid',
          ''
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
            0, .05,
            8, .5,
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
        filter: [
          '==',
          'gid',
          ''
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
            0, .05,
            8, .5,
            12, 3
          ],
          'line-color': [
            'step',
            ['get', 'daily_rider'],
            '#E6EECF',
            200, '#9BC4C1',
            750, '#69A8B7',
            1500, '#4B7E98',
            2000, '#2E557A'
          ]
        },
        // filter: [
        //   '==',
        //   'gid',
        //   ''
        // ]
      },
      // septa: {
      //   type: 'line',
      //   source: 'septa',
      //   paint: {
      //     'line-color': '#f00',
      //     'line-width': 1
      //   },
      //   filter: [
      //     '==',
      //     'gid',
      //     ''
      //   ]
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
            ['get', 'avgspeed'],
            '#BE3027',
            10, '#D5857F',
            25, '#EBD9D8',
            40, '#97A2B3',
            65, '#667181'
          ]
        },
        filter: [
          '==',
          'gid',
          ''
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
            0, .05,
            8, .5,
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
        filter: [
          '==',
          'gid',
          ''
        ]
      }
    }
  }
}


export {styles}