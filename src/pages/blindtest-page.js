import { API_BASE, getUser } from "../api";

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
        const data = res.json();
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
        } while (userTitles.includes(title))
        return title;
    }

    async render() {
        this.loadTitles();
        const title = this.getRandomTitle();
        // this.innerHTML = `
        //     <blindtest-question title-id="${}"></blindtest-question>
        // `
    }
})