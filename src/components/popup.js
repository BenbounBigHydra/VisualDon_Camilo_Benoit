customElements.define("pop-up", class extends HTMLElement {
    static observedAttributes = ['type']

    async connectedCallback() {
        await this.render();
    }

    async attributeChangedCallback() {
        await this.render();
    }

    async render() {
        this.setAttribute('class', 'd-flex flex-column rounded-2 py-2 px-3 bg-warning-subtle border border-warning-subtle border-2 position-absolute popup');
        const type = this.getAttribute('type');
        this.setAttribute('id', type);
        
        switch(type) {
            case 'nav-info': this.innerHTML = '<p>Tu peux dès maintenant accéder aux résultats globaux grâce à ces onglets !</p>'; break;
        }

        this.innerHTML += `
            <p class="fst-italic mb-0 notice">Clique n'importe où pour fermer cette fenêtre.</p>
            <div id="popup-marker" class="bg-warning-subtle border-start border-top border-warning-subtle border-2 position-absolute start-50 translate-middle-x"></div>
        `;

        document.onclick = () => {
            document.onclick = null;
            this.parentElement.removeChild(this);
        };
    }
})