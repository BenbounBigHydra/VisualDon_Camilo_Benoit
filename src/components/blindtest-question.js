import Choices from "choices.js";
import { API_BASE, getComposers, getTitles, getUser, sendForm } from "../api";

customElements.define("blindtest-question", class extends HTMLElement {
    static observedAttributes = ['title-id']
    static embedController
    static titles
    static composers
    static user
    static currentTitle

    async connectedCallback() {
        await this.firstLoad();
        await this.render();
    }

    async attributeChangedCallback() {
        await this.render();
    }

    async firstLoad() {
        this.loadSpotifyEmbed();
        this.composers = await getComposers();
        this.titles = await getTitles();
        this.user = await getUser();
        this.currentTitle = await this.getRandomTitle();
        this.setAttribute('title-id', this.currentTitle.id);
    }

    async displayInfo() {
        this.currentTitle = await this.getRandomTitle();
        this.setAttribute('title-id', this.currentTitle.id);
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

    async checkContains(array, id) {
        let arrayContainsId = false;
        array.forEach(e => {
            if (e.id == id) {
                arrayContainsId = true;
            }
        });
        return arrayContainsId;
    }
    
    async getRandomTitle() {
        const userTitles = this.user.listened_titles;
        const titles = this.titles;
        let title;
        do {
            const id = Math.floor(Math.random() * titles.length);
            title = titles[id];
            console.log(userTitles.includes(title));
        } while (this.checkContains(userTitles, title.id));
        return title;
    }

    async loadTitle() {
        const res = await fetch(`${API_BASE}/titles/${this.getAttribute('title-id')}`, {
            headers : {
                "Accept" : "application/json"
            }
        });
        const title = await res.json();
        // this.currentTitle = title;
        console.log(this.currentTitle)
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

    checkAnswer(composer, title) {
        if (composer.value == this.currentTitle.composer_id) {
            if (title.value == this.currentTitle.id) {
                return 'bt-both';
            } else {
                return 'bt-composer';
            }
        } else {
            if (title.value == this.currentTitle.id) {
                return 'bt-title';
            } else {
                return 'bt-false';
            }
        }
        // console.log(composer.value, this.currentTitle.composer_id);
        // console.log(title.value, this.currentTitle.id);
    }

    displayBT() {
        // document.querySelector('#buttons')
        const answerForm = document.createElement('form');
        answerForm.setAttribute('id', 'blindtest-try');

        const composerSelect = document.createElement('select');
        composerSelect.setAttribute('id', 'composer-select');
        this.composers.forEach(composer => {
            composerSelect.innerHTML += `
                <option value="${composer.id}">${composer.name}</option>
            `
        });

        const titleSelect = document.createElement('select');
        titleSelect.setAttribute('id', 'title-select');
        this.titles.forEach(title => {
            titleSelect.innerHTML += `
                <option value="${title.id}">${title.name}</option>
            `
        });

        answerForm.append(composerSelect, titleSelect);
        
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
        
        const inputsDiv = document.querySelector('#inputs');
        inputsDiv.innerHTML = '';
        inputsDiv.append(answerForm);

        const validate = document.createElement('button');
        validate.setAttribute('id', 'validate');
        validate.innerText = 'Valider';
        validate.addEventListener('click', async () => {
            const form = this.createForm(this.checkAnswer(composerSelect, titleSelect));
            // console.log(form);
            const data = await sendForm(form, 'blindtest-results');
            await this.displayInfo();
        });

        inputsDiv.append(validate);

    }

    async render() {
        this.innerHTML=`
            <h2>Connaissez/reconnaissez-vous cette oeuvre?</h2>
            <button id="play">play</button>
            <div id="inputs">
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
            await this.displayInfo();
        })
        document.querySelector('#known').addEventListener('click', async (e) => {
            const form = this.createForm(e.currentTarget.id);
            const data = await sendForm(form, 'blindtest-results');
            await this.displayInfo();
        })
        document.querySelector('.blindtest').addEventListener('click', () => {this.displayBT()})

        await this.loadTitle();

    }
})