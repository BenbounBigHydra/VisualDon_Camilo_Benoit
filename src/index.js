// import { forceCenter, forceManyBody, forceSimulation, select } from 'd3';
import './components/nuage.js'

// Import our custom CSS
import './style.css'

// const monSvg = d3.create("svg")
//     .attr("width", "100%")
//     .attr("height", 400);

// let width = 300, height = 300
// let nodes = [{}, {}, {}, {}, {}]

// let simulation = forceSimulation(nodes)
//   .force('charge', forceManyBody())
//   .force('center', forceCenter(width / 2, height / 2))
//   .on('tick', ticked);

//   function ticked() {
//   let u = select('svg')
//     .selectAll('circle')
//     .data(nodes)
//     .join(enter => enter.append('circle')
//         .attr('r', 5)
//         .attr('fill', 'blue')
//         .attr('cx', function(d) {
//         return d.x
//         })
//         .attr('cy', function(d) {
//         return d.y
//         })
//     );
// }

// document.querySelector('div').appendChild(monSvg);