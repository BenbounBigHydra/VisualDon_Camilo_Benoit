import { getUser } from "../api";

customElements.define("chronology-page", class extends HTMLElement {
    static observedAttributes = ['title-id']
    static userTitles
    static currentTitleId

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
        this.userTitles = user['listened_titles'].sort((a, b) => a['release_year'] - b['release_year']);

        this.setAttribute('title-id', sessionStorage.getItem('chronologyTitleId') ?? this.userTitles[0].id);
    }

    async render() {
        // utiliser title-info et timeline-display
        this.setAttribute('class', 'rounded-3 p-5 bg-light border border-primary-subtle border-2 d-flex justify-content-center flex-column align-items-center');
        this.innerHTML = `
            <title-info title-id="${this.getAttribute('title-id')}" labels="full" button="false"></title-info>
            <!-- <timeline-display title-id="${this.getAttribute('title-id')}"></timeline-display> -->
        `
        this.currentTitleId = this.getAttribute('title-id');
        sessionStorage.setItem('chronologyTitleId', this.currentTitleId);

        const pos = this.userTitles.findIndex(e => e.id == this.currentTitleId);

        const buttons = document.createElement('div');
        buttons.setAttribute('class', 'd-flex justify-content-between w-100');

        const prev = document.createElement('button');
        prev.setAttribute('class', 'btn btn-custom border-2');
        prev.innerText = "Précédent";

        if (pos === 0) {
            prev.classList.add('disabled');
        } else {
            prev.addEventListener('click', () => {
                this.setAttribute('title-id', this.userTitles[pos - 1].id);
            })
        }

        const next = document.createElement('button');
        next.setAttribute('class', 'btn btn-custom border-2');
        next.innerText = "Suivant";

        if (pos === this.userTitles.length-1) {
            next.classList.add('disabled');
        } else {
            next.addEventListener('click', () => {
                this.setAttribute('title-id', this.userTitles[pos + 1].id);
            })
        }

        buttons.append(prev, next);
        this.append(buttons);
    }

})