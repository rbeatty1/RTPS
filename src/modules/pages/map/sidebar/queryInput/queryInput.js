import "../../../../../css/pages/map/queryInputs/queryInputs.css";
import { HeaderElements } from "../../../../header/HeaderElements";

// holder for query inputs
let geography = {
  type: undefined,
  selection: undefined,
  direction: undefined
};

const _createMenuLinks = (self, option) => {
  // iterate through options and create a link for each one -- <option value='{i}' class='input__input-option>i</option>
  if (self.id == "muni") {
    option.forEach(muni => {
      let optionLink = document.createElement("option");
      optionLink.innerText = muni[0];
      optionLink.setAttribute("value", muni[1]);
      optionLink.className = "input__input-option";
      self.appendChild(optionLink);
    });
  } else {
    option.forEach(i => {
      let optionLink = document.createElement("option");
      optionLink.innerHTML = i;
      optionLink.setAttribute("value", i);
      optionLink.className = "input__input-option";
      self.appendChild(optionLink);
    });
  }
  return self;
};

// create a menu for all query input variables
const _createMenu = self => {
  let dropdownMenu = document.createElement("select");
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
  set list(list) {
    this._list = list;
    this.render();
  }
  render() {
    let container = document.querySelector("#analysis_dropdownContent");
    if (container) {
      let listElement = document.createElement("section");
      listElement.className = "sidebar__input-container";
      listElement.innerHTML =
        '<form class="sidebar__input-dropdowns"></form><div class="sidebar__input-buttons"></div>';
      container.appendChild(listElement);
      container.classList.add("active");
      for (var k in this.list) {
        let input = this.list[k];
        if (input.id < 5) {
          let li = _createMenu(input, this, this.list);
          document.querySelector(".sidebar__input-dropdowns").appendChild(li);
        } else {
          let dropdownMenu = document.createElement("button");
          dropdownMenu.innerHTML = `<span class="input__query-name">${
            input.name
          }`;
          dropdownMenu.classList.add("input__query-button");
          switch (input.id) {
            case 5:
              dropdownMenu.id = "execute";
              break;
            case 6:
              dropdownMenu.id = "clear";
              break;
          }
          document
            .querySelector(".sidebar__input-buttons")
            .appendChild(dropdownMenu);
        }
      }
      let targetNode = document.querySelector(".sidebar__input-dropdowns");
      for (let key in geography) {
        targetNode.setAttribute(`data-${key}`, geography[key]);
      }
      let config = { attributes: true, childList: false, subtree: false };
      let observer = new MutationObserver((target, config) => {
        for (let node of target) {
          if (
            node.type == "attributes" &&
            node.attributeName == "data-type" &&
            node.target.getAttribute("data-direction") != undefined
          ) {
            geography.type = node.target.getAttribute("data-type");
            let direction = document.querySelector('#direction'),
              muni = document.querySelector('#muni')
              if (geography.type) HeaderElements[1].content.inputTwo.options.map((value, index)=> direction[index+1].innerText = `${value} ${geography.type}` )
              if (geography.type == "zone") {
              geography.selection = new Array();
              direction.style.display =
                "inline-block";
              muni.style.display == "inline-block"
                ? (muni.style.display = "")
                : null;
            } else if (geography.type == "municipality") {
              muni.style.display = "inline-block";
              direction.style.display ==
              "inline-block"
                ? (direction.style.display = "")
                : null;
              geography.selection = undefined;
            } else {
              muni.style.display = "";
              direction.style.display = "";
            }
          } else if (
            node.type == "attributes" &&
            node.attributeName == "data-selection" &&
            node.target.getAttribute("data-direction") != undefined
          ) {
            geography.selection = node.target.getAttribute("data-selection");
            if (geography.type == "municipality") {
              let direction = document.querySelector('#direction')
              direction.style.display =
                "inline-block";
              }
          } else if (
            node.type == "attributes" &&
            node.attributeName == "data-direction" &&
            node.target.getAttribute("data-direction") != undefined
          ) {
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
            } else {
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
