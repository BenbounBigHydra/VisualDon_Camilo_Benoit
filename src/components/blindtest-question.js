import Choices from "choices.js";
import { API_BASE, getComposers, getTitles, sendForm } from "../api";

customElements.define("blindtest-question", class extends HTMLElement {
    static observedAttributes = ['title-id']
    static embedController
    static titles
    static composers

    async connectedCallback() {
        this.loadSpotifyEmbed();
        this.composers = await getComposers();
        this.titles = await getTitles();
        await this.render();
    }

    async attributeChangedCallback() {
        await this.render();
    }

    loadSpotifyEmbed() {
        window.onSpotifyIframeApiReady = (IFrameAPI) => {
            const element = document.querySelector('#embed-iframe');
            const options = {
                height: 0,
            };
            const callback = (EmbedController) => {
                document.querySelector('iframe').allow = '';
                this.embedController = EmbedController;
                document.querySelector('#listener').addEventListener('play_click', () => {
                    EmbedController.play();
            })
            }
            IFrameAPI.createController(element, options, callback);
        };
    }


    async loadTitle() {
        const res = await fetch(`${API_BASE}/titles/${this.getAttribute('title-id')}`, {
            headers : {
                "Accept" : "application/json"
            }
        });
        const title = await res.json();
        this.embedController.loadUri(`spotify:track:${title.spotify_uri}`);
    }

    createForm(value) {
        const form = document.createElement('form');
            form.setAttribute('id', 'blindtest-results');
            form.innerHTML = `
                <input
                    type="text"
                    id="${this.getAttribute('title-id')}"
                    name="title_id"
                    value="${this.getAttribute('title-id')}"
                />
                // <input
                //     type="text"
                //     id="${value}"
                //     name="result"
                //     value="${value}"
                // />
            `
        return form;
    }

    displayBT() {
        // document.querySelector('#buttons')
        const form = document.createElement('form');
        form.setAttribute('id', 'blindtest-try');

        const composerSelect = document.createElement('select');
        const titleSelect = document.createElement('select');

        this.composers.forEach(composer => {
            composerSelect.innerHTML += `
                <option value="${composer.id}">${composer.name}</option>
            `
        });

        this.titles.forEach(title => {
            titleSelect.innerHTML += `
                <option value="${title.id}">${title.name}</option>
            `
        });

        form.append(composerSelect, titleSelect);
        
        const composerChoices = new Choices(composerSelect, {
            removeItemButton: true,
            placeholderValue: 'Choissisez un compositeur',
            itemSelectText: ''
        });
        const titleChoices = new Choices(titleSelect, {
            removeItemButton: true,
            placeholderValue: 'Choissisez une oeuvre',
            itemSelectText: ''
        });
        

        document.querySelector('#buttons').innerHTML = '';
        document.querySelector('#buttons').append(form);

    }

    async render() {
        this.innerHTML=`
            <h2>Connaissez/reconnaissez-vous cette oeuvre?</h2>
            <button id="play">play</button>
            <div id="buttons">
                <button class="skip" id="unknown">Jamais entendu</button>
                <button class="skip" id ="known">Déjà entendu, connais pas</button>
                <button class="blindtest">connais, Blind Test !</button>     
            </div>
        `

        const listener = document.querySelector('#listener');
        document.querySelector('#play').addEventListener('click', () => listener.dispatchEvent(new CustomEvent('play_click')));
        document.querySelector('#unknown').addEventListener('click', async (e) => {
            const form = this.createForm(e.currentTarget.id);
            const data = await sendForm(form, 'blindtest-results');
        })
        document.querySelector('#known').addEventListener('click', async (e) => {
            const form = this.createForm(e.currentTarget.id);
            const data = await sendForm(form, 'blindtest-results');
        })
        document.querySelector('.blindtest').addEventListener('click', () => {this.displayBT()})

        await this.loadTitle();

    }
})