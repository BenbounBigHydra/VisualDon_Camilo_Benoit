import { API_BASE } from "../api";

customElements.define("blindtest-question", class extends HTMLElement {
    static observedAttributes = ['title-id']
    static embedController

    async connectedCallback() {
        this.firstRender();
        await this.render();
    }

    async attributeChangedCallback() {
        await this.render();
    }

    firstRender() {
        this.innerHTML = `
            <h2>Connaissez/reconnaissez-vous cette oeuvre?</h2>
            <div id="embed-iframe"></div>
            <button id="play">play</button>
        `
        window.onSpotifyIframeApiReady = (IFrameAPI) => {
            const element = document.querySelector('#embed-iframe');
            const options = {
                height: 200,
            };
            const callback = (EmbedController) => {
                document.querySelector('iframe').allow = 'autoplay; clipboard-write; fullscreen; picture-in-picture';
                this.embedController = EmbedController;
                document.querySelector('#play').addEventListener('click', EmbedController.play)
            }
            IFrameAPI.createController(element, options, callback);
        };

    }

    async render() {
        const res = await fetch(`${API_BASE}/titles/${this.getAttribute('title-id')}`, {
            headers : {
                "Accept" : "application/json"
            }
        });
        const title = await res.json();
        console.log(title, this.embedController);
        this.embedController.loadUri(`spotify:track:${title.spotify_uri}`);
    }
})