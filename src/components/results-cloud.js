customElements.define("results-cloud", class extends HTMLElement {
    static observedAttributes = ['display-mode', 'filter']
    // display-mode : composer-known, composer-title-known, blindtest-known
    // filter : childhood-blues, blues, childhood-country, country, ...

    async connectedCallback() {
        await this.render();
    }

    async attributeChangedCallback() {
        await this.render();
    }

})