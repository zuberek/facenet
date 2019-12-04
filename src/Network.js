import React, { Component } from 'react'
import './App.css'
import * as d3 from "d3";
class Network extends Component {
    constructor(props){
        super(props);
        //this.createNetwork = this.createNetwork.bind(this);
    }
    componentDidMount() {
        this.createNetwork();
    }
    componentDidUpdate() {
        this.createNetwork();
    }
    createNetwork() {
        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 50, bottom: 30, left: 50},
            width = 800 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
        var svg = d3.select("#visualisation")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const data = {"nodes":[{"id":1,"name":"A"},{"id":2,"name":"B"},{"id":3,"name":"C"},{"id":4,"name":"D"},{"id":5,"name":"E"},{"id":6,"name":"F"},{"id":7,"name":"G"},{"id":8,"name":"H"},{"id":9,"name":"I"},{"id":10,"name":"J"}],"links":[{"source":1,"target":2},{"source":1,"target":5},{"source":1,"target":6},{"source":2,"target":3},{"source":2,"target":7},{"source":3,"target":4},{"source":8,"target":3},{"source":4,"target":5},{"source":4,"target":9},{"source":5,"target":10}]}

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
            .attr("r", 20)
            .style("fill", "#69b3a2");
    }
    render() {
        this.createNetwork();
        return null
    }
}
export default Network