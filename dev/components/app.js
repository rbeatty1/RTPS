(function(){
    const currentDoc = document.currentScript.ownerDocument;

    class AppBody extends HTMLElement{
        constructor(){
            super();
        }

        connectedCallback(){
            const shadow = this.attachShadow({mode: 'open'});
            const temp = currentDoc.querySelector('#app-template');
            const instance = temp.content.cloneNode(true);
            shadow.appendChild(instance);
        }
    }

    customElements.define('app-body', AppBody);
})();