import { getTitle } from "../api";

customElements.define("title-info", class extends HTMLElement {
    static observedAttributes = ['title-id']
    static infoTitle

    async connectedCallback() {
        this.render();
    }

    async attributeChangedCallback() {
        this.render();
    }

    getName(el) {
        switch (el) {
            case "medieval" : return "Moyen-Âge"; break;
            case "renaissance" : return "Renaissance"; break;
            case "baroque" : return "Baroque"; break;
            case "classical" : return "Classique"; break;
            case "early_romantic" : return "Début du romantisme"; break;
            case "romantic" : return "Romantisme"; break;
            case "late_romantic" : return "Fin du romantisme"; break;
            case "20th_century" : return "20e siècle"; break;
            case "post-war" : return "Après-guerre"; break;
            case "21st_century" : return "21e siècle"; break;
            }
    }

    async render() {
        this.infoTitle = await getTitle(this.getAttribute('title-id'));
        this.innerHTML = `
            <div class="d-inline">
                <h2>${this.infoTitle.name}
                    <a class="ms-2" href="https://open.spotify.com/track/${this.infoTitle.spotify_uri}">
                    <i class="bi bi-spotify fs-2"></i></a></h2>
                <p class="mt-2 fs-5">composée par <span class="fw-semibold">${this.infoTitle.composer.name}</span><br/>composée en ${this.infoTitle.release_year} (${this.getName(this.infoTitle.composer.period)})</p>
                <img class="portrait" src="${this.infoTitle.composer.portrait_url}">
            </div>
            <p>${this.infoTitle.description}</p>
        `
        const button = document.createElement('button');
        button.setAttribute('class', 'btn btn-custom border-2');
        button.innerText = "suivant";
        button.addEventListener('click', () => {
            this.parentElement.removeChild(this);
            document.querySelector('blindtest-question').dispatchEvent(new CustomEvent('loadnext'));
        })
        this.append(button);
    }

})