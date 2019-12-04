import React, { Component } from 'react'
import './App.css'
import * as d3 from "d3";
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
            .call(d3.drag);

        // Let's list the force we wanna apply on the network
        var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
            .force("link", d3.forceLink()
                .distance(function(d){return d.distance/1.5;}) // This force provides links between nodes
                .id(function(d) {return d.id;})
                .links(data.links)                                   // and this the list of links
            )
            .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
            .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
            .on("end", ticked);

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
    }


    render() {
        Network.createNetwork();
        return null
    }
}
export default Network