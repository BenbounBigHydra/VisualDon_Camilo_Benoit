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
        this.innerHTML = `
            <h1>Nom du Projet</h1>
            <p>jsp jsp il faudra qu'on décide d'une intro - définition de musique classique ou savante - but du projet</p>
        `

        let userUuid = getUserUuid();
        if (! userUuid) {
            this.setUserUuid();
            this.innerHTML += `
                <p>Scrollez pour commencer !</p>
                <img id="scroll-arrow" src="./src/assets/Asset 1.svg" alt="flèche vers le bas">
            `
        } else {
            const canAccessResults = JSON.parse(localStorage.getItem('can_access_results')) === 'true';
            this.innerHTML += `
                <div class="flex">
                    <a class="btn border-2 rounded-0 btn-intro" href="../../blindtest.html">Blind Test</a>
                    <a class="btn border-2 rounded-0 btn-intro ${canAccessResults ? '' : 'disabled'}" ${canAccessResults? 'href="../../results.html"' : ''}>Résultats</a>
            `
        }
        
        console.log(`uuid : ${userUuid}`);
    }
})