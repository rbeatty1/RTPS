import "../../../css/pages/frequency/frequency.css";
import { LoadLayers } from "../../../utils/loadMapLayers";
import { styles } from "../map/map_styles/frequency";

const contentRef = {
  overview: {
    active: true,
    title: "Overview",
    scenario: undefined,
    content: {
      map: {
        source: "transit",
        layer: "overview"
      },
      table: false,
      text:
        "What happens if we double transit service frequency for all lines?<br>How does the doubled service frequency scenario compare to the existing scenario?</br></br>The answers below help us understand where potential latent demand for higher frequency transit exists. Want to know how your neighborhood or favorite routes might respond? Go ahead and explore!"
    }
  },
  existing: {
    active: false,
    title: "AM Peak Frequency",
    scenario: "Existing",
    content: {
      map: {
        source: "transit",
        layer: "existing",
        filter: undefined,
        scheme: [
          "#A63603",
          "#E6550D",
          "#FD8D3C",
          "#FDAE6B",
          "#FDD0A2",
          "#FEEDDE"
        ]
      },
      table: false,
      text:
        "This map depicts the current AM peak transit frequency (base scenario). Darker colors represent transit routes with more frequenct service. When clicking lines on the map, the pop-up will show the peak frequency as well as the mid-day frequency."
    }
  },
  transitChange: {
    active: false,
    title: "Changes in Transit Activity",
    scenario: "Doubled Frequency",
    content: {
      map: {
        source: "taz",
        layer: "transit",
        filter: [">", "tActual", 1],
        scheme: ["#D9F0A3", "#ADDD8E", "#78C679", "#31A354", "#006837"]
      },
      table: {
        labels: {
          rows: {
            NJ: ["Burlington", "Camden", "Gloucester", "Mercer"],
            PA: ["Bucks", "Chester", "Delaware", "Montgomery", "Philadelphia"]
          },
          columns: ["Geography", "Base", "2x Freq.", "Difference", "% Diff"]
        },
        datasets: {
          NJ: {
            Burlington: [2571, 3932, 1361, 52.94],
            Camden: [20642, 25346, 4704, 22.79],
            Gloucester: [2091, 3476, 1385, 66.25],
            Mercer: [22289, 27509, 5220, 23.42]
          },
          PA: {
            Bucks: [5307, 8287, 2980, 56.15],
            Chester: [4402, 6998, 2596, 58.98],
            Delaware: [34871, 42335, 7465, 21.41],
            Montgomery: [29478, 39023, 9545, 32.38],
            Philadelphia: [561976, 596792, 34816, 6.2]
          }
        },
        summaries: {
          NJ: {
            temp: [[], [], []],
            final: []
          },
          PA: {
            temp: [[], [], []],
            final: []
          }
        }
      },
      text:
        "This change in zonal transit activity map shows traffic analysis zones (TAZs) symbolized using the change in public transit activity in that zone under our doubled frequencies scenario. Transit acivity refers to the average number of passengers entering and leaving the zone via public transit within 24 hours. The darker the color, the greater the increase in transit activity when all frequencies are doubled."
    }
  },
  autoChange: {
    active: false,
    title: "Reductions in Car Trips",
    scenario: "Doubled Frequency",
    content: {
      map: {
        source: "taz",
        layer: "vehicles",
        filter: ["<", "vActual", -1],
        scheme: ["#FDD0A2", "#FDAE6B", "#FD8D3C", "#E6550D", "#A63603"]
      },
      table: {
        labels: {
          rows: {
            NJ: ["Burlington", "Camden", "Gloucester", "Mercer"],
            PA: ["Bucks", "Chester", "Delaware", "Montgomery", "Philadelphia"]
          },
          columns: ["Geography", "Base", "2x Freq.", "Difference", "% Diff"]
        },
        datasets: {
          NJ: {
            Burlington: [1087429, 1086168, -1261, -0.12],
            Camden: [1530889, 1527518, -3371, -0.22],
            Gloucester: [802337, 801037, -1300, -0.16],
            Mercer: [1320146, 1316283, -3863, -0.29]
          },
          PA: {
            Bucks: [1503945, 1501437, -2508, -0.17],
            Chester: [1284892, 1282801, -2091, -0.16],
            Delaware: [1179321, 1170955, -5367, -0.46],
            Montgomery: [2057847, 2050725, -7122, -0.35],
            Philadelphia: [2859025, 2835172, -23854, -0.83]
          }
        },
        summaries: {
          NJ: {
            temp: [[], [], []],
            final: []
          },
          PA: {
            temp: [[], [], []],
            final: []
          }
        }
      },
      text:
        "This change in zonal vehicle activity shows TAZs symbolized using the change in passenger vehicle activity entering and leaving the zone in 24 hours. The darker the color, the greater the decrease in vehicular activity when public transit frequencies are doubled."
    }
  },
  railLineChange: {
    active: false,
    title: "Changes in Rail Ridership",
    scenario: "Doubled Frequency",
    content: {
      map: {
        source: "transit",
        layer: "railLineChange",
        scheme: ["#FDD0A2", "#FDAE6B", "#FD8D3C", "#E6550D", "#A63603"]
      },
      table: false,
      text:
        "This map shows passenger rail lines symbolized by the estimated change in ridership if frequencies of all transit lines are doubled. Line color represents the absolute change in ridership, while the line weight represents the percent change. For example, a dark, thin line would imply a line where a large absolute increase in ridership is expected, but the change is relatively small due to high base ridership on the line. Nominal declines in forecasted ridership for a handful of lines reflect cases where passengers may be attracted to other (newly frequent) options, or simply variations in forecast results where percent changes are small."
    }
  },
  busLineAbsChange: {
    active: false,
    title: "Absolute Change in Bus Ridership",
    scenario: "Doubled Frequency",
    content: {
      map: {
        source: "transit",
        layer: "busLineAbsChange",
        scheme: ["#FDD0A2", "#FDAE6B", "#FD8D3C", "#E6550D", "#A63603"]
      },
      table: false,
      text:
        "This map shows the 25 bus routes with the greatest expected absolute increase in dailyu ridership between the existing and doubled frequency scenarios. Bus ridership refers to the number of passengers using that bus route on an average weekday. The darker the blue color, the greater the absolute increase in ridership."
    }
  },
  busLinePerChange: {
    active: false,
    title: "Percent Change in Bus Ridership",
    scenario: "Doubled Frequency",
    content: {
      map: {
        source: "transit",
        layer: "busLinePerChange",
        scheme: ["#FDD0A2", "#FDAE6B", "#FD8D3C", "#E6550D", "#A63603"]
      },
      table: false,
      text:
        "This map shows the 25 bus routes with the largest percent increase in daily ridership between the existing and doubled frequency scenarios. It is important to keep in mind that percent change is sometimes deceiving when base ridership is very low, making a small incrase appear as a substantial change. Only those bus routes with an estimated base scenario ridership of at least 100 are included. Many of the routes in this map are in suburban areas where base frequencies tend to be lower. The darker the blue color, the greater the percent increase in forecast ridership fi frequency is doubled."
    }
  },
  mapData: {
    zones: undefined,
    rail: {
      api: undefined,
      lookup: {
        'ACity Line' : {
          operator: 'NJT',
          name: 'Atlantic City Line'
        },
        AIR : {
          operator: 'SEPTA',
          name: 'Airport Line'
        },
        BSS: {
          operator: 'SEPTA',
          name : 'Broad St Subway'
        },
        CHE: {
          operator: 'SEPTA',
          name: 'Chestnut Hill East Line'
        },
        CHW: {
          operator: 'SEPTA',
          name : 'Chestnut Hill West Line'
        },
        CYN : {
          operator: 'SEPTA',
          name : 'Cynwyd Line'
        },
        DOY : {
          operator: 'SEPTA',
          name : 'Lansdale/Doylestown Line'
        },
        ELW : {
          operator: 'SEPTA',
          name : 'Media/Elwyn Line'
        },
        FOX : {
          operator : 'SEPTA',
          name : 'Fox Chase Line'
        },
        MFL : {
          operator: 'SEPTA',
          name : 'Market/Frankford Line'
        },
        'NE Corridor': {
          operator: 'AMTRAK',
          name : 'Northeast Corridor'
        },
        NHSL: {
          operator : 'SEPTA',
          name : 'Norristown High Speed Line'
        },
        NOR: {
          operator : 'SEPTA',
          name : 'Manayunk/Norristown Line'
        },
        PAO: {
          operator: 'SEPTA',
          name : 'Paoli/Thorndale Line',
        },
        PATCO : {
          operator: 'Delaware River Port Authority',
          name : 'PATCO High Speed Line'
        },
        'PCT Shuttle': {
          operator : 'NJT',
          name : 'Princeton Junction'
        },
        'River Line' : {
          operator : 'NJT',
          name : 'River Line Light Rail'
        },
        TRE : {
          operator : 'SEPTA',
          name : 'Trenton Line'
        },
        WAR : {
          operator : 'SEPTA',
          name : 'Warminster Line'
        },
        WIL : {
          operator : 'SEPTA/AMTRAK',
          name : 'Wilmington/Newark Line'
        },
        WTR : {
          operator : 'SEPTA',
          name : 'West Trenton Line'
        }

      }
    },
    bus: undefined
  }
};

const FormatNumber = num => {
  return num.toString().indexOf(".") != -1
    ? num + "%"
    : num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const ResymbolizeFeatureLayer = (map, section) => {
  let info = section.content.map;
  if (info && map.getLayer(`${info.source}-${info.layer}`)) {
    map.setLayoutProperty(
      `${info.source}-${info.layer}`,
      "visibility",
      "visible"
    );
    info.filter
      ? map.setFilter(`${info.source}-${info.layer}`, info.filter)
      : null;
  }
};
const HideFeatureLayer = (map, section) => {
  let info = section.content.map;
  map.getLayer(`${info.source}-${info.layer}`)
    ? map.setLayoutProperty(
        `${info.source}-${info.layer}`,
        "visibility",
        "none"
      )
    : null;
};
const CreateTable = data => {
  const CreateHeaderRow = (table, labels) => {
    let header = document.createElement("thead");
    header.classList.add("frequency__storySection-tableHeader");
    labels.columns.map((col, index) => {
      let label = document.createElement("td");
      label.innerText = col;
      header.appendChild(label);
    });
    return table.appendChild(header);
  };
  const CreateCountyContent = (state, county) => {
    let dataRow = document.createElement("tr"),
      cell = document.createElement("td");

    cell.innerText = county;
    dataRow.appendChild(cell);
    datasets[state][county].map((data, index) => {
      let dataCell = document.createElement("td");
      summaries[state].temp[index]
        ? summaries[state].temp[index].push(data)
        : null;
      dataCell.innerText = FormatNumber(data);
      dataRow.appendChild(dataCell);
    });
    return dataRow;
  };
  const CreateSummaryContent = (state, dataset) => {
    let dataRow = document.createElement("tr");
    dataRow.classList.add("summary");
    let cell = document.createElement("td");
    cell.innerText = state;
    dataRow.appendChild(cell);
    dataset.map(data => {
      let dataCell = document.createElement("td");
      dataCell.innerText = FormatNumber(data);
      dataRow.appendChild(dataCell);
    });
    return dataRow;
  };

  let labels = data.labels,
    datasets = data.datasets,
    summaries = data.summaries,
    table = document.createElement("table");

  table.classList.add("frequency__storySection-table");
  CreateHeaderRow(table, labels);

  for (let set in labels.rows) {
    let state = set,
      counties = labels.rows[set];
    // check if summary already exists, and clear it if so
    if (summaries[state].final.length != 0) {
      summaries[state] = {
        temp: [[], [], []],
        final: []
      };
    }
    // create rows for each county
    counties.map(county => {
      table.appendChild(CreateCountyContent(state, county));
    });
    // create state summaries
    summaries[state].temp.map(col => {
      summaries[state].final.push(col.reduce((num, value) => num + value, 0));
    });
    summaries[state].final.push(
      ((summaries[state].final[2] / summaries[state].final[0]) * 100).toFixed(2)
    );
    table.appendChild(CreateSummaryContent(state, summaries[state].final));
  }
  return table;
};
const BuildContent = (content, key, component) => {
  const BuildScene = element => {
    let link = document.querySelector(`#${element.id}-link`);
    new ScrollMagic.Scene({
      triggerElement: element,
      duration: element.getBoundingClientRect().height + 20
    })
      .on("enter", e => {
        if (contentRef[element.id].content.map)
          ResymbolizeFeatureLayer(component.map, contentRef[element.id]);
        link.classList.add("active");
        element.classList.add("active");
      })
      .on("leave", e => {
        if (contentRef[element.id].content.map)
          HideFeatureLayer(component.map, contentRef[element.id]);
        link.classList.remove("active");
        element.classList.remove("active");
      })
      .addTo(component.scroll);
  };
  let masterContainer = document.querySelector(".frequency__content-story");
  let section = document.createElement("div");
  section.classList.add("frequency__story-section");
  if (contentRef[key].active) section.classList.add("active");
  switch (key) {
    case "overview":
      section.innerHTML = `
      <div class="frequency__storySection-title">
        <div class="frequency__storySection-TitleDivider">
          <hr class="frequency__storySection-divider"><p class="frequency__storySection-SectionTitle">${
            contentRef[key].title
          }</p><hr class="frequency__storySection-divider">
        </div>
      </div>
      <div class="frequency__storySection-content"><p class="frequency__storySection-text">${
        content.text
      }</p></div>
      `;
      break;
    default:
      section.innerHTML = `
      <div class="frequency__storySection-title">
        <p class="frequency__storySection-SectionTitle">${
          contentRef[key].title
        }</p>
        <div class="frequency__storySection-TitleDivider">
          <hr class="frequency__storySection-divider"><p class="frequency__storySection-ScenarioTitle">${
            contentRef[key].scenario
          }</p><hr class="frequency__storySection-divider">
        </div>
      </div>
      <div class="frequency__storySection-content"><p class="frequency__storySection-text">${
        content.text
      }</p></div>
      `;
      break;
  }
  section.id = key;
  if (content.table) {
    section
      .querySelector(".frequency__storySection-content")
      .appendChild(CreateTable(content.table));
  }
  section.style.height = masterContainer.getBoundingClientRect().height / 2;
  masterContainer.appendChild(section);
  BuildScene(section);
};
const BuildNav = (component, sections) => {
  const nav = document.querySelector(".frequency__nav-container");
  let cnt = 1;
  for (let i in sections) {
    if (i != "mapData") {
      let sectionLink = document.createElement("div"),
        tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      sectionLink.innerHTML = `<p>${cnt}</p>`;
      sectionLink.classList.add("frequency__nav-link");

      tooltip.innerText = sections[i].title;
      sectionLink.appendChild(tooltip);
      sectionLink.id = i + "-link";
      sections[i].active ? sectionLink.classList.add("active") : null;
      sectionLink.addEventListener("click", e => {
        for (let node of document.querySelectorAll(
          ".frequency__story-section"
        )) {
          if (node.id == i) {
            sections[i].active = true;
            node.classList.add("active");
          } else {
            sections[node.id].active = false;
            node.classList.remove("active");
          }
          component.scroll.scrollTo(`#${i}`);
        }
        let nodes = document.querySelectorAll(`.${sectionLink.classList[0]}`);
        for (let node of nodes) {
          node.classList.contains("active")
            ? node.classList.remove("active")
            : null;
        }
        sectionLink.classList.toggle("active");
      });
      sectionLink.addEventListener("mouseenter", e => {
        let target = e.target;
        if (target.classList.contains("frequency__nav-link")) {
          target.children[1].classList.contains("active")
            ? null
            : target.children[1].classList.add("active");
        }
      });
      sectionLink.addEventListener("mouseleave", e => {
        let target = e.target;
        if (target.classList.contains("frequency__nav-link")) {
          target.children[1].classList.contains("active")
            ? target.children[1].classList.remove("active")
            : null;
        }
      });
      nav.appendChild(sectionLink);
      BuildContent(sections[i].content, i, component);
      cnt += 1;
    }
    document
      .querySelector(".frequency__content-story")
      .addEventListener("scroll", e => {});
  }
};

const LoadExisting = map => {
  const OverviewColor = (data, target, line) => {
    if (data < 15) target.push(line, "#E600A9");
    else if (data >= 15 && data < 30) target.push(line, "#028985");
    else if (data >= 30 && data < 60) target.push(line, "#999999");
    else target.push(line, "#ccc");
  };
  const ExistingColor = (data, target, line) => {
    if (data < 21) target.push(line, "#EEE2CF");
    else if (data >= 21 && data < 45) target.push(line, "#AABDB5");
    else target.push(line, "#3B758C");
  };
  const PopUps = (event, data) => {
    let feature = event.features[0].properties.linename,
      operator;
    event.features[0].properties.name.indexOf("njt") != -1
      ? (operator = "NJT")
      : (operator = "SEPTA");
    if (data[feature]) {
      let popup = `
          <div class='frequency__popup-container'>
            <div class='frequency__popup-header'>${operator} Route ${feature}</div>
            <div class='frequency__popup-content'><span class="frequency__popup-emphasis">${
              data[feature].am
            } Minute</span> <span class="frequency__popup-unit">AM Peak Frequency</span></div>
            <div class='frequency__popup-content'><span class="frequency__popup-emphasis">${
              data[feature].midday
            } Minute</span> <span class="frequency__popup-unit">Mid-day Base Frequency</span></div>
          </div>`;
      return popup;
    }
  };
  fetch("http://localhost:8000/api/rtps/frequency?transit")
    .then(
      response =>
        response.ok ? response.json() : console.error("error will robinson")
    )
    .then(existing => {
      let layerDef = [
        {
          id: "transit-overview",
          source: "transit",
          "source-layer": "transit_lines",
          type: "line",
          paint: {
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7,
              0.25,
              8,
              0.75,
              9,
              1,
              12,
              3
            ],
            "line-color": ["match", ["get", "linename"]]
          },
          layout: { visibility: "visible" }
        },
        {
          id: "transit-existing",
          source: "transit",
          type: "line",
          "source-layer": "transit_lines",
          paint: {
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7,
              0.25,
              8,
              0.75,
              9,
              1,
              12,
              3
            ],
            "line-color": ["match", ["get", "linename"]]
          },
          layout: { visibility: "none" }
        }
      ];
      for (let line in existing.cargo) {
        OverviewColor(
          existing.cargo[line].midday,
          layerDef[0].paint["line-color"],
          line
        );
        ExistingColor(
          existing.cargo[line].am,
          layerDef[1].paint["line-color"],
          line
        );
      }
      layerDef[0].paint["line-color"].push("rgba(255,255,255,0)");
      layerDef[1].paint["line-color"].push("rgba(255,255,255,0)");
      layerDef.map(layer => {
        map.addLayer(layer, "base-hwyLabels");
        map.on("click", layer.id, e => {
          let offsets = {
            top: [0, 0],
            "top-left": [0, 0],
            "top-right": [0, 0],
            bottom: [0, 0],
            "bottom-left": [0, 0],
            "bottom-right": [0, 0],
            left: [0, 0],
            right: [0, 0]
          };
          let content = PopUps(e, existing.cargo);
          let popup = new mapboxgl.Popup({
            offset: offsets,
            className: "frequency__popup"
          })
            .setLngLat(e.lngLat)
            .setHTML(content)
            .addTo(map);
        });
        map.on('mouseenter', layer.id, ()=> map.getCanvas().style.cursor = 'pointer')
        map.on('mouseleave', layer.id, ()=> map.getCanvas().style.cursor = '')
      });
    });
};
const LoadTaz = map => {
  const PopUps = (layer, event, data) => {
    let target = event.features[0].properties.TAZN;
    if (data[target]) {
      let feat = data[target];
      let popup;
      switch (layer) {
        case "transit":
          popup = `
              <div class='frequency__popup-container'>
                <div class='frequency__popup-header'>TAZ ${target}</div>
                <div class='frequency__popup-content'><span class="frequency__popup-emphasis">Base Scenario</span> ${FormatNumber(
                  Math.floor(feat.tBase)
                )} <span class="frequency__popup-unit">Passengers / Day</span></div>
                <div class='frequency__popup-content'><span class="frequency__popup-emphasis">Doubled Frequency</span> ${FormatNumber(
                  Math.floor(feat.tDouble)
                )} <span class="frequency__popup-unit">Passengers / Day</span></div>
                <div class='frequency__popup-content'><span class="frequency__popup-emphasis">Absolute Change</span> ${FormatNumber(
                  Math.floor(feat.tActual)
                )} <span class="frequency__popup-unit">Passengers / Day</span></div>
                <div class='frequency__popup-content'><span class="frequency__popup-emphasis">Percent Change</span> ${
                  feat.tPercent
                }<span class="frequency__popup-unit">%</span></div>
              </div>
            `;
          break;
        case "vehicles":
          popup = `
              <div class='frequency__popup-container'>
                <div class='frequency__popup-header'>TAZ ${target}</div>
                <div class='frequency__popup-content'><span class="frequency__popup-emphasis">Base Scenario</span> ${FormatNumber(
                  Math.floor(feat.vBase)
                )} <span class="frequency__popup-unit">Passengers / Day</span></div>
                <div class='frequency__popup-content'><span class="frequency__popup-emphasis">Doubled Frequency</span> ${FormatNumber(
                  Math.floor(feat.vDouble)
                )} <span class="frequency__popup-unit">Passengers / Day</span></div>
                <div class='frequency__popup-content'><span class="frequency__popup-emphasis">Absolute Change</span> ${FormatNumber(
                  Math.floor(feat.vActual)
                )} <span class="frequency__popup-unit">Passengers / Day</span></div>
                <div class='frequency__popup-content'><span class="frequency__popup-emphasis">Percent Change</span> ${
                  feat.vPercent
                }<span class="frequency__popup-unit">%</span></div>
              </div>
            `;
          break;
        default:
          popup = `
              <div class='frequency__popup-container'>
                <div class='frequency__popup-error'>Something went wrong!</div>
              </div>
            `;
      }
      return popup;
    }
  };
  fetch(
    "https://services1.arcgis.com/LWtWv6q6BJyKidj8/arcgis/rest/services/TAZ/FeatureServer/0/query?where=1%3D1&outFields=TAZN&geometryPrecision=4&outSR=4326&returnExceededLimitFeatures=true&f=pgeojson"
  )
    .then(
      response =>
        response.ok ? response.json() : console.error("error will robinson")
    )
    .then(taz => {
      fetch("http://localhost:8000/api/rtps/frequency?zone")
        .then(
          response =>
            response.ok ? response.json() : console.error("error will robinson")
        )
        .then(apiJson => {
          taz.features.map(zone => {
            if (apiJson.cargo[zone.properties.TAZN.toString()]) {
              zone.properties["tActual"] =
                apiJson.cargo[zone.properties.TAZN.toString()].tActual;
              zone.properties["vActual"] =
                apiJson.cargo[zone.properties.TAZN.toString()].vActual;
            }
          });
          let sourceDef = {
            data: taz,
            type: "geojson"
          };
          map.addSource("taz", sourceDef);

          let layerDefs = [
            {
              id: "taz-transit",
              source: "taz",
              type: "fill",
              paint: {
                "fill-color": [
                  "step",
                  ["get", "tActual"],
                  "rgba(255,255,255,0)",
                  1,
                  "#D9F0A3",
                  37,
                  "#ADDD8E",
                  71,
                  "#78C679",
                  123,
                  "#31A354",
                  222,
                  "#006837"
                ],
                "fill-opacity": 0.75
              },
              layout: {
                visibility: "none"
              }
            },
            {
              id: "taz-vehicles",
              source: "taz",
              type: "fill",
              paint: {
                "fill-color": [
                  "step",
                  ["get", "vActual"],
                  "#A63603",
                  -197,
                  "#E6550D",
                  -90,
                  "#FD8D3C",
                  -45.1,
                  "#FDAE6B",
                  -23.4,
                  "#FDD0A2",
                  -1,
                  "rgba(255,255,255,0)"
                ],
                "fill-opacity": 0.75
              },
              layout: {
                visibility: "none"
              }
            }
          ];
          layerDefs.map(layer => {
            map.addLayer(layer, "base-muniOutline");
            map.on("click", layer.id, e => {
              let offsets = {
                top: [0, 0],
                "top-left": [0, 0],
                "top-right": [0, 0],
                bottom: [0, 0],
                "bottom-left": [0, 0],
                "bottom-right": [0, 0],
                left: [0, 0],
                right: [0, 0]
              };
              let content = PopUps(layer.id.split("-")[1], e, apiJson.cargo);
              let popup = new mapboxgl.Popup({
                offset: offsets,
                className: "frequency__popup"
              })
                .setLngLat(e.lngLat)
                .setHTML(content)
                .addTo(map);
            });
            map.on('mouseenter', layer.id, ()=> map.getCanvas().style.cursor = 'pointer')
            map.on('mouseleave', layer.id, ()=> map.getCanvas().style.cursor = '')
          });
        });
    });
};
const LoadBus = map => {
  const PopUps = (data, event) =>{
    let target = event.features[0].properties.linename,
      operator,
      popup;
    event.features[0].properties.name.indexOf('njt') != -1 ? operator = 'NJT' : operator = 'SEPTA'
    data.map(route=>{
      if (route.linename == target){
        popup = `
          <div class="frequency__popup-container">
            <div class="frequency__popup-header">${operator} Route ${target}</div>
            <div class="frequency__popup-content"><span class="frequency__popup-emphasis">Actual Change</span> ${FormatNumber(Math.floor(route.AllBusAbsolute))} <span class="frequency__popup-unit">Passengers / Day</span></div>
            <div class="frequency__popup-content"><span class="frequency__popup-emphasis">Percent Change</span> ${route.AllBusPercent}<span class="frequency__popup-unit">%</span></div>
          </div>  
        `
      }
    })
    return popup
  }
  fetch("http://localhost:8000/api/rtps/frequency?bus")
    .then(
      response =>
        response.ok ? response.json() : console.error("error, will robinson")
    )
    .then(bus => {
      let busLayers = [
        {
          id: "transit-busLineAbsChange",
          source: "transit",
          "source-layer": "transit_lines",
          type: "line",
          paint: {
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7,
              0.25,
              8,
              0.75,
              9,
              1,
              12,
              3
            ],
            "line-color": ["match", ["get", "linename"]]
          },
          layout: { visibility: "none" }
        },
        {
          id: "transit-busLinePerChange",
          source: "transit",
          "source-layer": "transit_lines",
          type: "line",
          paint: {
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7,
              0.25,
              8,
              0.75,
              9,
              1,
              12,
              3
            ],
            "line-color": ["match", ["get", "linename"]]
          },
          layout: { visibility: "none" }
        }
      ];
      contentRef.mapData.bus = { absolute: [], percent: [] };
      bus.cargo.forEach(route => {
        contentRef.mapData.bus.absolute.push(route);
        contentRef.mapData.bus.percent.push(route);
      });
      contentRef.mapData.bus.absolute.sort(
        (a, b) => b.AllBusAbsolute - a.AllBusAbsolute
      );
      contentRef.mapData.bus.percent.sort(
        (a, b) => b.AllBusPercent - a.AllBusPercent
      );
      contentRef.mapData.bus.absolute.map((value, index) => {
        if (index < 25) {
          if (value.AllBusAbsolute < 1400)
            busLayers[0].paint["line-color"].push(value.linename, "#E6EECF");
          else if (value.AllBusAbsolute <= 1600 && value.AllBusAbsolute > 1400)
            busLayers[0].paint["line-color"].push(value.linename, "#9BC4C1");
          else if (value.AllBusAbsolute <= 1800 && value.AllBusAbsolute > 1600)
            busLayers[0].paint["line-color"].push(value.linename, "#69A8B7");
          else if (value.AllBusAbsolute <= 2200 && value.AllBusAbsolute > 1800)
            busLayers[0].paint["line-color"].push(value.linename, "#4B7E98");
          else if (value.AllBusAbsolute > 2200)
            busLayers[0].paint["line-color"].push(value.linename, "#2E557A");
        }
      });
      contentRef.mapData.bus.percent.map((value, index) => {
        if (index < 25) {
          if (value.AllBusPercent <= 85)
            busLayers[1].paint["line-color"].push(value.linename, "#E6EECF");
          else if (value.AllBusPercent <= 100 && value.AllBusPercent > 85)
            busLayers[1].paint["line-color"].push(value.linename, "#9BC4C1");
          else if (value.AllBusPercent <= 130 && value.AllBusPercent > 100)
            busLayers[1].paint["line-color"].push(value.linename, "#69A8B7");
          else if (value.AllBusPercent > 130)
            busLayers[1].paint["line-color"].push(value.linename, "#3D6A89");
        }
      });
      for (let layer in busLayers) {
        busLayers[layer].paint["line-color"].push("rgba(255,255,255,0)");
      }
      busLayers.map(layer => {
        map.addLayer(layer, "base-hwyLabels");
        map.on('click', layer.id, e=>{
          let offsets = {
            top: [0, 0],
            "top-left": [0, 0],
            "top-right": [0, 0],
            bottom: [0, 0],
            "bottom-left": [0, 0],
            "bottom-right": [0, 0],
            left: [0, 0],
            right: [0, 0]
          };
          let content = PopUps(bus.cargo, e);
          let popup = new mapboxgl.Popup({
            offset: offsets,
            className: "frequency__popup"
          })
            .setLngLat(e.lngLat)
            .setHTML(content)
            .addTo(map);
        })
        map.on('mouseenter', layer.id, ()=> map.getCanvas().style.cursor = 'pointer')
        map.on('mouseleave', layer.id, ()=> map.getCanvas().style.cursor = '')
      });
    });
};
const LoadRail = map => {
  const LineWidth = (data, target, name) => {
    if (data < 0) target.push(name, 0.5);
    else if (data >= 0 && data < 30) target.push(name, 1);
    else if (data >= 30 && data < 50) target.push(name, 2);
    else if (data >= 50 && data < 80) target.push(name, 3);
    else if (data >= 80 && data < 100) target.push(name, 4);
    else if (data >= 100) target.push(name, 5);
  };
  const LineColor = (data, target, name) => {
    if (data < -100) target.push(name, "#d8c72e");
    else if (data >= -100 && data < 0) target.push(name, "#eadb96");
    else if (data >= 0 && data < 1000) target.push(name, "#06bf9c");
    else if (data >= 1000 && data < 5000) target.push(name, "#859cad");
    else if (data >= 5000) target.push(name, "#08506d");
  };
  const PopUps = (data, event) =>{
    let target = event.features[0].properties.linename,
      popup
    if (data[target]){
      console.log(target)
      let feat = data[target]
      let lookup = contentRef.mapData.rail.lookup
      let name
      lookup[target] ? name = `${contentRef.mapData.rail.lookup[target].operator} ${contentRef.mapData.rail.lookup[target].name}` : name =`Trolley Route ${target}`
      popup = `
        <div class='frequency__popup-container'>
          <div class='frequency__popup-header'>${name}</div>
          <div class='frequency__popup-content'><span class="frequency__popup-emphasis">Absolute Change</span> ${FormatNumber(Math.floor(feat.absolute))} <span class="frequency__popup-unit">Passengers / Day</span></div>
          <div class='frequency__popup-content'><span class="frequency__popup-emphasis">Percent Change</span> ${feat.percent}<span class="frequency__popup-unit">%</span></div>
        </div>
      `
    }
    return popup
  }
  fetch("http://localhost:8000/api/rtps/frequency?rail")
    .then(
      response =>
        response.ok ? response.json() : console.error("error will robinson")
    )
    .then(rail => {
      contentRef.mapData.rail.api = rail;
      let layerDef = {
        id: "transit-railLineChange",
        source: "transit",
        "source-layer": "transit_lines",
        type: "line",
        layout: { visibility: "none" },
        paint: {
          "line-width": ["match", ["get", "linename"]],
          "line-color": ["match", ["get", "linename"]],
          "line-opacity": 0.75
        }
      };
      for (let line in rail.cargo) {
        let data = rail.cargo[line];
        LineWidth(data.percent, layerDef.paint["line-width"], line);
        LineColor(data.absolute, layerDef.paint["line-color"], line);
      }
      layerDef.paint["line-width"].push(0);
      layerDef.paint["line-color"].push("rgba(255,255,255,0)");
      map.addLayer(layerDef, "base-hwyLabels");
      map.on('click', layerDef.id, e=>{
        let offsets = {
          top: [0, 0],
          "top-left": [0, 0],
          "top-right": [0, 0],
          bottom: [0, 0],
          "bottom-left": [0, 0],
          "bottom-right": [0, 0],
          left: [0, 0],
          right: [0, 0]
        };
        let content = PopUps(rail.cargo, e);
        let popup = new mapboxgl.Popup({
          offset: offsets,
          className: "frequency__popup"
        })
          .setLngLat(e.lngLat)
          .setHTML(content)
          .addTo(map);
      })
      map.on('mouseenter', layerDef.id, ()=> map.getCanvas().style.cursor = 'pointer')
      map.on('mouseleave', layerDef.id, ()=> map.getCanvas().style.cursor = '')
    });
};

const BuildMap = container => {
  const extent = {
    center: [-75.247, 40.066],
    zoom: 8.4
  };
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYmVhdHR5cmUxIiwiYSI6ImNqOGFpY3o0cTAzcXoycXE4ZTg3d3g5ZGUifQ.VHOvVoTgZ5cRko0NanhtwA";
  let map = new mapboxgl.Map({
    container: container,
    style: "mapbox://styles/beattyre1/cjky7crbr17og2rldo6g7w5al",
    center: extent.center,
    zoom: extent.zoom,
    minZoom: 7,
    hash: true
  });
  map.on("load", () => {
    map.addSource("transit", {
      type: "vector",
      url: "https://tiles.dvrpc.org/data/dvrpc-tim-transit.json"
    });
    map.resize();
    LoadLayers(map, styles);
    LoadExisting(map);
    LoadTaz(map);
    LoadBus(map);
    LoadRail(map);
    map.flyTo({
      center: extent.center,
      zoom: extent.zoom
    });
    // map.scrollZoom.disable();
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
  });

  return map;
};

export class Frequency {
  constructor() {
    this.render();
  }
  render() {
    document.querySelector("#main").innerHTML = `
    <div id="frequency-page">
      <div class="frequency__nav-container"></div>
      <div class="frequency__content-container">
        <div class="frequency__content-story"></div>
        <div class="frequency__content-map"></div>
      </div>
    </div>
    `;
    this.scroll = new ScrollMagic.Controller({
      container: document.querySelector(".frequency__content-story"),
      loglevel: 4
    });
    BuildNav(this, contentRef);
    this.map = BuildMap(document.querySelector(".frequency__content-map"));
  }
}
