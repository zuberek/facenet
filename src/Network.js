import React, { Component } from 'react'
import './App.css'
import * as d3 from "d3";

import Handle from './Handle'
import Axis from './Axis'
import DataManager from './DataManager'

// const data = require('./data.json');
const source_path = './source.json';
var selected;
var selectedId;
class Network extends Component {

    constructor(props){
        super(props);
        this.year1 = 2011;
        this.year2 = 2015
    }
    componentDidMount() {
        Network.createNetwork(this.year1, this.year2);
    }
    componentDidUpdate() {
        Network.createNetwork();
    }

  static createNetwork(year1, year2) {
        const clicked = "#225450";
        const notClicked = "#69b3a2";
        const egoColour = "#fa7070";
        const egoId = -1;
      
        // TODO: don't hardcode this
        let temp_ego = {
            "id": -1,
            "name": "chris",
            "relationship": "owner"
        };
        let data = DataManager.generateNodes(source_path, temp_ego, year1, year2);

        // set the dimensions and margins of the graph
        var margin = {top: 50, right: 50, bottom: 50, left: 50},
            width = 800 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
        var svg = d3.select("#visualisation")
            .append("svg")
            .attr("class", "network")
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
            .style("stroke", "#aaa");

        // Initialize the nodes
        var node = svg
            .selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
            .attr("id",function(d){
                return d.id;
            })
            .style("stroke",function(d){
                if(d.id !== egoId){
                    switch(d.relationship){
                        case 0:
                            return "red";
                        case 1:
                            return "blue";
                        case 2:
                            return "green";
                        case 3:
                            return "purple";
                        default:
                            return "transparent";
                    }
                } else {
                    return "transparent";
                }
            })
            .style("fill", function(d){
                if(d.id === egoId){
                    return egoColour
                }
                else if (selectedId === d.id){
                    return clicked
                } else {
                    return notClicked
                }

            })
            .on("dblclick",function(d){
                if(d.id !== egoId){
                    d3.select(selected).style("fill",notClicked);
                    selected = this;
                    selectedId = d.id;
                    d3.select(this).style("fill",clicked);
                }
                alert("Name: " + d.name + "\nRelationship: " + d.relationship);
            })
            .on("click",function(d){
                console.log(d);
                console.log(this);
                if(d.id !== egoId){
                    console.log(selected)
                    d3.select(selected).style("fill",notClicked);
                    selected = this;
                    selectedId = d.id;
                    return d3.select(this).style("fill",clicked);
                } else {
                    return egoColour;
                }
            })
            .attr("r", 10)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));


        var label = node.append("text")
            .attr("dy", ".35em")
            .text(function (d) { return d.name; });

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
            label
                .attr("x", function (d) { return d.x + 8; })
                .attr("y", function (d) { return d.y; });
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

        //https://medium.com/walmartlabs/d3v4-forcesimulation-with-react-8b1d84364721
        // function onChangeYear(trueYear1, trueYear2) {
        //     data = DataManager.generateNodes(source_path, temp_ego, trueYear1, trueYear2);
        //     link = link.data(data.links);
        //     debugger
        //     // remove old links
        //     link.exit().remove()
            
        //     // create new links
        //     link = link.enter().append("line")
        //         .attr("class", "link")
        //         .merge(link);

        //     node = node.data(data.nodes);
        //     node.exit().remove()

        //     node = node.enter().append("circle")
        //         .attr("class", "node")
        //         .attr("r", 10)
        //         .style("fill", "#69b3a2")
        //         .call(d3.drag()
        //             .on("start", dragstarted)
        //             .on("drag", dragged)
        //             .on("end", dragended)
        //         )
        //         .merge(node);

        //     simulation
        //         .nodes(data.nodes)
        //         .on("tick", ticked);

        //     simulation.force("link")
        //         .links(data.links);

        //     simulation.alphaTarget(0.3).restart();
        // }
        function onChangeYear(trueYear1, trueYear2) {
            // delete current network
            d3.select(".network").remove()
            Network.createNetwork(trueYear1, trueYear2)
        }


        const RangeSlider = ({ data, onChangeYear }) => {
            data = {
                initialValue1: 2011,
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
                    <Handle onChangeYear={onChangeYear} handle="handle2" initialValue={data.initialValue2} data={data} xScale={xScale} margins={margins} svgDimensions={svgDimensions} />
                </g>
            </svg>;
        }
        
        return <RangeSlider onChangeYear={onChangeYear} />;
    }


    render() {
        return Network.createNetwork(2012, 2019);
    }
}
export default Network