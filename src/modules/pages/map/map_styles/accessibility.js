const styles = {
  base: {
    sourceDef: {
      type: 'vector',
      url: 'https://tiles.dvrpc.org/data/dvrpc-freight-story.json'
    },
    layers: {
      countyFill: {
        source: 'county',
        type: 'fill',
        filter: [
          '==',
          'DVRPC_REG',
          'Yes'
        ],
        paint: {
          "fill-color": '#fcfcfc',
          'fill-opacity': .5
        }
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
          "line-color" : "#e89234",
          "line-width": .5
        }
      },
      interstates: {
        type: 'line',
        paint: {
          'line-width': .5,
          'line-color': '#cccccc'
        },
        source: 'interstates'
      },
      labels : {
        source: 'dvrpc-places',
        type: 'symbol',
        layout: {
          "text-field": "{NAME}",
          "text-font": [
            "Arial Unicode MS Bold",
              "Open Sans Semibold"
            ],
            "text-size": 8
        },
        paint: {
            "text-color": "#08506d",
              "text-halo-color": 'rgba(216,199,46,.1)',
              "text-halo-width": 2,
              "text-halo-blur": 3
        }
      },
    }
  },
  transitLines: {
    sourceDef: {
      type: 'geojson',
      data: 'https://opendata.arcgis.com/datasets/5af7a3e9c0f34a7f93ac8935cb6cae3b_0.geojson'
    },
    layers: {
      railLines: {
        type: 'line',
        paint: {
          "line-color": '#000',
          "line-width": 1.5
        }

      }

    }
  }
}

export { styles }