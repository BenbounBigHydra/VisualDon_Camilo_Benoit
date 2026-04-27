// import { forceSimulation, select } from "d3";
import { addAnswered, API_BASE } from "../api.js";

customElements.define("word-cloud", class extends HTMLElement {
    static observedAttributes = ['get-endpoint', 'post-endpoint'] 
    // expected values : genres, composers, education-levels (get) ; genres, known-composers, known-composer-titles, childhood-genres, current-genres

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    async getData() {
        const res = await fetch(`${API_BASE}/${this.getAttribute('get-endpoint')}`);
        let data = await res.json();
        
        return data;
    }

    async sendForm() {
        const res = await fetch(`${API_BASE}/${this.getAttribute('post-endpoint')}`, {
            method: 'POST',
            headers: {
                "Accept" : "application/json",
                "Authorization" : `UUID ${userUuid}`
            }
        });
        const data = await res.json();
        console.log(data);
        addAnswered(this.getAttribute('post-endpoint'));
    }

    getWord(el) {
        if (this.getAttribute('get-endpoint') === 'composers') {
            return el.name;
        } else {
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
        };
    }

    getPostValue(el) {
        return this.getAttribute('get-endpoint') === 'composers'? el.id : el;
    }

    toggleActive(id) {
        document.querySelector(`[for="${id}"]`).classList.toggle('active');
    }

    async render() {
        const data = await this.getData();
        // console.log(data);
        // console.log(data.map(el => this.getWord(el)));
        // console.log(data.map(el => this.getPostValue(el)));

        const cloud = document.createElement('form');
        cloud.setAttribute('id', this.getAttribute('post-endpoint'));
        cloud.classList.add(['flex', 'flex-flow']);

        data.forEach(el => {
            const word = this.getWord(el);
            const value = this.getPostValue(el);
            cloud.innerHTML += `
                <input 
                    type="checkbox" 
                    id="${value}"
                    name="${this.getAttribute('post-endpoint')}[]"
                    value="${value}"
                    class="btn-check"
                />
                <label 
                    for="${value}"
                    class="btn border-2 rounded-0 btn-cloud"
                >${word}</label>
            `
        });
        cloud.addEventListener('click', (e) => {
            // console.log(e.target);
            if (e.target.tagName === 'INPUT') {
                this.toggleActive(e.target.id);
            }
        })
        this.innerHTML = '';
        this.appendChild(cloud);
    }
})