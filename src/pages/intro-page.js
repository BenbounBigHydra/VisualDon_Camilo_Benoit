import { API_BASE, checkResultAccess, getUserUuid } from "../api.js";

customElements.define('intro-page', class extends HTMLElement {
    async connectedCallback() {
        await this.render();
    }

    async setUserUuid() {
        const res = await fetch(`${API_BASE}/join-blind-test`);
        const data = await res.json();
        const uuid = data.uuid;
        localStorage.setItem('user_uuid', JSON.stringify(uuid));
    }

    loadBlindTestPage() {
        document.querySelector('body').innerHTML = '<blindtest-page />';
    }

    async render() {
        
        this.setAttribute('class', 'rounded-3 p-4 bg-light border border-primary-subtle border-2');
        this.innerHTML = `
            <h1>Classical Education</h1>
            <p>Le but de cette représentation est d'explorer l'impact de la musique savante, communément appelée musique classique, sur la société actuelle à travers le degré de connaissance de différentes oeuvres et compositeurs.trices classiques. Nous voulons comprendre la corrélation possible entre l'éducation musicale d'une personne ainsi que ses préférences musicales et le degré de connaissance de cette personne vis-à-vis de la musique savante.</p>
            <p style="font-style: italic;">Le terme "musique classique" sera régulièrement utilisé dans ce projet pour désigner la "musique savante".</p>
        `

        let userUuid = getUserUuid();

        if (! userUuid) {
            this.setUserUuid();
        }
        const canAccessResults = await checkResultAccess();
        this.innerHTML += `
            <div class="d-flex justify-content-center gap-5">
                <button id="bt-button" class="btn border-2 btn-custom">Blind Test</button>
                <button id="results-button" class="btn border-2 btn-custom ${canAccessResults ? '' : 'disabled'}">Résultats</button>
        `
        document.querySelector('#bt-button').addEventListener('click', () => {this.loadBlindTestPage()})
        
        console.log(`uuid : ${userUuid}`);
    }
})