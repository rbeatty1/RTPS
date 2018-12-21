import {layers} from './styles';
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
      outerCountyLabels : {
        source: 'county',
        type: 'symbol',
        filter: [
          '==',
          'DVRPC_REG',
          'No'          
        ],
        layout: {
          "text-field": "{CO_NAME}",
          "text-font": [
            "Montserrat SemiBold",
              "Open Sans Semibold"
            ],
            "text-size": [
              'interpolate', ['linear'], ['zoom'],
              8, 6,
              12, 12 
            ],
            "symbol-placement": 'point',
            "text-anchor" : 'center'
        },
        paint: {
            "text-color": "#C8C8C8",
              "text-halo-color": "#f5f5f5",
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
        }
      },
      hwyLabels:{
        type: 'symbol',
        source: 'interstates',
        layout: {
          "text-field": "{route}",
          "text-font": [
            "Montserrat SemiBold",
              "Open Sans Semibold"
            ],
            "text-size": [
              'interpolate', ['linear'], ['zoom'],
              9.25, 8,
              12, 18
            ],
            "text-anchor": "center",
            "symbol-placement" : 'line'
        },
        paint: {
            "text-color": "#a6a6a6",
              "text-halo-color": '#ececec',
              "text-halo-width": 4,
              "text-halo-blur": 3,
        }
      },
      countyOutline: {
        source: 'county',
        type: 'line',
        paint: {
          "line-color" : "#646464",
          "line-width": [
            'match',
            ['get', 'DVRPC_REG'],
            'Yes', 1,
            .1
          ],
          'line-dasharray': [2, 4]
        },
        placement: 'base-countyLabels'
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
      interstates: {
        type: 'line',
        paint: {
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            8, 2,
            12, 4
          ],
          'line-color': '#fff',
        },
        source: 'interstates',
        placement: 'base-muniOutline'
      },
      countyFill: {
        source: 'county',
        type: 'fill',
        paint: {
          "fill-color": [
            'match',
            ['get','DVRPC_REG'],
            'Yes', '#ececec',
            'rgba(255,255,255,0)'
          ]
        },
        placement: 'base-interstates'
      },
    }
  },
  transitRef: {
    sourceDef: {
      type: 'vector',
      url: 'https://tiles.dvrpc.org/data/dvrpc-tim-transit.json'
    },
    layers:{
      all: {
        source: 'transit_lines',
        type: 'line',
        filter: ['==', 'linename', ''],
        paint: {
          "line-width" : [
            "interpolate",
            ["linear"],
            ["zoom"],
            7,
            2,
            12,
            4
          ],
          "line-color" : '#00ffff'
        },
        placement: 'base-countyOutline'
      }
    }
  },
  zone: {
    sourceDef: {
      type: 'vector',
      url: 'https://tiles.dvrpc.org/data/dvrpc-tim-zones.json'
    },
    layers:{
      reference: {
        source: 'tim-zones',
        type: 'line',
        filter: ['==', 'no', ''],
        paint: {
          "line-width" : [
            "interpolate",
            ["linear"],
            ["zoom"],
            7,
            2,
            12,
            4
          ],
          "line-color" : '#00ffff'
        },
        placement: 'base-countyOutline'
      }
    }
  }
}

/*
  Author: Robert Beatty
  Purpose: Quickly add symbolized passenger rail lines for the DVRPC to a mapbox gl map with labels
*/

const passengerRail = {
  passengerRail: {
    sourceDef: {
      type: 'geojson',
      data: 'https://opendata.arcgis.com/datasets/5af7a3e9c0f34a7f93ac8935cb6cae3b_0.geojson'
    },
    layers: {
      lines: {
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
        layout: { visibility: 'none' }
      },
      labels: {
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
            "symbol-placement":  "line",
            "visibility" : 'none'
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
        }
      }
    }
  }
}

/*
  addRailLayers(map) 
  @desc: Add passenger rail layer/labels to basemap
  @param:
    *!~ map: reference to mapbox gl instance that the layers will be added to
*/

const addRailLayers = map =>{
  for (let source in passengerRail){
    map.addSource(source, passengerRail[source].sourceDef)
    for (let layer in passengerRail[source].layers){
      let thisLayer = passengerRail[source].layers[layer]
      let layerDef = {
        "id": `${source}-${layer}`,
        "type": thisLayer.type,
        "source": source,
        "paint": thisLayer.paint
      }
      !thisLayer.layout ? null : layerDef['layout'] = thisLayer.layout
      !thisLayer.filter ? null : layerDef['filter'] = thisLayer.filter
      map.addLayer(layerDef, 'base-muniOutline')
    }

  }
}

export { styles, addRailLayers }