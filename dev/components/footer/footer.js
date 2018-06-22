(function(){
    const currentDoc = document.currentScript.ownerDocument;

    class PageFooter extends HTMLElement{
        constructor(){
            super();
        }
        connectedCallback(){
            const shadow = this.attachShadow({mode: 'open'});
            const temp = currentDoc.querySelector('#footer-template');
            const instance = temp.content.cloneNode(true);
            shadow.appendChild(instance);
            this._renderFooter(this);
        }

        _renderFooter(self){
            const shadow = self.shadowRoot;
            // left element
            let logo = FooterElements[0].content.logo;
            let logoContainer = shadow.querySelector('.footer__logo');
            let dvrpcContainer = shadow.querySelector('.footer__dvrpc-info');
            logoContainer.setAttribute('src', logo);
            dvrpcContainer.innerHTML = FooterElements[0].content.address+'</br>'+FooterElements[0].content.city+', '+FooterElements[0].content.state+' '+FooterElements[0].content.zipcode;

            // middle element
            let appContainer = shadow.querySelector('.footer__app-info');
            appContainer.innerHTML = FooterElements[1].content.name+'   |   Version: '+FooterElements[1].content.version;
        }
    }

    customElements.define('page-footer', PageFooter);
})();