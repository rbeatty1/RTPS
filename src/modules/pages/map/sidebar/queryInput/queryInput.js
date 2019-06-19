import "../../../../../css/pages/map/queryInputs/queryInputs.css";
import { HeaderElements } from "../../../../header/HeaderElements";

// holder for query inputs
let geography = {
  type: undefined,
  selection: undefined,
  direction: undefined
};


/*
  _createMenuLinks(self, options)
  @purpose: Create options for query dropdowns
  @params:
    self: HTML dropdown element
    options: dropdown options
  @return:
    returns filled dropdown element
*/
const _createMenuLinks = (self, options) => {
  // iterate through options and create a link for each one -- <option value='{i}' class='input__input-option>i</option>
  
  /*************************************************************************************************************************************************************/
  // @TODO: Issue #41: when we meet tomorrow, have PuTTY set up and psql on the gap list table and then ask Sarah to write the SQL statement to update the jawns
    // SSH into the DO droplet
    // cd to the rtps folder
    // sudo -u postgres psql
    // \l to view the tables, \dt rtps
    // get table 'zonemcd_join_region_wpnr_trim'
    // https://www.dvrpc.org/Mapping/Maps/pdf/Philadelphia_Planning_Districts.pdf
  /*************************************************************************************************************************************************************/

  if (self.id == "muni") {
    options.forEach(muni => {
      let optionLink = document.createElement("option");
      optionLink.innerText = muni[0];
      optionLink.setAttribute("value", muni[1]);
      optionLink.className = "input__input-option";
      self.appendChild(optionLink);
    });
  } else {
    options.forEach(i => {
      let optionLink = document.createElement("option");
      optionLink.innerHTML = i;
      optionLink.setAttribute("value", i);
      optionLink.className = "input__input-option";
      self.appendChild(optionLink);
    });
  }
  return self;
};

/*
  _createMenu(self)
  @purpose: Dropdown menus for query inputs
  @params:
    self: HTML dropdown element
  @return:
    returns filled dropdown element
*/
const _createMenu = self => {
  let dropdownMenu = document.createElement("select")

  dropdownMenu.innerHTML = `<option value="" disabled selected>${
    self.name
  }</option>`;
  dropdownMenu.id = `${self.elem_id}`;
  dropdownMenu.className = "input__query-input";
  
  _createMenuLinks(dropdownMenu, self.options);
  
  
  dropdownMenu.addEventListener("change", e => {
    if (dropdownMenu.id == "geography") {
      document
        .querySelector(".sidebar__input-dropdowns")
        .setAttribute("data-type", e.target.value.toLowerCase());
    } else if (dropdownMenu.id == "muni") {
      document
        .querySelector(".sidebar__input-dropdowns")
        .setAttribute("data-selection", e.target.value);
    } else {
      document
        .querySelector(".sidebar__input-dropdowns")
        .setAttribute("data-direction", e.target.value);
    }
  });
  return dropdownMenu;
};
class QueryContainer {
  constructor() {}
  get list() {
    return this._list;
  }

  // list is set in ../sidebar.js BuildMenus function <for (var k in queryContainer.list) queryList.push(queryContainer.list[k]);>
  set list(list) {
    this._list = list;
    this.render();
  }
  render() {
    let container = document.querySelector("#analysis_dropdownContent")

    if (container) {
      let listElement = document.createElement("section")

      listElement.className = "sidebar__input-container";
      listElement.innerHTML =
        '<form class="sidebar__input-dropdowns"></form>';
      
      container.appendChild(listElement);
      
      for (var k in this.list) {
        let input = this.list[k];
        
        // id < 5 means that it is a dropdown input, not either the run/execute button 
        if (input.id < 5) {
          let li = _createMenu(input, this, this.list);
          document.querySelector("form").appendChild(li);
        }
        // create buttons
        else {
          let dropdownMenu = document.createElement("input")
          dropdownMenu.value = input.name
          dropdownMenu.classList.add("input__query-button");
          switch (input.id) {
            case 5:
              dropdownMenu.id = "execute";
              dropdownMenu.type = 'submit'
              break;
            case 6:
              dropdownMenu.id = "clear";
              dropdownMenu.type = 'reset'
              break;
          }
          document
            .querySelector("form")
            .appendChild(dropdownMenu);
        }
      }
      
      let targetNode = document.querySelector(".sidebar__input-dropdowns");
      for (let key in geography) {
        targetNode.setAttribute(`data-${key}`, geography[key]);
      }

      // set up mutation observer to assist user in walking through the query building process
      let config = { attributes: true, childList: false, subtree: false };
      let observer = new MutationObserver((target, config) => {

        // define listeners
        for (let node of target) {
        // what changed?
          // type of query (muni|zone)
          if (node.type == "attributes" && node.attributeName == "data-type" && node.target.getAttribute("data-direction") != undefined) {

            geography.type = node.target.getAttribute("data-type");
            let direction = document.querySelector('#direction'),
              muni = document.querySelector('#muni')

            // populate direction inner text with to/from muni/zone text depending on node.type 
            if (geography.type) HeaderElements[1].content.inputTwo.options.map((value, index)=> direction[index+1].innerText = `${value} ${geography.type}` )

            // if geography.type is zone, make sure the muni dropdown is not visible and the direction dropdown is
            if (geography.type == "zone") {
              // make sure selection is a fresh array
              geography.selection = new Array();
              direction.style.display = "inline-block";
              muni.style.display == "inline-block" ? (muni.style.display = "") : null;
            }

            // if geography.type = muni, make sure muni dropdown is displayed
            else if (geography.type == "municipality") {
              muni.style.display = "inline-block";
              direction.style.display == "inline-block" ? (direction.style.display = "") : null;
              // clear any previous selections
              geography.selection = undefined;
            }

            // if nothing is selected, don't display direction or muni dropdowns
            else {
              muni.style.display = "";
              direction.style.display = "";
            }
          }

          // location (really only the muni dropdown?)
          else if ( node.type == "attributes" && node.attributeName == "data-selection" && node.target.getAttribute("data-direction") != undefined ){
            // set the selection parameter do the node's data-selection attribute
            geography.selection = node.target.getAttribute("data-selection");

            // make sure direction dropdown displays after making a muni selection
            if (geography.type == "municipality") {
              let direction = document.querySelector('#direction')
              direction.style.display =
                "inline-block";
              }
          } 


          // direction (to | from)
          else if ( node.type == "attributes" && node.attributeName == "data-direction" && node.target.getAttribute("data-direction") != undefined) {
            geography.direction = node.target.getAttribute("data-direction");
          }
          
          let sum = 0;
          for (let key in geography) {
            geography[key] ? (sum += 1) : null;
          }
          if (sum == 3) {
            if (geography.type == "zone") {
              if (geography.selection.length > 0) {
                let buttons = document.querySelectorAll(".input__query-button");
                for (let btn of buttons) {
                  btn.classList.contains("active")
                    ? null
                    : btn.classList.add("active");
                }
              }
            } else if (geography.type == 'municipality' && geography.direction) {
              let buttons = document.querySelectorAll(".input__query-button");
              for (let btn of buttons) {
                btn.classList.contains("active")
                  ? null
                  : btn.classList.add("active");
              }
            }
          }
        }
      });
      observer.observe(targetNode, config);
    }
  }
}

export { geography, QueryContainer };
