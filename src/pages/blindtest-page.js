import { API_BASE, checkResultAccess, getAnswered, getUser, getUserUuid } from "../api.js";

customElements.define('blindtest-page', class extends HTMLElement {
    titles;

    async connectedCallback() {
        await this.render();
    }

    async loadBlindTest(loadNavBar) {
        // this.loadTitles();
        // const title = await this.getRandomTitle();
        this.innerHTML = `
            <div id="embed-iframe"></div>
            <div id="listener"></div>
            <blindtest-question title-id=""></blindtest-question>
        `
        if (loadNavBar) {
            const navBar = document.createElement('nav-bar');
            navBar.setAttribute('selected', 'blindtest');
            console.log(navBar);
            this.insertAdjacentElement('beforebegin', navBar);
        }
    }

    loadClouds() {
        const answered = getAnswered();

        this.innerHTML = `
            <h2></h2>
            <word-cloud></word-cloud>
            <!-- <img class="pt-3" style="max-height: 15vh;" id="scroll-arrow" src="./src/assets/Asset 1.svg" alt="flèche vers le bas"> -->
        `;
        const title = this.querySelector('h2');
        const wordCloud = this.querySelector('word-cloud');

        if (answered.includes('known-composers')) {

            title.innerText = "Pour lesquels pourrais-tu donner le nom ou fredonner une oeuvre?";
            wordCloud.setAttribute('get-endpoint', 'composers');
            wordCloud.setAttribute('post-endpoint', 'known-composer-titles');

        } else if (answered.includes('education-levels')) {

            title.innerText = "Quels compositeurs parmi ceux-ci reconnais-tu de nom?";
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
        const canAccessResults = await checkResultAccess();

        this.setAttribute('class', 'rounded-3 p-5 bg-light border border-primary-subtle border-2 d-flex justify-content-center flex-column align-items-center');

        if (answered.includes('known-composer-titles')) {
            this.loadBlindTest(canAccessResults);
        } else {
            this.loadClouds();
        }
    }
})