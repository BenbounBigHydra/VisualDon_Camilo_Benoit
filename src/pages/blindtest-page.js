import { API_BASE, getAnswered, getUser, getUserUuid } from "../api.js";

customElements.define('blindtest-page', class extends HTMLElement {
    async connectedCallback() {
        await this.render();
    }

    async render() {
        const user = await getUser();
        const answered = getAnswered();
        console.log(user);

        this.innerHTML = `
            <h2></h2>
            <word-cloud></word-cloud>
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
            title.innerText = "question education musicale?";
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
})