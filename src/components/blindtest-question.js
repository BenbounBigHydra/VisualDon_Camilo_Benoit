import Choices from "choices.js";
import { API_BASE, getComposers, getTitles, getUser, sendForm, titles, composers, checkResultAccess } from "../api";

customElements.define("blindtest-question", class extends HTMLElement {
    static observedAttributes = ['title-id']
    static embedController
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
        this.currentTitle = await this.getRandomTitle();
        this.setAttribute('title-id', this.currentTitle.id);
        this.addEventListener('loadnext', async () => {
            this.currentTitle = await this.getRandomTitle();
            this.setAttribute('title-id', this.currentTitle.id);
        });

        const loadNavBar = await checkResultAccess();
        if (loadNavBar) {
            this.parentElement.insertAdjacentHTML('beforebegin', '<nav-bar selected="blindtest"></nav>');
        }

    }

    async displayInfo() {
        this.innerHTML = "";
        const info = document.createElement('title-info');
        info.setAttribute('title-id', this.currentTitle.id);
        this.parentElement.append(info);
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

    checkContains(array, id) {
        let arrayContainsId = false;
        array.forEach(e => {
            if (e.id == id) {
                arrayContainsId = true;
            }
        });
        return arrayContainsId;
    }
    
    async getRandomTitle() {
        const user = await getUser();
        const userTitles = user.listened_titles;
        // console.log(userTitles);
        let title;
        do {
            const id = Math.floor(Math.random() * titles.length);
            title = titles[id];
            // console.log(title.name, title.id, this.checkContains(userTitles, title.id))
        } while (this.checkContains(userTitles, title.id));
        return title;
    }

    async loadTitle() {
        // const res = await fetch(`${API_BASE}/titles/${this.getAttribute('title-id')}`, {
        //     headers : {
        //         "Accept" : "application/json"
        //     }
        // });
        // const title = await res.json();
        // this.currentTitle = title;
        // console.log(this.currentTitle)
        this.embedController.loadUri(`spotify:track:${this.currentTitle.spotify_uri}`);
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
        // console.log(composer.value, this.currentTitle.composer_id);
        // console.log(title.value, this.currentTitle.id);
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
    }

    displayBT() {
        // document.querySelector('#buttons')
        const answerForm = document.createElement('form');
        answerForm.setAttribute('id', 'blindtest-try');
        answerForm.setAttribute('class', 'w-100 d-flex gap-3')

        const composerSelect = document.createElement('select');
        composerSelect.setAttribute('id', 'composer-select');
        composerSelect.innerHTML = '<option value="0" hidden/>';
        composers.forEach(composer => {
            composerSelect.innerHTML += `
                <option value="${composer.id}">${composer.name}</option>
            `
        });

        const titleSelect = document.createElement('select');
        titleSelect.setAttribute('id', 'title-select');
        titleSelect.innerHTML = '<option value="0" hidden/>';
        titles.forEach(title => {
            titleSelect.innerHTML += `
                <option value="${title.id}">${title.name}</option>
            `
        });

        answerForm.append(composerSelect, titleSelect);
        
        const composerChoices = new Choices(composerSelect, {
            removeItemButton: true,
            placeholderValue: 'Choissisez un compositeur',
            itemSelectText: '',
            searchResultLimit: -1
        });
        const titleChoices = new Choices(titleSelect, {
            removeItemButton: true,
            placeholderValue: 'Choissisez une oeuvre',
            itemSelectText: '',
            searchResultLimit: -1
        });

        answerForm.childNodes.forEach((node) => {
            node.classList.add('w-100');
        })
        
        const inputsDiv = document.querySelector('#inputs');
        inputsDiv.innerHTML = '';
        inputsDiv.append(answerForm);

        const validate = document.createElement('button');
        validate.setAttribute('id', 'validate');
        validate.setAttribute('class', 'btn btn-custom border-2');
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
        //'d-flex', 'flex-wrap', 'justify-content-center', 'gap-3', 'align-items-center', 'my-5'
        this.innerHTML=`
            <h2 class="mb-0">
                Connaissez/reconnaissez-vous cette oeuvre?
                <i id="play" class="bi bi-play-circle fs-1 ms-3"></i>
            </h2>
            <div id="inputs" class="d-flex flex-column justify-content-center align-items-center gap-3 my-5">
                <button class="skip btn btn-custom border-2" id="unknown">Jamais entendu</button>
                <button class="skip btn btn-custom border-2" id ="known">Déjà entendu, mais aucune idée de ce que c'est</button>
                <button class="blindtest btn btn-custom border-2">Je connais le compositeur et/ou le titre, j'essaie le blind test</button>     
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