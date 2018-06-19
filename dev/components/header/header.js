(function(){
    const currentDoc = document.currentScript.ownerDocument;
    class PageHeader extends HTMLElement{

        constructor(){
            super();
            this.inputList = [];
        }
        connectedCallback(){
            const shadow = this.attachShadow({mode: 'open'});
            const temp = currentDoc.querySelector('#header-template');
            const instance = temp.content.cloneNode(true);
            shadow.appendChild(instance);
            this._renderHeader(this);
        }

        _renderHeader(self){
            // logo
            let projectLogo = HeaderElements[0].content.path;
            let logoContainer = self.shadowRoot.querySelector('.header__project-logo');
            logoContainer.setAttribute('src', projectLogo);

            // query inputs
            let queryContainer = self.shadowRoot.querySelector('query-input');
            queryContainer.list = HeaderElements[1].content;
            let queryList = [];
            for (var k in queryContainer.list){
                queryList.push(queryContainer.list[k]);
            }

            // nav controls
            let navContainer = self.shadowRoot.querySelector('control-nav');
            navContainer.list = HeaderElements[2].content;
        }
    }

    customElements.define('page-header', PageHeader);
})();