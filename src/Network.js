import React, { Component } from 'react'
import './App.css'
import * as d3 from "d3";

import Handle from './Handle'
import Axis from './Axis'

const data = require('./data.json');
class Network extends Component {

    constructor(props){
        super(props);
        //this.createNetwork = this.createNetwork.bind(this);
    }
    componentDidMount() {
        Network.createNetwork();
    }
    componentDidUpdate() {
        Network.createNetwork();
    }
    static createNetwork() {
        var selected = null;

        // set the dimensions and margins of the graph
        var margin = {top: 50, right: 50, bottom: 50, left: 50},
            width = 800 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
        var svg = d3.select("#visualisation")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Initialize the links
        var link = svg
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .style("stroke", "#aaa")

        // Initialize the nodes
        var node = svg
            .selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
            .attr("r", 20)
            .style("fill", "#69b3a2")
            .on("click",function(){
                d3.select(selected).style("fill","#69b3a2");
                selected = this;
                return d3.select(this).style("fill","magenta");
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // Let's list the force we wanna apply on the network
        var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
            .force("link", d3.forceLink()
                .distance(function(d){return d.distance/1.5;}) // This force provides links between nodes
                .id(function(d) {return d.id;})
                .links(data.links)                                   // and this the list of links
            )
            .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
            .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
            .on("tick", ticked);

        // This function is run at each iteration of the force algorithm, updating the nodes position.
        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        const RangeSlider = ({ data, onChangeYear }) => {
            data = {
                initialValue1: 2013,
                initialValue2: 2015
            }
            const margins = { top: 20, right: 100, bottom: 20, left: 100 },
                svgDimensions = { width: window.screen.width / 2, height: window.screen.height / 6 };
            const xScale = d3.scaleLinear()
                .domain([2012, 2017])
                .range([margins.left, svgDimensions.width - margins.right])
                .clamp(true);

            const RangeBar = <line x1={margins.left} y1="0" x2={svgDimensions.width - margins.right} y2="0" className="rangeBar" />
            const RangeBarFilled = <line x1={xScale(data.initialValue1)} y1="0" x2={xScale(data.initialValue2)} y2="0" className="rangeBarFilled" />

            return <svg className="rangeSliderSvg" width={svgDimensions.width} height={svgDimensions.height}>
                <g className="rangeSliderGroup" transform={`translate(0,${svgDimensions.height - margins.bottom - 40})`}>
                    {RangeBar}{RangeBarFilled}
                    <Axis margins={margins} svgDimensions={svgDimensions} xScale={xScale} />
                    <Handle onChangeYear={onChangeYear} handle="handle1" initialValue={data.initialValue1} data={data} xScale={xScale} margins={margins} svgDimensions={svgDimensions} />
                    <Handle onChangeYear={onChangeYear} handle="handle2" initialValue={data.initialValue2} data={data} xScale={xScale} margins={margins} svgDimensions={svgDimensions} />
                </g>
            </svg>;
        }

        return <RangeSlider />;
    }


    render() {
        return Network.createNetwork();
    }
}
export default Network