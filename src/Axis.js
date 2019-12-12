import React, { Component } from 'react'
import './App.css'
import * as d3 from "d3";

class Axis extends Component {
    // taken from: https://codepen.io/bimalgrg519/details/WEwLgQ
    
    componentDidMount() {
        this.renderAxis();
    }
    renderAxis() {
        const { svgDimensions, margins, classNames } = this.props;
        // const xValue = (svgDimensions.width - margins.left - margins.right) / 10;
        d3.select(this.axisElement)
            .call(d3.axisBottom()
                .scale(this.props.xScale)
                .ticks(6)
                .tickFormat(d3.format(""))
            )
            .selectAll("text")
            .style("font-size", "10px")
            .style("fill", "black");

        d3.select(this.axisElement).selectAll("line").attr("stroke", "black");
        d3.select(this.axisElement).select("path").style("d", "none");
    }
    render() {
        return (
            <g className="rangeSliderAxis" transform="translate(0,10)" ref={el => this.axisElement = el} />
        )
    }
}
export default Axis