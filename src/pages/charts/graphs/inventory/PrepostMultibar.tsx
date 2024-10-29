// MultiGroupedBarChart.js
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "@/hooks/useResizeObserver";

const PrepostMultibar = ({ parentRef }) => {
  const svgRef = useRef();
  const dimensions = useResizeObserver(parentRef);
  const [formattedData, setFormattedData] = useState([]);

  useEffect(() => {
    // Aggregate and format data for grouped bar chart
    d3.csv("post.csv").then((data) => {
      console.log(data);

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
    });
  }, []);

  useEffect(() => {
    if (!dimensions) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 30 };
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
      .range(["#1f77b4", "#ff7f0e"]);

    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // X-axis
    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .attr("dy", (d, i) => (i % 2 === 0 ? "15" : "4"))
      .style("text-anchor", "middle")
      .style("font-size", "12px");
    chartGroup
      .selectAll(".tick line")
      .attr("y2", (d, i) => (i % 2 === 0 ? "15" : "4"));
    // Y-axis
    chartGroup.append("g").call(d3.axisLeft(y));

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
  }, [formattedData, dimensions]);

  return (
    <svg ref={svgRef} width={dimensions?.width} height={dimensions?.height} />
  );
};

export default PrepostMultibar;