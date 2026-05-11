import { API_BASE, getData, getUser } from "../api";

customElements.define("results-page", class extends HTMLElement {
    static observedAttributes = ['display-mode', 'filter']
    static dataStats;
    static userTitles;
    //display mode : cloud-composer, cloud-title, cloud-blindtest, stat-education, stat-genre

    async connectedCallback() {
        await this.firstLoad();
        await this.render();
    }

    async attributeChangedCallback() {
        await this.render();
    }

    async firstLoad() {
        this.setAttribute('class', 'rounded-3 p-5 bg-light border border-primary-subtle border-2 d-flex justify-content-center flex-column align-items-center');
        this.dataStats = await getData('blindtest/stats');
        const user = await getUser();
        this.userTitles = user['listened-titles'];
        // this.setAttribute('display-mode', 'stats');
    }

    statsPage() {

    }

    async render() {
        // if (this.getAttribute('display-mode').startsWith('cloud-')) {
        //     this.dataStats = await getData('composer/all/stats');
        // } else if (this.getAttribute('display-mode').startsWith('stat-')) {
        //     this.dataStats = await getData('blindtest/stats');
        //     this.statsPage();
        // }
        // this.innerHTML = '<results-cloud display-mode="composer-known"/>'

        this.innerHTML = `
            <div class="d-flex gap-5 justify-content-between align-items-center w-100">
                <stat-display id="self" filter="self"></stat-display>
                <div class="d-flex flex-column">
                    <div id="filters" class="mb-3">
                        <div>
                            <p class="mb-1 fw-semibold">Éducation musicale</p>
                            <div class="d-flex flex-wrap gap-1 align-items-center mb-1">
                                <button id="self-taught" class="btn btn-sm btn-custom border-2">Autodidacte</button>
                                <button id="conservatory" class="btn btn-sm btn-custom border-2">Conservatoire ou école de musique</button>
                                <button id="hem" class="btn btn-sm btn-custom border-2">Haute Ecole de Musique</button>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <div>
                                <p class="mb-1 fw-semibold">Genres écoutés pendant l'enfance</p>
                                <div class="d-flex flex-wrap gap-1 align-items-center mb-1">
                                    <button id="childhood-blues" class="btn btn-sm btn-custom border-2">Blues</button>
                                    <button id="childhood-country" class="btn btn-sm btn-custom border-2">Country</button>
                                    <button id="childhood-classical" class="btn btn-sm btn-custom border-2">Classique</button>
                                    <button id="childhood-drum&bass" class="btn btn-sm btn-custom border-2">Drum & Bass</button>
                                    <button id="childhood-edm" class="btn btn-sm btn-custom border-2">EDM</button>
                                    <button id="childhood-hip-hop" class="btn btn-sm btn-custom border-2">Hip-Hop</button>
                                    <button id="childhood-jazz" class="btn btn-sm btn-custom border-2">Jazz</button>
                                    <button id="childhood-metal" class="btn btn-sm btn-custom border-2">Métal</button>
                                    <button id="childhood-pop" class="btn btn-sm btn-custom border-2">Pop</button>
                                    <button id="childhood-rap" class="btn btn-sm btn-custom border-2">Rap</button>
                                    <button id="childhood-reggae" class="btn btn-sm btn-custom border-2">Reggae</button>
                                    <button id="childhood-r&b" class="btn btn-sm btn-custom border-2">R&B</button>
                                    <button id="childhood-rock" class="btn btn-sm btn-custom border-2">Rock</button>
                                    <button id="childhood-techno" class="btn btn-sm btn-custom border-2">Techno</button>
                                    <button id="childhood-world" class="btn btn-sm btn-custom border-2">Musiques du Monde</button>
                                </div>
                            </div>

                            <div>
                                <p class="mb-1 fw-semibold">Genres écoutés actuellement</p>
                                <div class="d-flex flex-wrap gap-1 align-items-center mb-1">
                                    <button id="current-blues" class="btn btn-sm btn-custom border-2">Blues</button>
                                    <button id="current-country" class="btn btn-sm btn-custom border-2">Country</button>
                                    <button id="current-classical" class="btn btn-sm btn-custom border-2">Classique</button>
                                    <button id="current-drum&bass" class="btn btn-sm btn-custom border-2">Drum & Bass</button>
                                    <button id="current-edm" class="btn btn-sm btn-custom border-2">EDM</button>
                                    <button id="current-hip-hop" class="btn btn-sm btn-custom border-2">Hip-Hop</button>
                                    <button id="current-jazz" class="btn btn-sm btn-custom border-2">Jazz</button>
                                    <button id="current-metal" class="btn btn-sm btn-custom border-2">Métal</button>
                                    <button id="current-pop" class="btn btn-sm btn-custom border-2">Pop</button>
                                    <button id="current-rap" class="btn btn-sm btn-custom border-2">Rap</button>
                                    <button id="current-reggae" class="btn btn-sm btn-custom border-2">Reggae</button>
                                    <button id="current-r&b" class="btn btn-sm btn-custom border-2">R&B</button>
                                    <button id="current-rock" class="btn btn-sm btn-custom border-2">Rock</button>
                                    <button id="current-techno" class="btn btn-sm btn-custom border-2">Techno</button>
                                    <button id="current-world" class="btn btn-sm btn-custom border-2">Musiques du Monde</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <stat-display id="global" filter="all"></stat-display>
                </div>
            </div>
        `

        const display = document.querySelector('#global');

        document.querySelector('#filters').addEventListener('click', (e) => {
            console.log(e.target);
            if (e.target.tagName === 'BUTTON') {
                if (e.target.classList.contains('active')) {
                    e.target.classList.remove('active');
                    display.setAttribute('filter', 'all');
                } else {
                    document.querySelectorAll('#filters button').forEach(e => e.classList.remove('active'));
                    e.target.classList.add('active');
                    display.setAttribute('filter', e.target.id);
                }
            }
        })
    }

})
