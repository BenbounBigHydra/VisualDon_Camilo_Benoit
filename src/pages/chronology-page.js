customElements.define("chronology-page", class extends HTMLElement {
    static observedAttributes = ['title-id']

    async connectedCallback() {
        await this.render();
    }

    async attributeChangedCallback() {
        await this.render();
    }

    render() {
        // utiliser title-info et timeline-display
        this.setAttribute('class', 'rounded-3 p-5 bg-light border border-primary-subtle border-2 d-flex justify-content-center flex-column align-items-center');
    }

})