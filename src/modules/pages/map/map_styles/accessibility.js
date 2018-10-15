const styles = {
  base: {
    sourceDef: {
      type: 'vector',
      url: 'https://tiles.dvrpc.org/data/dvrpc-freight-story.json'
    },
    layers: {
      countyLabels : {
        source: 'dvrpc-places',
        type: 'symbol',
        layout: {
          "text-field": "{NAME}",
          "text-font": [
            "Montserrat SemiBold",
              "Open Sans Semibold"
            ],
            "text-size": [
              'interpolate', ['linear'], ['zoom'],
              8, 10,
              12, 20
            ]
        },
        paint: {
            "text-color": "#a6a6a6",
              "text-halo-color": '#ececec',
              "text-halo-width": 4,
              "text-halo-blur": 3
        }
      },
      muniLabels : {
        source: 'municipalities',
        type: 'symbol',
        layout: {
          "text-field": "{MUN_LABEL}",
          "text-font": [
            "Montserrat SemiBold",
              "Open Sans Semibold"
            ],
            "text-size": [
              'interpolate', ['linear'], ['zoom'],
              9.25, 4,
              12, 12
            ],
            "text-anchor": "bottom-left"
        },
        minzoom: 9,
        paint: {
            "text-color": "#a6a6a6",
              "text-halo-color": '#ececec',
              "text-halo-width": 4,
              "text-halo-blur": 3,
              "text-opacity": [
                'interpolate', ['linear'], ['zoom'],
                9.25, .33,
                12, 1
              ]
        }
      },
      interstates: {
        type: 'line',
        paint: {
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            8, 1.25,
            12, 3.75
          ],
          'line-color': '#fff',
        },
        source: 'interstates',
        placement: 'base-countyLabels'
      },
      countyOutline: {
        source: 'county',
        type: 'line',
        filter: [
          '==',
          'DVRPC_REG',
          'Yes'
        ],
        paint: {
          "line-color" : "#646464",
          "line-width": 1,
          'line-dasharray': [2, 4]
        },
        placement: 'base-interstates'
      },
      muniOutline: {
        source: 'municipalities',
        type: 'line',
        paint: {
          "line-color" : '#c9c9c9',
          "line-width": [
            'interpolate', ['linear'], ['zoom'],
            8, .25,
            12, .75
          ],
          "line-opacity": [
            'interpolate', ['linear'], ['zoom'],
            8, .25,
            12, 1
          ]
        },
        placement: 'base-countyOutline'
      },
      countyFill: {
        source: 'county',
        type: 'fill',
        filter: [
          '==',
          'DVRPC_REG',
          'Yes'
        ],
        paint: {
          "fill-color": '#ececec'
        },
        placement: 'base-muniOutline'
      },
    }
  },
  transit: {
    sourceDef: {
      type: 'geojson',
      data: 'https://opendata.arcgis.com/datasets/5af7a3e9c0f34a7f93ac8935cb6cae3b_0.geojson'
    },
    layers: {
      railLines: {
        type: 'line',
        paint: {
          "line-color": [
            'match',
            ['get', 'TYPE'],
            'AMTRAK', '#004d6e',
            'NJ Transit', "#f18541",
            'NJ Transit Light Rail', '#ffc424',
            'PATCO', '#ed164b',
            'Rapid Transit', '#9e3e97',
            'Regional Rail', '#487997',
            'Subway', '#f58221',
            'Subway - Elevated', '#067dc1',
            'Surface Trolley',  '#529442',
            '#323232'
          ],
          "line-width":[
            'interpolate', ['linear'], ['zoom'],
            8, 1,
            12, 3
          ]
        },
        placement: 'base-countyLabels'
      },
      railLabels: {
        type: 'symbol',
        source: 'transitLines',
        layout: {
          "text-field": "{LINE_NAME}",
          "text-font": [
            "Montserrat SemiBold",
              "Open Sans Semibold"
            ],
            "text-size": [
              'interpolate', ['linear'], ['zoom'],
              8, 5,
              12, 12
            ],
            "symbol-placement":  "line"
        },
        paint: {
          "text-color": [
            'match',
            ['get', 'TYPE'],
            'AMTRAK', '#004d6e',
            'NJ Transit', "#f18541",
            'NJ Transit Light Rail', '#ffc424',
            'PATCO', '#ed164b',
            'Rapid Transit', '#9e3e97',
            'Regional Rail', '#487997',
            'Subway', '#f58221',
            'Subway - Elevated', '#067dc1',
            'Surface Trolley',  '#529442',
            '#323232'
          ],
            "text-halo-color": '#ececec',
            "text-halo-width": 4,
            "text-halo-blur": 3
        },
        placement: 'base-countyLabels'
      }

    }
  },
  // taz:{
  //   sourceDef: {
  //     type: 'geojson',
  //     data: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/PUMA_TAD_TAZ_UGA_ZCTA/MapServer/11/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pgeojson',
  //   },
  //   layers:{
  //       base: {
  //         type: "fill",
  //         paint: {
  //           "fill-color": "#f00",
  //           "fill-outline-color": "#fff",
  //         },
  //         placement: 'base-muniOutline'
  //       }
  //     }
  //   }
  // },
  // transitStations:{
  //   sourceDef: {
  //     type: 'geojson',
  //     data: 'https://opendata.arcgis.com/datasets/68b970bf65bc411c8a7f8f7b0bb7908d_0.geojson'
  //   },
  //   layers: {
  //     railStations: {
  //       type: 'circle',
  //       paint: {
  //         'circle-color': '#fff',
  //         'circle-radius': [
  //           'interpolate', ['linear'], ['zoom'],
  //           9, .2,
  //           10, 2.5,
  //           11, 4,
  //           12, 6
  //         ],
  //         'circle-stroke-color': '#f00',
  //         'circle-stroke-width':[
  //           'interpolate', ['linear'], ['zoom'],
  //           8, .5,
  //           12, 2
  //         ]
  //       },
  //       placement: 'transit-railLines'
  //     }
  //   }
  // }
}

export { styles }