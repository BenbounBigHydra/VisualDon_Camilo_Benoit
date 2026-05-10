import { getData } from "../api";
import * as d3 from "d3";
import d3Cloud from "d3-cloud";


customElements.define("results-cloud", class extends HTMLElement {
    static observedAttributes = ['display-mode', 'filter']
    static dataStats;
    // display-mode : composer-known, composer-title-known, blindtest-known
    // filter : childhood-blues, blues, childhood-country, country, ...

    async connectedCallback() {
        this.dataStats = await getData('composer/all/stats');
        await this.render();
    }

    async attributeChangedCallback() {
        await this.render();
    }

    WordCloud(text, {
        size = group => group['value'], // Given a grouping of words, returns the size factor for that word
        word = d => d, // Given an item of the data array, returns the word
        marginTop = 0, // top margin, in pixels
        marginRight = 0, // right margin, in pixels
        marginBottom = 0, // bottom margin, in pixels
        marginLeft = 0, // left margin, in pixels
        width = document.querySelector('results-page').clientWidth, // outer width, in pixels
        height = 400, // outer height, in pixels
        maxWords = 250, // maximum number of words to extract from the text
        fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"', // font family
        fontScale = 22, // base font size
        fill = '#000000', // text color, can be a constant or a function of the word
        padding = 3, // amount of padding between the words (in pixels)
        rotate = 0, // a constant or function to rotate the words
        invalidation // when this promise resolves, stop the simulation
        } = {}) {
        // const words = typeof text === "string" ? text.split(/\W+/g) : Array.from(text);
        
        // const data = text.map((e) => ({text: e.name, size}));
        
        const svg = d3.create("svg")
            .attr("viewBox", [0, 0, width, height])
            .attr("width", width)
            .attr("font-family", fontFamily)
            .attr("text-anchor", "middle")
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        const g = svg.append("g").attr("transform", `translate(${marginLeft},${marginTop})`);
        
        const maxSize = text.reduce((a, b) => Math.max(a, b.size), 0);

        const cloud = d3Cloud()
            .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
            .words(text)
            .padding(padding)
            .rotate(rotate)
            .font(fontFamily)
            .fontSize(d => d.size/maxSize * fontScale + 8)
            .on("word", ({size, x, y, rotate, text}) => {
                g.append("text")
                    .datum(text)
                    .attr("font-size", size)
                    .attr("fill", fill)
                    .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
                    .text(text);
            });

        cloud.start();
        invalidation && invalidation.then(() => cloud.stop());
        return svg.node();
    }

    getStat(e) {
        let categoryArray;
        const filter = this.getAttribute('filter');

        switch(this.getAttribute('display-mode')) {
            case 'composer-known': categoryArray = e['composer_known']; break;
            case 'composer-title-known': categoryArray = e['composer_title_known']; break;
            case 'blindtest-known': categoryArray = e['blind_test_known']; break;
        }

        if (!filter) {
            return categoryArray['total'];
        } else if (filter.startsWith('childhood-')) {
            return categoryArray['by_childhood_genre'][filter.slice(10)];
        } else {
            return categoryArray['by_current_genre'][filter];
        }
    }

    render() {
        const words = this.dataStats.map(e => {
            return {
                'text': e['composer']['name'],
                'size': this.getStat(e)
            }
        });
        // console.log(words, maxSize, this.dataStats);

        const cloud = this.WordCloud(words);
        this.append(cloud);
    }

})