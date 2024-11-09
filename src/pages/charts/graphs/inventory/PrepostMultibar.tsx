// @ts-nocheck
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "@/hooks/useResizeObserver";

const PrepostMultibar = ({ data, parentRef }) => {
  const svgRef = useRef();
  const dimensions = useResizeObserver(parentRef);
  const [formattedData, setFormattedData] = useState([]);

  useEffect(() => {
    // Aggregate and format data for grouped bar chart
    // d3.csv("post.csv").then((data) => {

    const inventoryData = d3.rollups(
      data,
      (v) => {
        const pre_invt_days_avg = d3.mean(v, (d) => +d.pre_invt_days);
        const post_invt_days_avg = d3.mean(v, (d) => +d.post_invt_days);
        return {
          prev_inventory: pre_invt_days_avg,
          post_inventory: post_invt_days_avg,
        };
      },
      (d) => d.dc_name
    );

    setFormattedData(
      inventoryData.map(([dc_name, inventory]) => ({
        dc_name,
        prev_inventory: inventory.prev_inventory,
        post_inventory: inventory.post_inventory,
      }))
    );
    // });
  }, []);

  useEffect(() => {
    if (!dimensions) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous renders

    const x0 = d3
      .scaleBand()
      .domain(formattedData.map((d) => d.dc_name))
      .range([0, width])
      .padding(0.1);

    const x1 = d3
      .scaleBand()
      .domain(["prev_inventory", "post_inventory"])
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(formattedData, (d) =>
          Math.max(d.prev_inventory, d.post_inventory)
        ),
      ])
      .range([height, 0]);

    const color = d3
      .scaleOrdinal()
      .domain(["prev_inventory", "post_inventory"])
      .range(["#358602", "#d4d700"]);

    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Y-axis label
    chartGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2) // Center the text vertically
      .attr("y", -margin.left + 15) // Position the text to the left of the Y-axis
      .attr("dy", "1em") // Adjust vertical alignment
      .style("text-anchor", "middle")
      .style("fill", "black") // Set label color
      .style("font-size", "18px")
      .text("Inventory Days");
    // X-axis
    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x0))
      .style("color", "black")
      .selectAll("text")
      .attr("dy", (d, i) => (i % 2 === 0 ? "15" : "4"))
      .style("text-anchor", "middle")
      .style("color", "black")
      .style("font-size", "12px");
    chartGroup
      .selectAll(".tick line")
      .attr("y2", (d, i) => (i % 2 === 0 ? "15" : "4"));
    // Y-axis
    // chartGroup.append("g").call(d3.axisLeft(y)).style("color", "black");

    // Bars
    chartGroup
      .selectAll("g.bar-group")
      .data(formattedData)
      .join("g")
      .attr("transform", (d) => `translate(${x0(d.dc_name)}, 0)`)
      .selectAll("rect")
      .data((d) => [
        { key: "prev_inventory", value: d.prev_inventory },
        { key: "post_inventory", value: d.post_inventory },
      ])
      .join("rect")
      .attr("x", (d) => x1(d.key))
      .attr("y", (d) => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => color(d.key));
    chartGroup
      .selectAll("g.bar-group")
      .data(formattedData)
      .join("g")
      .attr("transform", (d) => `translate(${x0(d.dc_name)}, 0)`)
      .selectAll("text")
      .data((d) => [
        { key: "prev_inventory", value: d.prev_inventory },
        { key: "post_inventory", value: d.post_inventory },
      ])
      .join("text")
      .attr("x", (d) => x1(d.key) + x1.bandwidth() / 2) // Center text in bar
      .attr("y", (d) => y(d.value) - 5) // Position text above bar
      .attr("text-anchor", "middle")
      .style("fill", "black") // Set label color
      .style("font-size", "10px")
      .text((d) => d.value.toFixed(1)); // Format the value
  }, [formattedData, dimensions]);

  return <svg ref={svgRef} width="100%" height="100%" />;
};

export default PrepostMultibar;
