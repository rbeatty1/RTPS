(function(){
    const currentDoc = document.currentScript.ownerDocument;
    function _createMenuLinks(self, option){
        // iterate through options and create a link for each one
        option.forEach(i=> {
            let optionLink = currentDoc.createElement('option');
            optionLink.innerHTML = i;
            optionLink.setAttribute('value', i);
            optionLink.className = 'input__input-option';
            optionLink.addEventListener('click', e=>{
                let ddName = self.querySelector('.input__query-name');
                ddName.innerHTML = i;
                return i
            })
            self.appendChild(optionLink);
            return self;
        })
        self.addEventListener('change', e=>{
            console.log(self.value);
        })
        return self;
    }

    // create a menu for all query input variables
    function _createMenu(self, item){
        let dropdownMenu = currentDoc.createElement('select');
        dropdownMenu.innerHTML = `<option value="" disabled selected>${item.name}</option>`;
        dropdownMenu.id = `${item.elem_id}`;
        dropdownMenu.className = 'input__query-input';
        _createMenuLinks(dropdownMenu, item.options);
        return dropdownMenu;
    }

    // create HTML element called 'QueryInput' that can be imported 
    class QueryInput extends HTMLElement{
        // run when element is created
        constructor(){
            super();            
        }

        // run when HTML is inserted into DOM
        connectedCallback(){
            const shadow = this.attachShadow({mode: 'open'});
            const temp = currentDoc.querySelector('#query-items-template');
            const instance = temp.content.cloneNode(true);
            shadow.appendChild(instance);
        }

        // function to run whenever list property is retrieved
        get list(){
            return this._list;
        }

        // function to run whenever list property is defined
        set list(list){
            this._list = list;
            this.render();
        }

        // create what is to be inserted into DOM
        render(){
            let listElement = this.shadowRoot.querySelector('.input__container');
            listElement.innerHTML = '';

            // iterate through list created via data located in HeaderElements.js
            for (var k in this.list){
                // grab each individual list of content
                let input = this.list[k];
                // create dropdown menus
                if (input.name != 'Run Query'){
                    let li = _createMenu(this, input);
                    listElement.appendChild(li);
                }
                // create button to execute query
                else{
                    let dropdownMenu = currentDoc.createElement('button');
                    dropdownMenu.innerHTML = `<span class="input__query-name">${input.name}`;
                    dropdownMenu.className = 'input__query-execute';
                    dropdownMenu.addEventListener('click', e=>{alert('Execute Order 66.')});
                    listElement.appendChild(dropdownMenu);                    
                }
            }
        }
    }
    customElements.define('query-input', QueryInput);
})();