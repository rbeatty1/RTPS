import "../../../css/header/queryInputs/queryInputs.css"
import {Map} from "../../map/map"

let queryInputs = {
    geography: undefined,
    zones: [],
    demand: undefined,
    supply: undefined
}

function _GeographyChecker(geoInput){
    if (geoInput.value == 'Zone'){
        geoInput.nextSibling.style.display = 'none';
        alert('Select query zones by clicking on the map!');
    }
    else{
        let muniList = geoInput.nextSibling.style.display = 'inline-block';
    }
}

function _createMenuLinks(self, option){
    // iterate through options and create a link for each one
    option.forEach(i=> {
        let optionLink = document.createElement('option');
        optionLink.innerHTML = i;
        optionLink.setAttribute('value', i);
        optionLink.className = 'input__input-option';
        self.appendChild(optionLink);
        return self;
    })
    self.addEventListener('change', e=>{
        delete queryInputs[self.id];
        queryInputs[self.id] = self.value;
        return queryInputs;
    })
    return self;
}

// create a menu for all query input variables
function _createMenu(self, item, query){
    let dropdownMenu = document.createElement('select');
    dropdownMenu.innerHTML = `<option value="" disabled selected>${self.name}</option>`;
    dropdownMenu.id = `${self.elem_id}`;
    dropdownMenu.className = 'input__query-input';
    _createMenuLinks(dropdownMenu, self.options);
    if (dropdownMenu.id == 'geography'){
        dropdownMenu.addEventListener('change', _=>{
            _GeographyChecker(dropdownMenu);
        })

    }
    return dropdownMenu;
}

class QueryContainer{
    constructor(){
    }
    get list(){
        return this._list;
    }
    set list(list){
        this._list = list;
        this.render();
    }
    render(){
        let header = document.querySelector('.header__container')
        let listElement = document.createElement('div');
        listElement.className = 'header__input-container';
        listElement.innerHTML = '';
        for (var k in this.list){
            let input = this.list[k];
            if (input.id < 5){
                let li = _createMenu(input, this, this.list)
                listElement.appendChild(li);
            }
            else{
                let dropdownMenu = document.createElement('button');
                dropdownMenu.innerHTML = `<span class="input__query-name">${input.name}`;
                dropdownMenu.className = 'input__query-execute';
                switch (input.id){
                    case 5: 
                        dropdownMenu.className = 'input__query-execute';
                        dropdownMenu.addEventListener('click', e=>{
                            if (!queryInputs.geography || !queryInputs.demand || !queryInputs.supply){
                                alert('You haven\'t finished building your query! Please select options from each dropdown to continue.')
                            }
                            else{
                                let query = `SELECT * FROM RTPS\nWHERE (\n   zone = '${queryInputs.geography}' AND \n   demand = '${queryInputs.demand}' AND \n   supply = '${queryInputs.supply}'\n);`;
                                alert(`Query: \n${query}\n\n\nExecute Order 66.`);
                            }
                        });
                        break;
                    case 6:
                        dropdownMenu.className = 'input__query-clear';
                        dropdownMenu.addEventListener('click', _=>{
                            listElement.remove();
                            this.render();
                            document.querySelector('.map__container').remove();
                            new Map();
                        })
                        break;
                }
                listElement.appendChild(dropdownMenu);
            }
        }
        header.appendChild(listElement);
    }
}

export {queryInputs, QueryContainer};