customElements.define("results-page", class extends HTMLElement {
    static observedAttributes = ['display-mode']
    //display mode : cloud-composer, cloud-title, cloud-blindtest, stat-education, stat-genre

    async connectedCallback() {
        await this.render();
    }

    async attributeChangedCallback() {
        await this.render();
    }

})