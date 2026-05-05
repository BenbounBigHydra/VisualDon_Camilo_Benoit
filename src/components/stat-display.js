customElements.define("stat-display", class extends HTMLElement {
    static observedAttributes = ['filter']
    // filter : self (stats perso), all, self-taught, conservatory, hem, (vue générale), "title-id" (stats oeuvre)

    async connectedCallback() {
        await this.render();
    }

    async attributeChangedCallback() {
        await this.render();
    }

})