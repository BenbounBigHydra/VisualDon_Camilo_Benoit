import { getStats, getUser } from "../api";

customElements.define("stat-display", class extends HTMLElement {
    static observedAttributes = ['filter']
    // filter : self (stats perso), all, self-taught, conservatory, hem, (vue générale), "title-id" (stats oeuvre)

    async connectedCallback() {
        await this.render();
    }

    async attributeChangedCallback() {
        await this.render();
    }

    async loadTitleStats() {
        const user = await getUser();
        const stats = await getStats('titles', '552');
        const total = [stats['unknown'], stats['known'], stats['bt-false'], stats['bt-composer'],stats['bt-title'],stats['bt-both']].reduce(((a, b) => a + b), 0);
        
        console.log(stats, stats['unknown'], stats['known'], stats['bt-false'], stats['bt-composer'],stats['bt-title'],stats['bt-both'], total);

        const unknown = total > 50? Math.round(stats['unknown']*60/total) : stats['unknown'];
        const known = total > 50? Math.round(stats['known']*60/total) : stats['known'];
        const btFalse = total > 50? Math.round(stats['bt-false']*60/total) : stats['bt-false'];
        const btComposer = total > 50? Math.round(stats['bt-composer']*60/total) : stats['bt-composer'];
        const btTitle = total > 50? Math.round(stats['bt-title']*60/total) : stats['bt-title'];
        const btBoth = total > 50? Math.round(stats['bt-both']*60/total) : stats['bt-both'];

        const box = document.createElement('div');
        box.setAttribute('class', 'd-flex flex-wrap-reverse stat-box gap-1 p-2 bg-white rounded');

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
        
        // Pour tester l'affichage
        // for (let index = 0; index < 13*50/97; index++) {
        //     box.innerHTML += '<div class="cell unknown"></div>';
        // }
        // for (let index = 0; index < 25*50/97; index++) {
        //     box.innerHTML += '<div class="cell known"></div>';
        // }
        // for (let index = 0; index < 12*50/97; index++) {
        //     box.innerHTML += '<div class="cell bt-false"></div>';
        // }
        // for (let index = 0; index < 4*50/97; index++) {
        //     box.innerHTML += '<div class="cell bt-composer"></div>';
        // }
        // for (let index = 0; index < 26*50/97; index++) {
        //     box.innerHTML += '<div class="cell bt-title"></div>';
        // }
        // for (let index = 0; index < 17*50/97; index++) {
        //     box.innerHTML += '<div class="cell bt-both"></div>';
        // }

        this.append(box);
    }

    async render() {
        this.loadTitleStats();
    }

})