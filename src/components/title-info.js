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

    getName(el) {
        switch (el) {
                case "blues": return "Blues";
                case "country": return "Country";
                case "classical": return "Classique";
                case "drum&bass": return "Drum & Bass";
                case "edm": return "EDM";
                case "hip-hop": return "Hip-Hop";
                case "jazz": return "Jazz";
                case "metal": return "Métal";
                case "pop": return "Pop";
                case "rap": return "Rap";
                case "reggae": return "Reggae";
                case "r&b": return "R&B";
                case "rock": return "Rock";
                case "techno": return "Techno";
                case "world": return "Musiques du monde";
                case "self-taught": return "Autodidacte";
                case "conservatory": return "Conservatoire ou école de musique";
                case "hem": return "Haute Ecole de Musique";
            }
    }

    async render() {
        this.infoTitle = await getTitle(this.getAttribute('title-id'));
        this.innerHTML = `
            <div>
                <h2>${this.infoTitle.name}</h2>
                <p>composée par ${this.infoTitle.composer.name}</p>
                <p>composée en ${this.infoTitle.release_year}, période ${this.getName(this.infoTitle.composer.period)}</p>
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