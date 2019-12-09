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
        this.init_thresh = 0.5
    }
    componentDidMount() {
        Network.createNetwork(this.year1, this.year2, this.init_thresh);
    }
    componentDidUpdate() {
        Network.createNetwork();
    }

    static setRelationship(node){
        switch(node.relationship){
            case 0:
                return "Colleague";
            case 1:
                return "Acquaintance";
            case 2:
                return "Friend";
            case 3:
                return "Family";
            default:
                return "Unknown";
        }
    }

    static setColour(node){
        switch(node.relationship){
            case 0:
                return "#B98BF4";
            case 1:
                return "#876BD3";
            case 2:
                return "#592E83";
            case 3:
                return "#3C224F";
            default:
                return "transparent";
        }
    }

  static createNetwork(year1, year2, thresh) {
        const clicked = "#DC143C";
        const egoColour = "#fa7070";
        const egoId = -1;
      
        // TODO: don't hardcode this
        let temp_ego = {
            "id": egoId,
            "name": "chris",
            "relationship": "owner"
        };

        let data = DataManager.generateNodes(source_path, temp_ego, year1, year2, thresh);
        console.log(data.nodes);
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
            .style("fill",function(d){
                if(selectedId === d.id){
                    return clicked;
                } else if(d.id !== egoId){
                    return Network.setColour(d);
                } else {
                    return egoColour;
                }
            })
            .on("dblclick",function(d){
                if(d.id !== egoId){
                    d3.select(selected).style("fill",Network.setColour(d));
                    selected = this;
                    selectedId = d.id;
                    d3.select(this).style("fill",clicked);
                }
                var messages = 0;
                for(var i = 0; i < data.links.length; i++)
                {
                    if(data.links[i].target.id === d.id)
                    {
                        messages = data.links[i].message_count;
                    }
                }
                var relationship = Network.setRelationship(d);
                messages = isNaN(Math.floor(messages)) ? 0 : Math.floor(messages);
                alert("Name: " + d.name + "\nRelationship: " + relationship + "\nMessages Sent: " + messages);
            })
            .on("click",function(d){
                console.log(d);
                console.log(this);
                if(d.id !== egoId){
                    console.log("SELECTED: " + selected);
                    console.log("SELECTED ID: " + selectedId);
                    d3.select(selected).style("fill",Network.setColour(d));
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


        // var label = node.append("text")
        //     .attr("dy", ".35em")
        //     .text(function (d) { return d.name; });

        // Let's list the force we wanna apply on the network
        var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
            .force("link", d3.forceLink()
                .distance(function(d){return d.distance/1.5;}) // This force provides links between nodes
                .id(function(d) {return d.id;})
                .links(data.links)                                   // and this the list of links
            )
            .force("charge", d3.forceManyBody().strength(-100))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
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

        function onChangeYear(trueYear1, trueYear2) {
            // delete current network
            d3.select(".network").remove()
            Network.createNetwork(trueYear1, trueYear2, thresh)
            selected = document.getElementById(selectedId);
            year1 = trueYear1;
            year2 = trueYear2;
        }
        function onChangeThreshold(trueYear1, trueYear2) {
            // delete current network
            d3.select(".network").remove()
            Network.createNetwork(year1, year2, trueYear2)
            selected = document.getElementById(selectedId);
            thresh = trueYear2;
        }

        const RangeSlider = ({ info, onChangeYear }) => {
            info = {
                initialValue1: 2011,
                initialValue2: 2015
            };
            const sliderClassNames = {
                "sliderSvg": "rangeSliderSvg",
                "sliderGroup": "rangeSliderGroup",
                "rangeBar": "rangeBar",
                "rangeBarFilled": "rangeBarFilled"
            };
            const axisClassNames = {
                "axis": "rangeSliderAxis"
            };

            const margins = { top: 20, right: 100, bottom: 20, left: 100 },
                svgDimensions = { width: window.screen.width / 2, height: window.screen.height / 6 };

            const xScale = d3.scaleLinear()
                .domain([data.min_year, data.max_year])
                .range([margins.left, svgDimensions.width - margins.right])
                .clamp(true);
            
            const RangeBar = <line x1={margins.left} y1="0" x2={svgDimensions.width - margins.right} y2="0" className="rangeBar" />
            const RangeBarFilled = <line x1={xScale(info.initialValue1)} y1="0" x2={xScale(info.initialValue2)} y2="0" className="rangeBarFilled" />

            return <div>
                <div class="slider_title">Year Slider</div>
                <svg className="rangeSliderSvg" width={svgDimensions.width} height={svgDimensions.height}>
                <g className="rangeSliderGroup" transform={`translate(0,${svgDimensions.height - margins.bottom - 40})`}>
                    {RangeBar}{RangeBarFilled}
                    <Axis margins={margins} svgDimensions={svgDimensions} xScale={xScale} classNames={axisClassNames} />
                    <Handle onChangeYear={onChangeYear} handle="handle2" 
                        initialValue={info.initialValue2} data={info} xScale={xScale} 
                        margins={margins} svgDimensions={svgDimensions} 
                        classNames={sliderClassNames} />
                </g>
                </svg>
            </div>;
        }

        const ThresholdSlider = ({ data, onChangeThreshold }) => {
            data = {
                initialValue1: 0,
                initialValue2: thresh
            }

            const sliderClassNames = {
                "sliderSvg": "thresholdSliderSvg",
                "sliderGroup": "thresholdSliderGroup",
                "rangeBar": "thresholdBar",
                "rangeBarFilled": "thresholdBarFilled"
            };
            const sliderType = "cont";

            const margins = { top: 20, right: 100, bottom: 20, left: 100 },
                svgDimensions = { width: window.screen.width / 2, height: window.screen.height / 6 };
            const xScale = d3.scaleLinear()
                .domain([0, 1])
                .range([margins.left, svgDimensions.width - margins.right])
                .clamp(false);

            const RangeBar = <line x1={margins.left} y1="0" x2={svgDimensions.width - margins.right} y2="0" className={sliderClassNames.rangeBar} />
            const RangeBarFilled = <line x1={xScale(data.initialValue1)} y1="0" x2={xScale(data.initialValue2)} y2="0" className={sliderClassNames.rangeBarFilled}/>

            return <div> 
                <div class="slider_title">Alter Similarity Threshold</div>
                <svg className={sliderClassNames.sliderSvg} width={svgDimensions.width} height={svgDimensions.height}>
                <g className={sliderClassNames.sliderGroup} transform={`translate(0,${svgDimensions.height - margins.bottom - 40})`}>
                    {RangeBar}{RangeBarFilled}
                    <Axis margins={margins} svgDimensions={svgDimensions} xScale={xScale} />
                    <Handle onChangeYear={onChangeThreshold} handle="handle3" 
                    initialValue={data.initialValue2} data={data} xScale={xScale} 
                        margins={margins} svgDimensions={svgDimensions} classNames={sliderClassNames}
                        sliderType={sliderType} />
                </g>
                </svg>
            </div>;
        };
        
        // return <RangeSlider onChangeYear={onChangeYear} />;
        return (
            <div className="test">
                <RangeSlider onChangeYear={onChangeYear} />
                <ThresholdSlider onChangeThreshold={onChangeThreshold} />
            </div>
        );
    }


    render() {
        return Network.createNetwork(2012, 2019, 0.5);
    }
}
export default Network