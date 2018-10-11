const styles = {
  base: {
    type: 'vector',
    url: 'https://tiles.dvrpc.org/data/dvrpc-freight-story.json',
    layers: {
      interstates: {
        type: 'line',
        paint: {
          'line-width': 1.75,
          'line-color': '#cccccc'
        },
      },
      county: {
        type: 'fill',
        filter: [
          '==',
          'DVRPC_REG',
          'Yes'
        ],
        paint: {
          "fill-color": 'rgba(216,199,46,.1)',
          'fill-outline-color': '#08506d'
        }
      },
      "dvrpc-places" : {
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
      }
    }
  }
}

export { styles }