import { API_BASE, getAnswered, getUser, getUserUuid } from "../api.js";

customElements.define('blindtest-page', class extends HTMLElement {
    titles;

    async connectedCallback() {
        await this.render();
    }

    async loadTitles() {
        const res = await fetch(`${API_BASE}/titles`, {
            headers: {
                "Accept" : "application/json"
            }
        });
        const data = await res.json();
        this.titles = data;
    }

    async getRandomTitle() {
        const user = await getUser();
        const userTitles = user.listened_titles;
        const titles = this.titles;
        let title;
        do {
            const id = Math.floor(Math.random() * titles.length);
            title = titles[id];
        } while (userTitles.includes(title));
        return title;
    }

    async loadBlindTest() {
        this.loadTitles();
        const title = await this.getRandomTitle();
        this.innerHTML = `
            <div class="border border-primary rounded-3 p-4 shadow-sm bg-light mx-auto" style="width: 90%;">
                <div id="embed-iframe"></div>
                <div id="listener"></div>
                <blindtest-question title-id="${title.id}"></blindtest-question>
            </div>
        `
        this.addEventListener('play_click', () => alert('1'))
    }

    loadClouds() {
        const answered = getAnswered();

        this.innerHTML = `
            <div class="border border-primary rounded-3 p-4 shadow-sm bg-light mx-auto d-flex justify-content-center flex-column align-items-center" style="width: 90%;">
                <h2></h2>
                <word-cloud></word-cloud>
                <img class="pt-3" style="max-height: 15vh;" id="scroll-arrow" src="./src/assets/Asset 1.svg" alt="flèche vers le bas">
            </div>

        `;
        const title = this.querySelector('h2');
        const wordCloud = this.querySelector('word-cloud');

        if (answered.includes('known-composers')) {

            title.innerText = "Pour lesquels pourrais-tu donner le nom ou fredonner une oeuvre?";
            wordCloud.setAttribute('get-endpoint', 'composers');
            wordCloud.setAttribute('post-endpoint', 'known-composer-titles');

        } else if (answered.includes('education-levels')) {

            title.innerText = "Quels compositeurs parmi ceux-ci reconnais-tu?";
            wordCloud.setAttribute('get-endpoint', 'composers');
            wordCloud.setAttribute('post-endpoint', 'known-composers');

        } else if (answered.includes('current-genres')) {

            title.innerText = "Quelle éducation musicale as-tu reçu ?";
            wordCloud.setAttribute('get-endpoint', 'education-levels');
            wordCloud.setAttribute('post-endpoint', 'education-levels');

        } else if (answered.includes('childhood-genres')) {

            title.innerText = "Quels genres écoutes-tu actuellement?";
            wordCloud.setAttribute('get-endpoint', 'genres');
            wordCloud.setAttribute('post-endpoint', 'current-genres');
            
        } else {

            title.innerText = "Quels genres as-tu entendu chez toi durant ton enfance?";
            wordCloud.setAttribute('get-endpoint', 'genres');
            wordCloud.setAttribute('post-endpoint', 'childhood-genres');            
        }
    }

    async render() {
        const answered = getAnswered();

        if (answered.includes('known-composer-titles')) {
            this.loadBlindTest();
        } else {
            this.loadClouds();
        }
    }
})