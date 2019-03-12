import "../../../css/pages/frequency/frequency.css";
import { LoadLayers, addRailLayers } from "../../../utils/loadMapLayers";
import {FormatNumber} from "../../../utils/formatNumber"
import { styles } from "../map/map_styles/frequency";
import { CreateDvrpcNavControl } from "../../../utils/defaultExtentControl";
import { headerRender } from "../../header/header";
import { HeaderElements } from "../../header/HeaderElements";
import { Footer } from "../../footer/footer";

const contentRef = {
  about: {
    active: false,
    title: 'Overview',
    scenario: undefined,
    content: {
      map: false,
      table: false,
      text:  `
      <p><strong>Where is there potential latent demand for higher frequency transit service?</strong></p>
      <p>What happens if we double transit service frequency for all lines? How does doubled service frequency scenario compare to the existing scenario?</p>
      <p>The answers below help us understand where potential latent demand for higher frequency transit exists. Want to know how you neighborhood or favorite
      routes might respond? Scroll down to begin exploring!</p>
      `
    }
  },
  overview: {
    active: false,
    title: "Weekday Frequency",
    scenario: "Existing",
    content: {
      map: {
        source: "transit",
        layer: ["overview"],
        legend: [
          {
            name: "Average Weekday Frequency",
            units: "Trips/Hour",
            scheme: [
              ["0", "#ddd"],
              ["1", "#aed8ca"],
              ["2—3", "#74ccb3"],
              ["4 +", "#06bf9c"]
            ]
          }
        ]
      },
      table: false,
      text: `
      <p>This map depicts the existing weekday transit frequency by the average number of trips per hour. 
      Darker colors represent transit routes that have more frequent service.
      </p>
      `
        
    }
  },
  transitChange: {
    active: false,
    title: "Changes in Transit Ridership",
    scenario: "Doubled Frequency",
    content: {
      map: {
        source: "taz",
        layer: ["transit"],
        legend: [
          {
            name: "Increase in Transit Activity",
            scheme: [
            ["Very Small", "#faffe2"],
            ["Small", "#e0ebb8"],
            ["Moderate", "#c5d890"],
            ["Great", "#a9c568"],
            ["Greatest", "#8bb23f"]
          ]
          }
        ]
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
      text:`
      <p>This change in zonal transit ridership map shows traffic analysis zones (<abbr title="Traffic Analysis Zones">TAZ</abbr>)
      symbolized using the change in public transit ridership in that zone under the doubled frequency scenario. The darker the color,
      the greater the increase in transit ridership when all frequencies are doubled.
      </p>`
    }
  },
  autoChange: {
    active: false,
    title: "Reductions in Car Trips",
    scenario: "Doubled Frequency",
    content: {
      map: {
        source: "taz",
        layer: ["vehicles"],
        legend: [{
          name: "Decrease in Automobile Activity",
          scheme: [
            ["Very Small", "#fffae1"],
            ["Small", "#f5e3b2"],
            ["Moderate", "#eeca86"],
            ["Great", "#ebaf5c"],
            ["Greatest", "#e89234"]
          ]
        }]
      },
      table: {
        labels: {
          rows: {
            NJ: ["Burlington", "Camden", "Gloucester", "Mercer"],
            PA: ["Bucks", "Chester", "Delaware", "Montgomery", "Philadelphia"]
          },
          columns: ["Geography", "Base", "2x Freq.", "Absolute Diff.", "% Diff.", "% Diff VMT"]
        },
        datasets: {
          NJ: {
            Burlington: [1087429, 1086168, -1261, -0.12, -0.24],
            Camden: [1530889, 1527518, -3371, -0.22, -0.21],
            Gloucester: [802337, 801037, -1300, -0.16, -0.22],
            Mercer: [1320146, 1316283, -3863, -0.29, -0.19]
          },
          PA: {
            Bucks: [1503945, 1501437, -2508, -0.17, -0.22],
            Chester: [1284892, 1282801, -2091, -0.16, -0.19],
            Delaware: [1179321, 1170955, -5367, -0.46, -0.40],
            Montgomery: [2057847, 2050725, -7122, -0.35, -0.34],
            Philadelphia: [2859025, 2835172, -23854, -0.83, -0.58]
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
      text:`
      <p>
      This map shows <abbr title="Traffic Analysis Zone">TAZ</abbr>s symbolized using the change in car trips entering
      and leaving the zone in 24 hours. The darker the color, the greater the reduction in car trips when public
      transit frequencies are doubled.
      </p>
      `
    }
  },
  railLineChange: {
    active: false,
    title: "Changes in Rail Ridership",
    scenario: "Doubled Frequency",
    content: {
      map: {
        source: "transit",
        layer: ["railLineChange"],
        legend: [{
          units: "Estimated Passengers per Day",
          name: "Absolute Ridership Change",
          scheme: [
            ["Low", "#fee391"],
            ["", "#fec44f"],
            ["", "#fe9929"],
            ["", "#d95f0e"],
            ["High", "#993404"]
          ]
        }]
      },
      table: false,
      text:`
      <p>This map shows passenger rail lines symbolized by the estimated change in ridership if frequencies of all transit routes are doubled.
      Line color represents the absolute change in ridership, while the line weight represents the percent change. For example, a dark, thin
      line would imply a line where a large absolute increase in ridership is expected, but the percent change is relatively small
      due to the high existing ridership on the line.
      </p>
      `
    }
  },
  bus: {
    active: false,
    title: "Changes in Bus Ridership",
    scenario: "Doubled Frequency",
    content: {
      map: {
        source: "transit",
        layer: ["busAbsChange","busPercent"],
        legend: [{
          name: "Absolute Ridership Change",
          units: "Estimated Passengers per Day",
          scheme: [
            ["< 1,400", "#ffffec"],
            ["1,400–1,600", "#f4f2c0"],
            ["1,601–1,800", "#eae494"],
            ["1,801–2,200", "#e1d665"],
            ["> 2,200", "#d8c72e"]
          ]
        },{
            name: "Percent Change in Ridership",
            scheme: [
              ["< 85%", "#ddd"],
              ["85%–100%", "#aed8ca"],
              ["101%–130%", "#74ccb3"],
              ["> 130%", "#06bf9c"]
            ]
          }
        ]
      },
      table: false,
      text:`
      <p>This map shows the bus routes with the greatest expected increase in daily ridership when service frequency is doubled. Bus ridership
      refers to the number of passengers using that bus route on an average weekday. The yellow routes are the top 25 in estimated <strong>absolute</strong>
      ridership gain. The darker the yellow, the greater the absolute increase in ridership.</p>
      <p>The green lines show the 25 bus routes with the largest percent increase in daily ridership when service frequency is doubled. The darker the green,
      the greater the percent increase in forecast ridership.</p>
      <p>It is important to keep in mind that percent change is sometimes deceiving when base ridership is low, making a small increase appear as a substantial 
      change. Only those bus routes with an estimated base scenario ridership of at least 100 are included. Many of the green routes are in suburban ares where
      base frequencies tend to be lower, while many of the yellow routes are in urban areas where frequency and ridership are already high.</p>
      `}
  },
  mapData: {
    existing: {},
    zones: undefined,
    rail: {
      api: undefined,
      lookup: {
        "ACity Line": {
          operator: "NJT",
          name: "Atlantic City Line"
        },
        AIR: {
          operator: "SEPTA",
          name: "Airport Line"
        },
        BSS: {
          operator: "SEPTA",
          name: "Broad St Subway"
        },
        CHE: {
          operator: "SEPTA",
          name: "Chestnut Hill East Line"
        },
        CHW: {
          operator: "SEPTA",
          name: "Chestnut Hill West Line"
        },
        CYN: {
          operator: "SEPTA",
          name: "Cynwyd Line"
        },
        DOY: {
          operator: "SEPTA",
          name: "Lansdale/Doylestown Line"
        },
        ELW: {
          operator: "SEPTA",
          name: "Media/Elwyn Line"
        },
        FOX: {
          operator: "SEPTA",
          name: "Fox Chase Line"
        },
        MFL: {
          operator: "SEPTA",
          name: "Market/Frankford Line"
        },
        "NE Corridor": {
          operator: "AMTRAK",
          name: "Northeast Corridor"
        },
        NHSL: {
          operator: "SEPTA",
          name: "Norristown High Speed Line"
        },
        NOR: {
          operator: "SEPTA",
          name: "Manayunk/Norristown Line"
        },
        PAO: {
          operator: "SEPTA",
          name: "Paoli/Thorndale Line"
        },
        PATCO: {
          operator: "Delaware River Port Authority",
          name: "PATCO High Speed Line"
        },
        "PCT Shuttle": {
          operator: "NJT",
          name: "Princeton Junction"
        },
        "River Line": {
          operator: "NJT",
          name: "River Line Light Rail"
        },
        TRE: {
          operator: "SEPTA",
          name: "Trenton Line"
        },
        WAR: {
          operator: "SEPTA",
          name: "Warminster Line"
        },
        WIL: {
          operator: "SEPTA/AMTRAK",
          name: "Wilmington/Newark Line"
        },
        WTR: {
          operator: "SEPTA",
          name: "West Trenton Line"
        }
      }
    },
    bus: undefined
  }
};

/*
  ResymbolizeFeatureLayer(map,section)
    @desc: Called when ScrollStory hits a triggerpoint and displays appropriate layer. Changes visibility property of appropriate map data to visible
    @param: 
      - map => map component to pass change in visibility to
      - section => section reference object in order to grab appropriate layer
*/
const ResymbolizeFeatureLayer = (map, section) => {
  let info = section.content.map;
  // if section has a map && feature layer already exists
  if (info) {
    info.layer.map(layer=>{
      // make visible
      map.setLayoutProperty(
        `${info.source}-${layer}`,
        "visibility",
        "visible"
      );
    })
  }
};

/*
  HideFeatureLayer(map,section)
    @desc: Called when ScrollStory exits a scene. Changes visibility property of appropriate map data to none
    @param: 
      - map => map component to pass change in visibility to
      - section => section reference object in order to grab appropriate layer
*/
const HideFeatureLayer = (map, section) => {
  let info = section.content.map;
  if (info){
    info.layer.map(layer=>{
      map.getLayer(`${info.source}-${layer}`)
        ? map.setLayoutProperty(
            `${info.source}-${layer}`,
            "visibility",
            "none"
          )
        : null;
    })

  }
};

/*
  CreateTable(data)
    @desc: Creates an HTML table containing specified data
    @param:
      data => formatted data to be inserted into table
    @return: a <table></table> element to be appended to the ScrollStory section content
*/
const CreateTable = (section, data) => {
  /*
    CreateHeaderRow(table, labels)
      @desc: Creates a header row for the section's table
      @param:
        -table => table element that header will be appended to
        - labels => labels to be inserted into header cells
      @return: table that has had the header row appended to it
  */
  const CreateHeaderRow = (table, labels) => {
    // create row element
    let header = document.createElement("thead");
    header.classList.add("frequency__storySection-tableHeader");
    // append cells for each column
    labels.columns.map(col => {
      let label = document.createElement("td");
      label.innerText = col;
      header.appendChild(label);
    });
    return table.appendChild(header);
  };
  /*
    CreateCountyContent(state, county)
      @desc: Creates rows for each county in the table and populates cells with appropriate data
      @param:
        - state => state that the county resides in
        - county => county that will be used to grab data from the reference object
      @return => a <tr></tr> element contain cells for each column of the table that are populated with the appropriate data
  */
  const CreateCountyContent = (state, county) => {
    // create row and row label cell
    let dataRow = document.createElement("tr"),
      cell = document.createElement("td");
    cell.innerText = county;
    dataRow.appendChild(cell);
    // append cell for each data point in dataset stored in reference object
    datasets[state][county].map((data, index) => {
      let dataCell = document.createElement("td");
      summaries[state].temp[index]
        ? summaries[state].temp[index].push(data)
        : null
      // format number
      dataCell.innerText = FormatNumber(data);
      dataRow.appendChild(dataCell);
    });
    return dataRow;
  };
  /*
    CreateSummaryContent(state, dataset)
      @desc: Creates a row for the summary of the specified table rows
      @param:
        - state => state that will be summarized
        - dataset => something?
      @return: a <tr></tr> element containing cells for each column of the table that are populated with the appropriate data
      @TODO: I think this can be better. Especially since it doesn't include the formatting, and is missing the suburban PA and DVRPC Regional summaries.
  */
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
    // the VMT data isn't really anywhere except for an excel sheet so this is easier than trying to compute the summaries for each state
    if (section.id == 'autoChange'){
      let dataCell = document.createElement('td')
      dataCell.innerText = state == 'NJ' ? '-0.22%' : '-0.35%'
      dataRow.appendChild(dataCell)
    }
    return dataRow;
  };

  const CreateRegionSummary = summaries =>{
    let temp = []
    for (let state in summaries){
      summaries[state].final.map((data, index)=>{
        if (!temp[index]) temp.push(parseFloat(data))
        else{
          if (index < 2 ) temp[index] = temp[index] + parseFloat(data)
          else if (index == 2)temp[2] = temp[1] - temp[0]
          else temp[index] = ((temp[2]/temp[0])*100).toFixed(2)
        } 
      })
    }
    let row = document.createElement('tfoot'),
      label = document.createElement('td')
    row.classList.add('dvrpc-summary')
    label.innerText = 'DVRPC'
    row.appendChild(label)
    
    temp.map(data=>{
      let cell = document.createElement('td')
      cell.innerText = FormatNumber(data)
      row.appendChild(cell)
    })
    if (section.id == 'autoChange'){
      let cell = document.createElement('td')
      cell.innerText = '-0.30%'
      row.appendChild(cell)
    }
    return row
  }

  let labels = data.labels,
    datasets = data.datasets,
    summaries = data.summaries,
    table = document.createElement("table");

  table.classList.add("frequency__storySection-table");
  CreateHeaderRow(table, labels);

  // Create the appropriate amount of content rows
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
    // TODO: You can do better.
    summaries[state].temp.map(col => {
      summaries[state].final.push(col.reduce((num, value) => num + value, 0));
    });
    summaries[state].final.push(
      ((summaries[state].final[2] / summaries[state].final[0]) * 100).toFixed(2)
    );
    table.appendChild(CreateSummaryContent(state, summaries[state].final));
  }

  let dvrpcSummary = CreateRegionSummary(summaries)
  table.appendChild(dvrpcSummary)
  return table;
};

/*
  BuildLegend(section)
    @desc: Builds appropriate legend, driven by the content being displayed on the map
    @param:
      - section => section that the legend will be built for
*/
const BuildLegend = section => {
  // is there a map for this section?
  if (contentRef[section.id].content.map) {
    // set things up
    let legends = contentRef[section.id].content.map.legend
    legends.map(data=>{
      let legend = section.querySelector(".frequency__storySection-legend"),
        container = document.createElement('div'),
        title = document.createElement("h3"),
        breakContainer = document.createElement("div");
  
      // house keeping
      title.innerText = data.name;
      title.classList.add("frequency__legend-title");
      title.style.color = data.scheme[data.scheme.length - 1][1];
      container.classList.add('frequency__storySection-legendContainer')
      breakContainer.classList.add("frequency__legend-breakContainer");
      container.appendChild(title);
  
      // Do you have to specify the map units?
      if (data.units) {
        let units = document.createElement("h4");
        units.classList.add("frequency__legend-units");
        units.innerText = `(${data.units})`;
        container.appendChild(units);
      }
      container.appendChild(breakContainer);
      let i = 0;
      // create element for each legend break
      for (let color of data.scheme) {
        let container = document.createElement("div"),
          thisBreak;
        container.classList.add("frequency__legend-break");
        breakContainer.style.justifyContent = "";
        thisBreak = document.createElement("div");
        thisBreak.classList.add("frequency__legend-rect");
        thisBreak.style.background = color[1];
        thisBreak.innerText = color[0];
        // make sure the first element has enough text contrast by making the text color the darkest value of the color scheme
        if (i < 2)
          thisBreak.style.color = data.scheme[data.scheme.length - 1][1];
        breakContainer.appendChild(thisBreak);
        i++;
      }
      if (section.id == 'railLineChange'){
        let title = document.createElement('p'),
          breakContainer = document.createElement('div')
  
        title.innerText = 'Percent Change in Ridership'
        title.classList.add('frequency__legend-title')
        title.classList.add('railChange')
        title.style.color = data.scheme[data.scheme.length -1][1]
        breakContainer.classList.add('frequency__legend-breakContainer')
        breakContainer.classList.add('railChange')
        container.appendChild(title)
  
        let breaks = ['< 0', -1, 30, 50, 80, 100]
        breaks.map((classBreak, index)=>{
          let classification = document.createElement('p')
          if (index == 0){
            classification.innerText = `${classBreak}%`
          }
          else if (index == breaks.length-1){
            classification.innerText = '100% <'
          }
          else{
            classification.innerHTML = `${classBreak+1}%&ndash;${breaks[index+1]}%`
          }
          classification.classList.add('frequency__legend-railPercent')
          classification.style.borderBottom = `${(index+1)*2}px solid #aaa`
          breakContainer.appendChild(classification)
        })
        container.appendChild(breakContainer)
      }
      legend.appendChild(container)
    })
  }
};

/*
  BuildContent(content, key, component)
    @desc: Actually build the HTML content that will contain the ScrollStory content
    @param: 
      - content => section content
      - key => name of section
      - component => page component to append to
*/
const BuildContent = (content, key, component) => {
  /*
    BuildScene(element)
      @desc: Builds the ScrollStory scene and defines appropriate trigger functions
      @param:
        - element => element that will be designated as a ScrollStory scene
  */
  const BuildScene = element => {
    let link = document.querySelector(`#${element.id}-link`);
    const RemovePopup = element =>{
      while (element.firstChild) element.removeChild(element.firstChild)
      component.map.setFilter('transitRef-all', ['==', 'linename', ''])
      component.map.setFilter('zone-reference', ['==', 'no', ''])
    }
    new ScrollMagic.Scene({
      triggerElement: element,
      duration: element.getBoundingClientRect().height + 100,
      offset: 50
    })
      .on("enter", e => {
        // symbolize correct layer and sections
        ResymbolizeFeatureLayer(component.map, contentRef[element.id]);
        link.classList.add("active");
        element.classList.add("active");
        if (element.id == 'transitChange' || element.id == 'autoChange') {
          let transit = component.map.getLayer('rail-lines')
          transit.visibility == 'none' ? component.map.setLayoutProperty('rail-labels', 'visibility', 'visible') : null
          transit.visibility == 'none' ? component.map.setLayoutProperty('rail-lines', 'visibility', 'visible') : null
        }
      })
      .on("leave", e => {
        // Remove symbolization from correct layer and sections
        HideFeatureLayer(component.map, contentRef[element.id]);
        link.classList.remove("active");
        element.classList.remove("active");
        if (element.id == 'transitChange' || element.id == 'autoChange') {
          let transit = component.map.getLayer('rail-lines')
          transit.visibility == 'visible' ? component.map.setLayoutProperty('rail-labels', 'visibility', 'none') : null
          transit.visibility == 'visible' ? component.map.setLayoutProperty('rail-lines', 'visibility', 'none') : null
        }
        if (document.querySelector('.mapboxgl-popup')) RemovePopup(document.querySelector('.mapboxgl-popup'))
      })
      .addTo(component.scroll);
  };

  // setting up
  let masterContainer = document.querySelector(".frequency__content-story"),
    section = document.createElement("section");
  section.classList.add("frequency__story-section");

  // return appropriate HTML content
  switch (key) {
    case "about":
      section.innerHTML = `
        <div class="frequency__storySection-TitleDivider">
          <hr class="frequency__storySection-divider"><h1 class="frequency__storySection-SectionTitle">${
            contentRef[key].title
          }</h1><hr class="frequency__storySection-divider">
        </div>
      ${content.text}
      `;
      break;
    default:
      section.innerHTML = `
      <div class="frequency__storySection-title">
        <h1 class="frequency__storySection-SectionTitle">${
          contentRef[key].title
        }</h1>
        <div class="frequency__storySection-TitleDivider">
          <hr class="frequency__storySection-divider"><h2 class="frequency__storySection-ScenarioTitle">${
            contentRef[key].scenario
          }</h2><hr class="frequency__storySection-divider">
        </div>
      </div>
      ${content.text}
      <div class="frequency__storySection-legend"></div>
      `;
      break;
  }
  section.id = key;
  // create table if needed
  if (content.table) {
    section
      // .querySelector(".frequency__storySection-content")
      .appendChild(CreateTable(section, content.table));
  }
  section.style.height = masterContainer.getBoundingClientRect().height / 2;
  masterContainer.appendChild(section);
  BuildScene(section);
  BuildLegend(section);
};

/*
  BuildNav(component, sections)
  @desc: does a lot more than the title suggests. This is basically where everything that drives the storySection content creation is invoked
  @param:
    - component => Page component to append everything to
    - sections => sections reference to iterate through and drive element creation
*/
const BuildNav = (component, sections) => {
  // grab container
  const nav = document.querySelector(".frequency__nav-container");
  let cnt = 1;
  for (let i in sections) {
    // don't build a section for the mapData
    if (i != "mapData") {
      let sectionLink = document.createElement("div")
      sectionLink.innerHTML = `<div class="frequency__nav-linkSection">${cnt}<span class="frequency__nav-linkTooltip">${sections[i].title}</span></div>`;
      sectionLink.classList.add("frequency__nav-link");
      sectionLink.id = i + "-link";
      sections[i].active ? sectionLink.classList.add("active") : sectionLink.classList.remove('active');

      // add listeners
      sectionLink.addEventListener("click", e => {
        for (let node of document.querySelectorAll(
          ".frequency__story-section"
        )) {
          // navigate to clicked section
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
      nav.appendChild(sectionLink);
      // build content
      BuildContent(sections[i].content, i, component);
      cnt += 1;
    }
  }
};

const PopupPagination = (event, data, popup) => {
  let allRoutes = [];
  // loop through event features and push unique lines to an array
  event.features.map(feature => {
    data[feature.properties.linename] &&
    allRoutes.indexOf(feature.properties.linename) == -1
      ? allRoutes.push(feature.properties.linename)
      : null;
  });
  if (allRoutes.length > 1) {
    popup.innerHTML =
      '<div class="frequency__popup-navigation"></div><div class="frequency__popup-content"></div>';
    let popupNav = popup.querySelector(".frequency__popup-navigation");
    allRoutes.forEach((route, index) => {
      let navLink = document.createElement("div");
      navLink.classList.add("frequency__popup-navDot");
      index == 0 ? navLink.classList.add("active") : null;
      navLink.id = `route-${route}-popup`;
      navLink.innerText = route;
      popupNav.appendChild(navLink);
    });
  }
};

const PaginationListener = (map, link) => {
  let dots = document.querySelectorAll(".frequency__popup-navDot"),
    content = document.querySelector(".frequency__popup-content");
  link.addEventListener("click", event => {
    let target = event.target,
      route = target.id.split("-")[1];
    for (let i of dots)
      i == target ? i.classList.add("active") : i.classList.remove("active");
    map.setFilter("transitRef-all", ["==", "linename", route]);
    // change popup content
    let active, data;
    for (let section of document.querySelectorAll(
      ".frequency__story-section"
    )) {
      section.classList.contains("active") ? (active = section.id) : null;
    }
    if (active == "overview" || active == "existing")
      data = contentRef.mapData.existing;
    else if (active.indexOf("bus") != -1) data = contentRef.mapData.bus;
    else if (active.indexOf("rail") != -1) data = contentRef.mapData.rail.api;
    if (active == "overview" || active == "existing") {
      content.innerHTML = `<div class='frequency__popup-header'>Route ${route}</div><div class='frequency__popup-meat'><span class="frequency__popup-emphasis">${
        data[route].am
      } Minute</span> <span class="frequency__popup-unit">AM Peak Frequency</span></div><div class='frequency__popup-meat'><span class="frequency__popup-emphasis">${
        Math.ceil(Math.round(data[route].avg_freq,2))
      } Trips/Hour</span> <span class="frequency__popup-unit">Average Weekday Frequency</span></div>`;
    }
    else if (active[0] == 'b' && data[route]){
      content.innerHTML = `
      <div class="frequency__popup-header">Route ${route}</div>
      <div class="frequency__popup-meat"><span class="frequency__popup-emphasis">Actual Change</span> ${FormatNumber(
        Math.floor(data[route].AbsChange)
      )} <span class="frequency__popup-unit">Passengers / Day</span></div>
      <div class="frequency__popup-meat"><span class="frequency__popup-emphasis">Percent Change</span> ${
        data[route].Percent
      }<span class="frequency__popup-unit">%</span></div>
  `;
    }
    else if (active[0] == 'r'){
      let lookup = contentRef.mapData.rail.lookup;
      let name;
      lookup[route]
        ? (name = `${lookup[route].operator} ${lookup[route].name}`)
        : (name = `Trolley Route ${route}`);
      content.innerHTML = `
          <div class='frequency__popup-header'>${name}</div>
          <div class='frequency__popup-meat'><span class="frequency__popup-emphasis">Absolute Change</span> ${FormatNumber(
            Math.floor(data[route].absolute)
          )} <span class="frequency__popup-unit">Passengers / Day</span></div>
          <div class='frequency__popup-meat'><span class="frequency__popup-emphasis">Percent Change</span> ${
            data[route].percent
          }<span class="frequency__popup-unit">%</span></div>
      `;
    }
  });
};
/*
  LoadExisting(map)
    @desc: Load the layers associated with the existing transit scenario. 
    @param:
      - map => map component that the layers will be added to
*/

const LoadExisting = map => {
  /*
    OverviewColor(data, target, line)
      @desc: Function that creates the mapbox data expression for the fill-color property for the layer associated with the overview section
      @param:
        - data => data that will be used for the operators
        - target => data expression that will be appended to
        - line => linename that will be used to match the appropriate features in 
  */
  const OverviewColor = (data, target, line) => {
    let colors = contentRef.overview.content.map.legend[0].scheme; // that's a lot of fucking typing just to get some colors
    if (data >= 4) target.push(line, colors[3][1]);
    else if (data >= 2 && data < 4) target.push(line, colors[2][1]);
    else if (data >= 1 && data < 2) target.push(line, colors[1][1]);
    else target.push(line, colors[0][1]);
  };
  /*
    PopUps(event)
      @desc: return a popup HTML element for the clicked feature
      @param:
        - event => event that triggered the popup creation
  */
  const PopUps = event => {
    let data = contentRef.mapData.existing;
    let popupContainer = document.createElement("div");
    popupContainer.classList.add("frequency__popup-container");
    popupContainer.innerHTML = '<div class="frequency__popup-content"></div>';
    PopupPagination(event, data, popupContainer);
    let feature = event.features[0].properties.linename;
    // does this feature even have data?
    if (data[feature]) {
      let popupContent = popupContainer.querySelector(
        ".frequency__popup-content"
      );
      popupContent.innerHTML = `
            <div class='frequency__popup-header'>Route ${feature}</div>
            <div class='frequency__popup-meat'><span class="frequency__popup-emphasis">${
              data[feature].am
            } Minute</span> <span class="frequency__popup-unit">AM Peak Frequency</span></div>
            <div class='frequency__popup-meat'><span class="frequency__popup-emphasis">${
              Math.ceil(Math.round(data[feature].avg_freq, 2))
            } Trips/Hour</span> <span class="frequency__popup-unit">Average Weekday Frequency</span></div>
            `;
    }
    return popupContainer.outerHTML;
  };
  fetch("https://a.michaelruane.com/api/rtps/frequency?transit")
    .then(
      response =>
        response.ok ? response.json() : console.error("error will robinson")
    )
    .then(existing => {
      contentRef.mapData.existing = existing.cargo;
      let layerDef = [
        {
          id: "transit-overview",
          source: "transit",
          "source-layer": "transit_lines",
          type: "line",
          paint: {
            "line-width": ["interpolate", ["linear"], ["zoom"], 7, 0.05, 12, 3],
            "line-color": ["match", ["get", "linename"]]
          },
          layout: { visibility: "none" }
        }
      ];
      for (let line in existing.cargo) {
        OverviewColor(
          existing.cargo[line].avg_freq,
          layerDef[0].paint["line-color"],
          line
        );
      }

      // default value == transparent
      layerDef[0].paint["line-color"].push("rgba(255,255,255,0)");

      layerDef.map(layer => {
        map.addLayer(layer, "base-muniOutline");
        map.on("click", layer.id, e => {
          if (existing.cargo[e.features[0].properties.linename]){
            map.setFilter('transitRef-all', ['==', 'linename', e.features[0].properties.linename])
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
            let content = PopUps(e);
            let popup = new mapboxgl.Popup({
              offset: offsets,
              className: "frequency__popup"
            })
              .setLngLat(e.lngLat)
              .setHTML(content)
              .addTo(map)
              .on("close", () => {
                map.setFilter("transitRef-all", ["==", "linename", ""]);
              });
            let navDots = document.querySelectorAll(".frequency__popup-navDot");
            for (let dot of navDots) PaginationListener(map, dot);
          }
        });
        map.on(
          "mouseenter",
          layer.id,
          () => (map.getCanvas().style.cursor = "pointer")
        );
        map.on(
          "mouseleave",
          layer.id,
          () => (map.getCanvas().style.cursor = "")
        );
      });
    });
};
/*
  LoadTaz(map)
    @desc: Load the layers associated with the traffic analysis zones. 
    @param:
      - map => map component that the layers will be added to
*/
const LoadTaz = map => {
  /*
    PopUps(layer, event, data)
      @desc: return a popup HTML element for the clicked feature
      @param:
        - layer => layer to create the popup for
        - event => event that triggered the popup creation
        - data => reference object to pull popup content from
  */
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
                <div class='frequency__popup-meat'><span class="frequency__popup-emphasis">Base Scenario</span> ${FormatNumber(
                  Math.floor(feat.tBase)
                )} <span class="frequency__popup-unit">Transit Trips per Day</span></div>
                <div class='frequency__popup-meat'><span class="frequency__popup-emphasis">Doubled Frequency</span> ${FormatNumber(
                  Math.floor(feat.tDouble)
                )} <span class="frequency__popup-unit">Transit Trips per Day</span></div>
                <div class='frequency__popup-meat'><span class="frequency__popup-emphasis">Absolute Change</span> ${FormatNumber(
                  Math.floor(feat.tActual)
                )} <span class="frequency__popup-unit">Transit Trips per Day</span></div>
                <div class='frequency__popup-meat'><span class="frequency__popup-emphasis">Percent Change</span> ${
                  feat.tPercent
                }<span class="frequency__popup-unit">%</span></div>
              </div>
            `;
          break;
        case "vehicles":
          popup = `
              <div class='frequency__popup-container'>
                <div class='frequency__popup-header'>TAZ ${target}</div>
                <div class='frequency__popup-meat'><span class="frequency__popup-emphasis">Base Scenario</span> ${FormatNumber(
                  Math.floor(feat.vBase)
                )} <span class="frequency__popup-unit">Car Trips per Day</span></div>
                <div class='frequency__popup-meat'><span class="frequency__popup-emphasis">Doubled Frequency</span> ${FormatNumber(
                  Math.floor(feat.vDouble)
                )} <span class="frequency__popup-unit">Car Trips per Day</span></div>
                <div class='frequency__popup-meat'><span class="frequency__popup-emphasis">Absolute Change</span> ${FormatNumber(
                  Math.floor(feat.vActual)
                )} <span class="frequency__popup-unit">Car Trips per Day</span></div>
                <div class='frequency__popup-meat'><span class="frequency__popup-emphasis">Percent Change</span> ${
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
      fetch("https://a.michaelruane.com/api/rtps/frequency?zone")
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
            } else {
              zone.properties["tActual"] = 0;
              zone.properties["vActual"] = 0;
            }
          });
          let sourceDef = {
            data: taz,
            type: "geojson"
          };
          map.addSource("taz", sourceDef);

          let transitColors =
              contentRef.transitChange.content.map.legend[0].scheme,
            autoColors = contentRef.autoChange.content.map.legend[0].scheme;
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
                  transitColors[0][1],
                  37,
                  transitColors[1][1],
                  71,
                  transitColors[2][1],
                  123,
                  transitColors[3][1],
                  222,
                  transitColors[4][1]
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
                  autoColors[4][1],
                  -197,
                  autoColors[3][1],
                  -90,
                  autoColors[2][1],
                  -45.1,
                  autoColors[1][1],
                  -23.4,
                  autoColors[0][1],
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
            map.addLayer(layer, "base-interstates");
            map.on("click", layer.id, e => {
              map.setFilter("zone-reference", [
                "==",
                "no",
                e.features[0].properties.TAZN
              ]);
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
                .addTo(map)
                .on("close", () =>
                  map.setFilter("zone-reference", ["==", "no", ""])
                );
            });
            map.on(
              "mouseenter",
              layer.id,
              () => (map.getCanvas().style.cursor = "pointer")
            );
            map.on(
              "mouseleave",
              layer.id,
              () => (map.getCanvas().style.cursor = "")
            );
          });
        });
    });
};
/*
  LoadBus(map)
    @desc: Load the layers associated with the bus ridership. 
    @param:
      - map => map component that the layers will be added to
*/
const LoadBus = map => {
  /*
    PopUps(data, event)
      @desc: return a popup HTML element for the clicked feature
      @param:
        - event => event that triggered the popup creation
        - data => reference object to pull popup content from
  */
  const PopUps = event => {
    let target = event.features[0].properties.linename,
      data = contentRef.mapData.bus,
      popupContainer = document.createElement("div");
    popupContainer.classList.add("frequency__popup-container");
    popupContainer.innerHTML = '<div class="frequency__popup-content"></div>';
    PopupPagination(event, data, popupContainer);
    data.map(route => {
      if ( route.linename == target) {
        popupContainer.querySelector(".frequency__popup-content").innerHTML = `
            <div class="frequency__popup-header">Route ${target}</div>
            <div class="frequency__popup-meat"><span class="frequency__popup-emphasis">Actual Change</span> ${FormatNumber(
              Math.floor(route.AbsChange)
            )} <span class="frequency__popup-unit">Passengers / Day</span></div>
            <div class="frequency__popup-meat"><span class="frequency__popup-emphasis">Percent Change</span> ${
              route.Percent
            }<span class="frequency__popup-unit">%</span></div>
        `;
      }
    });
    return popupContainer.outerHTML;
  };
  const StyleLayer = (layer, index) => {
    let data = contentRef.mapData.bus,
      colors = contentRef.bus.content.map.legend[index].scheme,
      sortField = layer.id.split("bus")[1];
    data.sort((a, b) => b[sortField] - a[sortField]);
    data.map((route, index) => {
      if (sortField == 'AbsChange') {
        let name = route.linename;
        if (index < 25) {
          layer.filter.push(['match', ['get', 'linename'], name, true, false])
          let value = route[sortField];
          if (value < 1400) layer.paint["line-color"].push(name, colors[0][1]);
          else if (value <= 1600 && value > 1400)
            layer.paint["line-color"].push(name, colors[1][1]);
          else if (value <= 1800 && value > 1600)
            layer.paint["line-color"].push(name, colors[2][1]);
          else if (value <= 2200 && value > 1800)
            layer.paint["line-color"].push(name, colors[3][1]);
          else if (value > 2200)
            layer.paint["line-color"].push(name, colors[4][1]);
          }
        }
        else {
          let value = route[sortField];
          if(value >= 72 && value < 234){
            let name = route.linename
            layer.filter.push(['match', ['get', 'linename'], name, true, false])
            if (value <= 85){
              layer.paint["line-color"].push(name, colors[0][1]);
            }
            else if (value <= 100 && value > 85){
              layer.paint["line-color"].push(name, colors[1][1]);}
            else if (value <= 130 && value > 100){
              layer.paint["line-color"].push(name, colors[2][1]);
            }
            else if (value > 130){
              layer.paint["line-color"].push(name, colors[3][1]);
            }
          }
        }
    });
  };
  fetch("https://a.michaelruane.com/api/rtps/frequency?bus")
    .then(
      response =>
        response.ok ? response.json() : console.error("error, will robinson")
    )
    .then(bus => {
      contentRef.mapData.bus = bus.cargo;
      let busLayers = [
        {
          id: "transit-busAbsChange",
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
          layout: { visibility: "none" },
          filter: ['any']
        },
        {
          id: "transit-busPercent",
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
          layout: { visibility: "none" },
          filter: ['any']
        }
      ];
      busLayers.map((layer, index)=>{
        StyleLayer(layer, index);
        layer.paint["line-color"].push("rgba(255,255,255,0)");
        map.addLayer(layer, "base-muniOutline");
        map.on("click", layer.id, e => {
          bus.cargo.map(route=>{
            if (route.linename == e.features[0].properties.linename){
              map.setFilter("transitRef-all", [
                "==",
                "linename",
                e.features[0].properties.linename
              ]);
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
              let content = PopUps(e, layer.id.split('bus')[1]);
              let popup = new mapboxgl.Popup({
                offset: offsets,
                className: "frequency__popup"
              })
                .setLngLat(e.lngLat)
                .setHTML(content)
                .addTo(map)
                .on("close", e =>
                  map.setFilter("transitRef-all", ["==", "linename", ""])
                );
              let navDots = document.querySelectorAll(".frequency__popup-navDot");
              for (let dot of navDots) PaginationListener(map, dot);
            }
          })
        });
        map.on(
          "mouseenter",
          layer.id,
          () => (map.getCanvas().style.cursor = "pointer")
        );
        map.on(
          "mouseleave",
          layer.id,
          () => (map.getCanvas().style.cursor = "")
        );
      })
    });
};
/*
  LoadRail(map)
    @desc: Load the layers associated with the rail ridership. 
    @param:
      - map => map component that the layers will be added to
*/
const LoadRail = map => {
  /*
    LineWidth(data, target, line)
      @desc: Function that creates the mapbox data expression for the line-width property for the layer associated with the rail ridership section
      @param:
        - data => data that will be used for the operators
        - target => data expression that will be appended to
        - name => linename that will be used to match the appropriate features in 
  */
  const LineWidth = (data, target, name) => {
    if (data < 0) target.push(name, 1);
    else if (data >= 0 && data < 30) target.push(name, 2);
    else if (data >= 30 && data < 50) target.push(name, 3.5);
    else if (data >= 50 && data < 80) target.push(name, 5);
    else if (data >= 80 && data < 100) target.push(name, 6);
    else if (data >= 100) target.push(name, 7);
  };
  /*
    LineColor(data, target, line)
      @desc: Function that creates the mapbox data expression for the line-color  property for the layer associated with the rail ridership section
      @param:
        - data => data that will be used for the operators
        - target => data expression that will be appended to
        - name => linename that will be used to match the appropriate features in 
  */
  const LineColor = (data, target, name) => {
    let colors = contentRef.railLineChange.content.map.legend[0].scheme;
    if (data < -100) target.push(name, colors[0][1]);
    else if (data >= -100 && data < 0) target.push(name, colors[1][1]);
    else if (data >= 0 && data < 1000) target.push(name, colors[2][1]);
    else if (data >= 1000 && data < 5000) target.push(name, colors[3][1]);
    else if (data >= 5000) target.push(name, colors[4][1]);
  };
  /*
    PopUps(data, event)
      @desc: return a popup HTML element for the clicked feature
      @param:
        - event => event that triggered the popup creation
        - data => reference object to pull popup content from
  */
  const PopUps = (event) => {
    let target = event.features[0].properties.linename,
      popupContainer = document.createElement('div'),
      data = contentRef.mapData.rail.api;
    popupContainer.classList.add('frequency__popup-container')
    popupContainer.innerHTML = '<div class="frequency__popup-content"></div>'
    PopupPagination(event, data, popupContainer)
    if (data[target]) {
      let feat = data[target];
      let lookup = contentRef.mapData.rail.lookup;
      let name;
      lookup[target]
        ? (name = `${lookup[target].operator} ${lookup[target].name}`)
        : (name = `Trolley Route ${target}`);
      popupContainer.querySelector('.frequency__popup-content').innerHTML = `
        <div class='frequency__popup-container'>
          <div class='frequency__popup-header'>${name}</div>
          <div class='frequency__popup-meat'><span class="frequency__popup-emphasis">Absolute Change</span> ${FormatNumber(
            Math.floor(feat.absolute)
          )} <span class="frequency__popup-unit">Passengers / Day</span></div>
          <div class='frequency__popup-meat'><span class="frequency__popup-emphasis">Percent Change</span> ${
            feat.percent
          }<span class="frequency__popup-unit">%</span></div>
        </div>
      `;
    }
    return popupContainer.outerHTML;
  };
  fetch("https://a.michaelruane.com/api/rtps/frequency?rail")
    .then(
      response =>
        response.ok ? response.json() : console.error("error will robinson")
    )
    .then(rail => {
      contentRef.mapData.rail.api = rail.cargo;
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
      map.addLayer(layerDef, "base-muniOutline");
      map.on("click", layerDef.id, e => {
        if (rail.cargo[e.features[0].properties.linename]){
          map.setFilter("transitRef-all", [
          "==",
          "linename",
          e.features[0].properties.linename
          ]);
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
          let content = PopUps(e);
          let popup = new mapboxgl.Popup({
            offset: offsets,
            className: "frequency__popup"
          })
            .setLngLat(e.lngLat)
            .setHTML(content)
            .addTo(map)
            .on("close", e =>
              map.setFilter("transitRef-all", ["==", "linename", ""])
            );
            let navDots = document.querySelectorAll(".frequency__popup-navDot");
            for (let dot of navDots) PaginationListener(map, dot);
        }
      });
      map.on(
        "mouseenter",
        layerDef.id,
        () => (map.getCanvas().style.cursor = "pointer")
      );
      map.on(
        "mouseleave",
        layerDef.id,
        () => (map.getCanvas().style.cursor = "")
      );
    });
};
/*
  BuildMap(container)
    @desc: Create the map, yo
    @param:
      - container => container to append the map to
    @return: mapbox gl map component
*/
const BuildMap = container => {
  // base extent
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
    minZoom: 7
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
    addRailLayers(map)
    map.flyTo({
      center: extent.center,
      zoom: extent.zoom
    });

    CreateDvrpcNavControl(extent, map)
  });

  return map;
};

export class Frequency {
  constructor() {
    for (let section in contentRef){
      section == 'about' ? contentRef[section].active = true : contentRef[section].active = false
    }
    this.render();
  }
  render() {
    let main = document.querySelector('main')
    main.id = 'frequency'
    if (!document.querySelector('header')) headerRender(HeaderElements)
    document.querySelector("main").innerHTML = `
    <div id="frequency-page">
      <div class="frequency__content-container">
        <nav class="frequency__nav-container"></nav>
        <div class="frequency__content-map"></div>
        <aside class="frequency__content-story"></aside>
      </div>
    </div>
    `;
    this.scroll = new ScrollMagic.Controller({
      container: document.querySelector(".frequency__content-story"),
      loglevel: 4
    });
    BuildNav(this, contentRef);
    this.map = BuildMap(document.querySelector(".frequency__content-map"));
    if (!document.querySelector('footer')) new Footer();
  }
}
