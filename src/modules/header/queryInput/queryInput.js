import "../../../css/header/queryInputs/queryInputs.css"


// holder for query inputs
let geography = {
    type: undefined,
    selection: undefined,
    direction: undefined
}

const _createMenuLinks = (self, option) =>{
    // iterate through options and create a link for each one -- <option value='{i}' class='input__input-option>i</option>
    option.forEach(i=> {
        let optionLink = document.createElement('option');
        optionLink.innerHTML = i;
        optionLink.setAttribute('value', i);
        optionLink.className = 'input__input-option';
        self.appendChild(optionLink);
        return self;
    })
    return self;
}

// create a menu for all query input variables
const _createMenu = (self) =>{
    let dropdownMenu = document.createElement('select');
    dropdownMenu.innerHTML = `<option value="" disabled selected>${self.name}</option>`;
    dropdownMenu.id = `${self.elem_id}`;
    dropdownMenu.className = 'input__query-input';
    _createMenuLinks(dropdownMenu, self.options);
    dropdownMenu.addEventListener('change', e=>{
        if (dropdownMenu.id == 'geography' || dropdownMenu.id == 'muni'){
            if (e.target.id != 'muni'){ geography.type = e.target.value.toLowerCase() } 
            if (geography.type){
                if (e.target.value == 'MCD'){
                    document.querySelector('#muni').style.display != 'inline-block' ? document.querySelector('#muni').style.display = 'inline-block' : null
                    geography.selection = undefined
                }
                else if(e.target.value=='Zone'){
                    document.querySelector("#muni").style.display == 'inline-block' ? document.querySelector("#muni").style.display = 'none': null
                    geography.selection = new Array()
                }
                else{
                    geography.selection = e.target.value
                }
            }
        }
        else{
            geography.direction = e.target.value
        }
    })
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
                        break;
                    case 6:
                        dropdownMenu.className = 'input__query-clear';
                        break;
                }
                listElement.appendChild(dropdownMenu);
            }
        }
        header.appendChild(listElement);
    }
}

export {geography, QueryContainer};