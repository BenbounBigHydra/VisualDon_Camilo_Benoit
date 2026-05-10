import { API_BASE, getData } from "../api";

customElements.define("results-page", class extends HTMLElement {
    static observedAttributes = ['display-mode']
    static dataStats;
    //display mode : cloud-composer, cloud-title, cloud-blindtest, stat-education, stat-genre

    async connectedCallback() {
        await this.firstLoad();
        await this.render();
    }

    async attributeChangedCallback() {
        await this.render();
    }

    async firstLoad() {
        this.setAttribute('class', 'rounded-3 p-5 bg-light border border-primary-subtle border-2 d-flex justify-content-center flex-column align-items-center');

        this.setAttribute('display-mode', 'cloud-composer');
    }

    async render() {
        if (this.getAttribute('display-mode').startsWith('cloud-')) {
            this.dataStats = await getData('composer/all/stats');
        } else if (this.getAttribute('display-mode').startsWith('stat-')) {
            this.dataStats = await getData('blindtest/stats');
        }

        this.innerHTML = '<results-cloud display-mode="composer-known"/>'
    }

})