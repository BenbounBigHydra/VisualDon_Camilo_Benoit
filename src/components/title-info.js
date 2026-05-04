import { getTitle } from "../api";

customElements.define("title-info", class extends HTMLElement {
    static observedAttributes = ['title-id']
    static infoTitle

    async connectedCallback() {
        this.render();
    }

    async attributeChangedCallback() {
        this.render();
    }

    async render() {
        this.infoTitle = await getTitle(this.getAttribute('title-id'));
        this.innerHTML = `
            <div>
                <h2>${this.infoTitle.name}</h2>
                <p>composée par ${this.infoTitle.composer.name}</p>
                <p>composée en ${this.infoTitle.release_year}, période ${this.infoTitle.composer.period}</p>
            </div>
            <p>${this.infoTitle.description}</p>
            <a href="https://open.spotify.com/track/${this.infoTitle.spotify_uri}">écouter sur Spotify</a>
        `
        const button = document.createElement('button');
        button.innerText = "suivant";
        button.addEventListener('click', () => {
            this.parentElement.removeChild(this);
            document.querySelector('blindtest-question').dispatchEvent(new CustomEvent('loadnext'));
        })
        this.append(button);
    }

})