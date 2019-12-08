import React, { Component } from 'react'
import './App.css'
import * as d3 from "d3";

const xScale = d3.scaleLinear()
    .domain([2012, 2017])
    .range([50, window.screen.width / 2 - 50])
    .clamp(true);
let h1 = xScale(2011), h2 = xScale(2015);
let tempH1 = xScale(2011), tempH2 = xScale(2015);
let trueYear1 = 2011, trueYear2 = 2015;

class Handle extends React.Component {
    // https://codepen.io/bimalgrg519/details/WEwLgQ
    
    constructor(props) {
        super(props);
        this.state = {
            handle: ''
        }
        
    }
    onMouseOver() {
        this.setState({
            handle: this.props.handle
        });
    }
    render() {
        const { initialValue, xScale, handle } = this.props;
        const circle = <circle r="10px" fill="#fa7070" />
        return <g className={handle} transform={`translate(${xScale(initialValue)},0)`}
            onMouseOver={this.onMouseOver.bind(this)}>{circle}</g>
    }

    componentDidUpdate(prevProps, prevState) {
        let { margins, svgDimensions, xScale, onChangeYear } = prevProps;
        let mouseValue, trueMouseValue, self = this;
        let handle = this.state.handle;
        let minWidth = ((window.screen.width / 2 - margins.left - margins.right) / 5);

        const drag = d3.drag()
            .on("drag", draged).on("end", dragend);

        d3.select(".rangeSliderGroup").call(drag);

        function draged() {
            mouseValue = d3.mouse(this)[0];
            trueMouseValue = getTrueMouseValue(mouseValue);

            handle === "handle1" ? h1 = mouseValue : h2 = mouseValue;

            if ((h2 - h1) > minWidth && mouseValue > margins.left && mouseValue < (svgDimensions.width - margins.right)) {
                d3.select("." + self.state.handle).attr("transform", "translate(" + mouseValue + ",0)");
                if (handle === "handle1") {
                    tempH1 = mouseValue;
                    trueYear1 = trueMouseValue;
                } else {
                    tempH2 = mouseValue
                    trueYear2 = trueMouseValue;
                }
            } else {
                h1 = tempH1;
                h2 = tempH2;
                handle === "handle1" ? trueMouseValue = trueYear1 : trueMouseValue = trueYear2;
            }
            d3.select(".rangeBarFilled").remove();
            d3.select(".rangeSliderGroup")
                .insert("line", ".rangeSliderAxis")
                .attr("x1", h1)
                .attr("x2", h2)
                .attr("y1", 0)
                .attr("y2", 0)
                .attr("class", "rangeBarFilled")

        }
        function dragend() {
            h1 = xScale(getTrueMouseValue(tempH1));
            h2 = xScale(getTrueMouseValue(tempH2));

            d3.select("." + self.state.handle).attr("transform", "translate(" + xScale(trueMouseValue) + ",0)");
            d3.select(".rangeBarFilled").remove();
            d3.select(".rangeSliderGroup")
                .insert("line", ".rangeSliderAxis")
                .attr("x1", xScale(trueYear1))
                .attr("x2", xScale(trueYear2))
                .attr("y1", 0)
                .attr("y2", 0)
                .attr("class", "rangeBarFilled");

            onChangeYear(trueYear1, trueYear2);
        }
        function getTrueMouseValue(mouseValue) {
            return Math.round(xScale.invert(mouseValue));
        }
    }
}
export default Handle