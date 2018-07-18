import '../../../css/header/navControls/navControls.css'


function _createNavLink(self, item){
    let navElement = document.createElement('a');
    navElement.innerHTML = item;
    navElement.setAttribute('href', '#');
    // On load, land on gap analysis page
    item != 'Gap Analysis' ? navElement.className = 'nav__link-inactive' : navElement.className = 'nav__link-active';
    // change link styling when navigating to
    navElement.addEventListener('click', e=>{
        let siblings = e.target.parentNode.childNodes;
        siblings.forEach(element => {
            element != e.target ? element.className = 'nav__link-inactive' : element.className = 'nav__link-active';
        });
    })
    return navElement;
}

class NavControl{
    get list(){
        return this._list;
    }

    set list(list){
        this._list = list;
        this.render()
    }

    render(){
        let header = document.querySelector(".header__container");
        let listElement = document.createElement('div')
        listElement.className = 'header__nav-links'
        listElement.innerHTML = '';
        for (let k in this.list){
            let a = _createNavLink(listElement, this.list[k].name);
            listElement.appendChild(a);
        }
        header.appendChild(listElement)
    }
}



// (function(){
//     const currentDoc = document.currentScript.ownerDocument;

    // function _createNavLink(self, item){
    //     let navElement = currentDoc.createElement('a');
    //     navElement.innerHTML = item;
    //     navElement.setAttribute('href', '#');
    //     // On load, land on gap analysis page
    //     item != 'Gap Analysis' ? navElement.className = 'nav__link-inactive' : navElement.className = 'nav__link-active';
    //     // change link styling when navigating to
    //     navElement.addEventListener('click', e=>{
    //         let siblings = e.target.parentNode.childNodes;
    //         siblings.forEach(element => {
    //             element != e.target ? element.className = 'nav__link-inactive' : element.className = 'nav__link-active';
    //         });
    //     })
    //     return navElement;
    // }

//     class NavControls extends HTMLElement{
//         constructor(){
//             super();
//         }

//         connectedCallback(){
//             const shadow = this.attachShadow({mode: 'open'});
//             const temp = currentDoc.querySelector('#nav-control-template');
//             const instance = temp.content.cloneNode(true);
//             shadow.appendChild(instance);
//         }

//         get list(){
//             return this._list;
//         }

//         set list(list){
//             this._list = list;
//             this.render();
//         }

//         render(){
//             let listElement = this.shadowRoot.querySelector('.nav__link-container');
//             listElement.innerHTML = '';
//             for (let k in this.list){
//                 let a = _createNavLink(listElement, this.list[k].name);
//                 listElement.appendChild(a);
//             }
//         }
//     }
//     customElements.define('control-nav', NavControls);    
// })();

export {NavControl};