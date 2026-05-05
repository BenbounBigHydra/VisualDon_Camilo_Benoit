customElements.define("timeline-display", class extends HTMLElement {
    static observedAttributes = ['title-id']

    async connectedCallback() {
        await this.render();
    }

    async attributeChangedCallback() {
        await this.render();
    }

})