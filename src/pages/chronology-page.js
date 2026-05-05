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
    }

})