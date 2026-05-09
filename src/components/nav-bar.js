customElements.define("nav-bar", class extends HTMLElement {
    static observedAttributes = ['selected']

    async connectedCallback() {
        await this.render();
    }

    async attributeChangedCallback() {
        await this.render();
    }

    render() {
        this.setAttribute('class', 'd-flex position-absolute ms-3 gap-3 align-items-start');
        this.innerHTML = `
            <div id="nav-blindtest" class="btn btn-nav bg-light px-4 border border-primary-subtle border-2 border-bottom-0 rounded-bottom-0">Blindtest</div>

            <div id="nav-results" class="btn btn-nav bg-light border px-4 border-primary-subtle border-2 border-bottom-0 rounded-bottom-0">Résultats</div>

            <div id="nav-chronology" class="btn btn-nav bg-light border px-4 border-primary-subtle border-2 border-bottom-0 rounded-bottom-0">Chronologie</div>
        `
        this.querySelector(`#nav-${this.getAttribute('selected')}`).classList.add('selected');
    }

})