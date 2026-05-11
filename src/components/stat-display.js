import { getStats, getUser } from "../api";

customElements.define("stat-display", class extends HTMLElement {
    static observedAttributes = ['filter', 'labels', 'message']
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
        box.setAttribute('class', 'flex-shrink-0 d-flex flex-wrap-reverse align-content-start stat-box p-1 border rounded border-2');

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

        if (highlight && highlight !== 'self') {
            box.querySelectorAll(`.${highlight}`).forEach(el => {
                el.classList.add('highlight');
            });
        } else if (highlight === 'self') {
            for (let i = 0; i < 114 - total; i++) {
                box.innerHTML += '<div class="cell empty"></div>';
            }
        }

        return box;
    }

    createWaffleAlt(max, stats, total) {
        
        const unknown = Math.round(stats['unknown']*max/total);
        const known = Math.round(stats['known']*max/total);
        const btFalse = Math.round(stats['bt-false']*max/total);
        const btComposer = Math.round(stats['bt-composer']*max/total);
        const btTitle = Math.round(stats['bt-title']*max/total);
        const btBoth = Math.round(stats['bt-both']*max/total);

        const box = document.createElement('div');
        box.setAttribute('class', 'flex-shrink-0 d-flex flex-wrap-reverse align-content-start stat-box p-1 border rounded border-2');

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

        return box;
    }

    createLabels(stats) {
        let total;
        if (stats) {
            total = [stats['unknown'], stats['known'], stats['bt-false'], stats['bt-composer'],stats['bt-title'],stats['bt-both']].reduce(((a, b) => a + b), 0);
        }

        if (total === 0) {
            total = 1;
        }

        const labels = document.createElement('div');
        labels.setAttribute('class', 'd-flex flex-column gap-2');
        labels.innerHTML = stats ? `
            <div class="d-flex align-items-center gap-2">
                <div class="cell bt-both"></div>
                <p class="m-0">Deviné le compositeur et le titre : ${stats['bt-both']} réponses (${Math.round(stats['bt-both']*100/total)}%)</p>
            </div>

            <div class="d-flex align-items-center gap-2">
                <div class="cell bt-title"></div>
                <p class="m-0">Deviné le titre : ${stats['bt-title']} réponses (${Math.round(stats['bt-title']*100/total)}%)</p>
            </div>

            <div class="d-flex align-items-center gap-2">
                <div class="cell bt-composer"></div>
                <p class="m-0">Deviné le compositeur : ${stats['bt-composer']} réponses (${Math.round(stats['bt-composer']*100/total)}%)</p>
            </div>

            <div class="d-flex align-items-center gap-2">
                <div class="cell bt-false"></div>
                <p class="m-0">Deviné ni le compositeur ni le titre : ${stats['bt-false']} réponses (${Math.round(stats['bt-false']*100/total)}%)</p>
            </div>

            <div class="d-flex align-items-center gap-2">
                <div class="cell known"></div>
                <p class="m-0">Déjà entendu : ${stats['known']} réponses (${Math.round(stats['known']*100/total)}%)</p>
            </div>

            <div class="d-flex align-items-center gap-2">
                <div class="cell unknown"></div>
                <p class="m-0">Jamais entendu : ${stats['unknown']} réponses (${Math.round(stats['unknown']*100/total)}%)</p>
            </div>
        `
        : `
            <div class="d-flex align-items-center gap-2">
                <div class="cell bt-both"></div>
                <p class="m-0">Deviné le compositeur et le titre</p>
            </div>

            <div class="d-flex align-items-center gap-2">
                <div class="cell bt-title"></div>
                <p class="m-0">Deviné le titre</p>
            </div>

            <div class="d-flex align-items-center gap-2">
                <div class="cell bt-composer"></div>
                <p class="m-0">Deviné le compositeur</p>
            </div>

            <div class="d-flex align-items-center gap-2">
                <div class="cell bt-false"></div>
                <p class="m-0">Deviné ni le compositeur ni le titre</p>
            </div>

            <div class="d-flex align-items-center gap-2">
                <div class="cell known"></div>
                <p class="m-0">Déjà entendu</p>
            </div>

            <div class="d-flex align-items-center gap-2">
                <div class="cell unknown"></div>
                <p class="m-0">Jamais entendu</p>
            </div>
        `

        return labels;
    }

    async loadTitleStats(id) {    
        const checkId = (el) => {
            return el['id'] == this.getAttribute('filter').slice(6);
        }
        
        const user = await getUser();
        const userResult = user['listened_titles'].find((el) => checkId(el))['pivot']['result'];
        const stats = await getStats(`titles/${id}`);

        // Pour tester l'affichage
        // const stats = {
        //     'unknown': 13,
        //     'known': 29,
        //     'bt-false': 12,
        //     'bt-composer': 8,
        //     'bt-title': 38,
        //     'bt-both': 23,
        // };

        const waffle = this.createWaffle(120, stats, userResult);
        const labels = this.getAttribute('labels') === 'full' ? this.createLabels(stats) : this.createLabels();

        const box = document.createElement('div');
        box.setAttribute('class', 'd-flex gap-4 p-1 align-items-center justify-content-end');

        if (this.getAttribute('message') === 'true') {
            let message;
            switch(userResult) {
                case 'unknown': message = "Vous n'aviez jamais entendu cette oeuvre"; break;
                case 'known': message = "Vous aviez déjà entendu cette oeuvre mais ne la connaissiez pas"; break;
                case 'bt-false': message = "Vous pensiez connaître cette oeuvre mais vous êtes trompé au blindtest"; break;
                case 'bt-composer': message = "Vous avez trouvé le compositeur de cette oeuvre"; break;
                case 'bt-title': message = "Vous avez trouvé le titre de cette oeuvre"; break;
                case 'bt-both': message = "Vous avez trouvé le compositeur et le titre de cette oeuvre"; break;
            };

            const total = [stats['unknown'], stats['known'], stats['bt-false'], stats['bt-composer'],stats['bt-title'],stats['bt-both']].reduce(((a, b) => a + b), 0);

            box.innerHTML += `<p class="stat-message">${message}, comme ${stats[userResult]-1} autres personnes (${Math.round(stats[userResult]*100/total)}%).</p>`;
        }

        box.append(waffle);

        if (this.getAttribute('labels') === 'full' || this.getAttribute('labels') === 'true') {
            box.append(labels);
        }
        this.innerHTML = '';
        this.append(box);
    }

    async loadUserStats() {
        const user = await getUser();
        const userTitles = user['listened_titles'];

        const stats = {
            'unknown': 0,
            'known': 0,
            'bt-false': 0,
            'bt-composer': 0,
            'bt-title': 0,
            'bt-both': 0
        }

        userTitles.forEach((title) => {
            stats[title['pivot']['result']] ++;
        });

        console.log(userTitles, stats);
        const waffle = this.createWaffle(120, stats, 'self');
        
        const total = [stats['unknown'], stats['known'], stats['bt-false'], stats['bt-composer'],stats['bt-title'],stats['bt-both']].reduce(((a, b) => a + b), 0);
        const message = document.createElement('p');
        message.innerText = `Vous avez déjà découvert ${total} pièces.
        Votre score est de ${stats['bt-composer'] + stats['bt-title'] + 2*stats['bt-both']}/${total*2} (Max. 228).
        `
        
        const box = document.createElement('div');
        box.setAttribute('class', 'd-flex flex-column gap-4 p-1');
        box.append(waffle, message);

        this.innerHTML = '';
        this.append(box);
    }

    async loadGlobalStats(filter) {
        const statsArray = await getStats(`blindtest`);
        let stats;

        if (filter === 'all') {
            stats = statsArray['total'];
        } else if (filter === 'self-taught' || filter === 'conservatory' || filter === 'hem') {
            stats = statsArray['by_education_level'][filter];
        } else if (filter.startsWith('childhood-')) {
            stats = statsArray['by_childhood_genre'][filter.slice(10)];
        } else if (filter.startsWith('current-')) {
            stats = statsArray['by_current_genre'][filter.slice(8)];            
        }
        // console.log(stats);

        const total = [statsArray['total']['unknown'], statsArray['total']['known'], statsArray['total']['bt-false'], statsArray['total']['bt-composer'],statsArray['total']['bt-title'],statsArray['total']['bt-both']].reduce(((a, b) => a + b), 0);

        console.log(total);

        const waffle = this.createWaffleAlt(120, stats, total);
        const labels = this.createLabels(stats);

        const box = document.createElement('div');
        box.setAttribute('class', 'd-flex gap-4 p-1 align-items-center justify-content-end');
        box.append(waffle,labels);

        this.innerHTML = '';
        this.append(box);
    }

    async render() {

        if (this.getAttribute('filter').startsWith('title-')) {
            const id = this.getAttribute('filter').slice(6);
            this.loadTitleStats(id);
        } else if (this.getAttribute('filter') === 'self') {
            this.loadUserStats();
        } else {
            this.loadGlobalStats(this.getAttribute('filter'));
        }
    }

})