import { getUser } from "../api";

customElements.define("chronology-page", class extends HTMLElement {
    static observedAttributes = ['title-id']
    static userTitles

    async connectedCallback() {
        await this.firstLoad();
        await this.render();
    }

    async attributeChangedCallback() {
        await this.render();
    }

    async firstLoad() {
        this.setAttribute('class', 'rounded-3 p-5 bg-light border border-primary-subtle border-2 d-flex justify-content-center flex-column align-items-center');
        const user = await getUser();
        this.userTitles = user['listened_titles'];
        this.setAttribute('title-id', this.userTitles[0].id);
    }

    async render() {
        // utiliser title-info et timeline-display
        this.setAttribute('class', 'rounded-3 p-5 bg-light border border-primary-subtle border-2 d-flex justify-content-center flex-column align-items-center');
        this.innerHTML = `
            <title-info title-id="${this.getAttribute('title-id')}" labels="full" button="false"></title-info>
            <!-- <timeline-display title-id="${this.getAttribute('title-id')}"></timeline-display> -->
        `
    }

})