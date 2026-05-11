import { getStats, getTitle, getTitles } from "../api";
import * as d3 from "d3";

customElements.define("timeline-display", class extends HTMLElement {
    static observedAttributes = ['title-id']
    static heardStats
    static correctStats

    async connectedCallback() {
        await this.firstLoad();
        await this.render();
    }

    async attributeChangedCallback() {
        await this.render();
    }

    async firstLoad() {
        const titles = await getStats('titles/all');

        this.heardStats = titles.map((stats) => {
            const sum = [stats['known'], stats['bt-false'], stats['bt-composer'],stats['bt-title'],stats['bt-both']].reduce(((a, b) => a + b), 0);

            const result = {
                'title': stats['title']['name'],
                'composer': stats['title']['composer']['name'],
                'year': stats['title']['release_year'],
                'data': sum
            }

            return result;
        });

        this.heardStats.sort((a, b) => a.year - b.year);

        this.correctStats = titles.map((stats) => {
            const sum = [stats['bt-composer'],stats['bt-title'],stats['bt-both']].reduce(((a, b) => a + b), 0);

            const result = {
                'title': stats['title']['name'],
                'composer': stats['title']['composer']['name'],
                'year': stats['title']['release_year'],
                'data': sum
            }

            return result;
        });
        
        this.heardStats.sort((a, b) => a.year - b.year);
    }

    async render() {
        const currentTitle = await getTitle(this.getAttribute('title-id'));

        const width = document.querySelector('chronology-page').clientWidth;
        const height = 300;
        const marginTop = 20;
        const marginRight = 20;
        const marginBottom = 30;
        const marginLeft = 30;

        const scaleX = d3.scaleTime()
            .domain(d3.extent(this.heardStats, d => new Date(d.year)))
            .range([marginLeft, width-marginRight]);

        const scaleY = d3.scaleLinear()
            .domain([0, d3.max(this.heardStats, d => d.data)])
            .range([height - marginBottom, marginTop]);

        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; overflow: visible; font: 10px sans-serif;");

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(scaleX).ticks(width / 80).tickSizeOuter(0));

        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(scaleY).ticks(height / 40))
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1));

        const line = d3.line()
            .x(d => scaleX(d.year))
            .y(d => scaleY(d.data));

        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line(this.heardStats));

        this.append(svg.node());
    }

})