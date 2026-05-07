import { getStats, getUser } from "../api";

customElements.define("stat-display", class extends HTMLElement {
    static observedAttributes = ['filter', 'labels']
    // filter : self (stats perso), all, self-taught, conservatory, hem, (vue générale), "title-id" (stats oeuvre)

    async connectedCallback() {
        await this.render();
    }

    async attributeChangedCallback() {
        await this.render();
    }

    createWaffle(max, stats, highlight) {
        const total = [stats['unknown'], stats['known'], stats['bt-false'], stats['bt-composer'],stats['bt-title'],stats['bt-both']].reduce(((a, b) => a + b), 0);
        
        const unknown = total > max? Math.round(stats['unknown']*max/total) : stats['unknown'];
        const known = total > max? Math.round(stats['known']*max/total) : stats['known'];
        const btFalse = total > max? Math.round(stats['bt-false']*max/total) : stats['bt-false'];
        const btComposer = total > max? Math.round(stats['bt-composer']*max/total) : stats['bt-composer'];
        const btTitle = total > max? Math.round(stats['bt-title']*max/total) : stats['bt-title'];
        const btBoth = total > max? Math.round(stats['bt-both']*max/total) : stats['bt-both'];

        const box = document.createElement('div');
        box.setAttribute('class', 'd-flex flex-wrap-reverse align-content-start stat-box');

        for (let index = 0; index < unknown; index++) {
            box.innerHTML += '<div class="cell unknown"></div>';
        }
        for (let index = 0; index < known; index++) {
            box.innerHTML += '<div class="cell known"></div>';
        }
        for (let index = 0; index < btFalse; index++) {
            box.innerHTML += '<div class="cell bt-false"></div>';
        }
        for (let index = 0; index < btComposer; index++) {
            box.innerHTML += '<div class="cell bt-composer"></div>';
        }
        for (let index = 0; index < btTitle; index++) {
            box.innerHTML += '<div class="cell bt-title"></div>';
        }
        for (let index = 0; index < btBoth; index++) {
            box.innerHTML += '<div class="cell bt-both"></div>';
        }

        if (highlight) {
            box.querySelectorAll(`.${highlight}`).forEach(el => {
                el.classList.add('highlight');
            });
        }

        return box;
    }

    createLabels(stats) {
        const total = [stats['unknown'], stats['known'], stats['bt-false'], stats['bt-composer'],stats['bt-title'],stats['bt-both']].reduce(((a, b) => a + b), 0);

        const labels = document.createElement('div');
        labels.setAttribute('class', 'd-flex flex-column gap-2');
        labels.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <div class="cell bt-both"></div>
                <p class="m-0">Deviné le compositeur et le titre : ${stats['bt-both']} personnes (${stats['bt-both']*100/total}%)</p>
            </div>

            <div class="d-flex align-items-center gap-2">
                <div class="cell bt-title"></div>
                <p class="m-0">Deviné le titre : ${stats['bt-title']} personnes (${stats['bt-title']*100/total}%)</p>
            </div>

            <div class="d-flex align-items-center gap-2">
                <div class="cell bt-composer"></div>
                <p class="m-0">Deviné le compositeur : ${stats['bt-composer']} personnes (${stats['bt-composer']*100/total}%)</p>
            </div>

            <div class="d-flex align-items-center gap-2">
                <div class="cell bt-false"></div>
                <p class="m-0">Deviné ni le compositeur ni le titre : ${stats['bt-false']} personnes (${stats['bt-false']*100/total}%)</p>
            </div>

            <div class="d-flex align-items-center gap-2">
                <div class="cell known"></div>
                <p class="m-0">Déjà entendu : ${stats['known']} personnes (${stats['known']*100/total}%)</p>
            </div>

            <div class="d-flex align-items-center gap-2">
                <div class="cell unknown"></div>
                <p class="m-0">Jamais entendu : ${stats['unknown']} personnes (${stats['unknown']*100/total}%)</p>
            </div>
        `

        return labels;
    }

    async loadTitleStats(id) {
        const user = await getUser();
        const stats = await getStats('titles', id);

        // Pour tester l'affichage
        // const test = {
        //     'unknown': 13,
        //     'known': 29,
        //     'bt-false': 12,
        //     'bt-composer': 8,
        //     'bt-title': 38,
        //     'bt-both': 23,
        // };
        // const waffle = this.createWaffle(120, test, 'bt-composer');
        
        const waffle = this.createWaffle(120, stats);
        const labels = this.createLabels(stats);

        const box = document.createElement('div');
        box.setAttribute('class', 'd-flex gap-2 p-1 align-items-center justify-content-end')
        box.append(waffle);
        if (this.getAttribute('labels') === 'true') {
            box.append(labels);
        }
        this.innerHTML = '';
        this.append(box);
    }

    async render() {

        if (this.getAttribute('filter').startsWith('title-')) {
            const id = this.getAttribute('filter').slice(6);
            this.loadTitleStats(id);
        }
    }

})