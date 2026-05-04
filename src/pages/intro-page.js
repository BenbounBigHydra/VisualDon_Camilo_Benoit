import { API_BASE, getUserUuid } from "../api.js";

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

    async render() {
        console.dir(this);

        this.innerHTML = `
            <div class="border border-primary rounded-3 p-4 shadow-sm bg-light mx-auto" style="width: 90%;">
                <h1>Classical Education</h1>
                <p>Le but de cette représentation est d'explorer l'impact de la musique savante, communément appelée musique classique, sur la société actuelle à travers le degré de connaissance de différentes oeuvres et compositeurs.trices classiques. Nous voulons comprendre la corrélation possible entre l'éducation musicale d'une personne ainsi que ses préférences musicales et le degré de connaissance de cette personne vis-à-vis de la musique savante.</p>
                <p style="font-style: italic;">Le terme "musique classique" sera régulièrement utilisé dans ce projet pour désigner la "musique savante".</p>
            </div>
        `

        let userUuid = getUserUuid();
        if (! userUuid) {
            this.setUserUuid();
            this.firstElementChild.innerHTML += `
                <div class="d-flex gap-5 flex-column align-items-center">
                    <img class="pt-3" style="max-height: 15vh;" id="scroll-arrow" src="./src/assets/Asset 1.svg" alt="flèche vers le bas">
                    <p>Scrollez pour commencer !</p>
                </div>
            `
        } else {
            const canAccessResults = JSON.parse(localStorage.getItem('can_access_results')) === 'true';
            this.firstElementChild.innerHTML += `
                <div class="d-flex justify-content-center gap-5">
                    <a class="btn border-2 rounded-2 btn-intro" href="../../blindtest.html">Blind Test</a>
                    <a class="btn border-2 rounded-2 btn-intro ${canAccessResults ? '' : 'disabled'}" ${canAccessResults? 'href="../../results.html"' : ''}>Résultats</a>
                </div>
            `
        }
        
        console.log(`uuid : ${userUuid}`);
    }
})