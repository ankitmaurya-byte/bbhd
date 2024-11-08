// @ts-nocheck
import React, { useEffect } from "react";
import * as d3 from "d3";
import useResizeObserver from "@/hooks/useResizeObserver";

const TreeMapSquarify = ({ data, parentRef, state }) => {
  const dimensions = useResizeObserver(parentRef);

  useEffect(() => {
    if (!dimensions) return;

    const { width, height } = dimensions;

    // Remove existing tooltip for the specific state (for rerenders)
    d3.selectAll(`.tooltip-${state}`).remove();

    // Create a unique tooltip element based on the state
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", `tooltip tooltip-${state}`)
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "14px")
      .style("box-shadow", "0px 4px 10px rgba(0, 0, 0, 0.25)")
      .style("opacity", 0);

    // Fetch and process CSV data
    // d3.csv("post.csv").then((data) => {

    let groupedData = [];
    if (state === "prev") {
      groupedData = d3
        .rollups(
          data,
          (v) => d3.sum(v, (d) => +d.prev_inventory),
          (d) => d.dc_name
        )
        .map(([name, value]) => ({ name, value }));
    } else {
      groupedData = d3
        .rollups(
          data,
          (v) => d3.sum(v, (d) => +d.post_transfer_inventory),
          (d) => d.dc_name
        )
        .map(([name, value]) => ({ name, value }));
    }

    const rootData = { name: "root", children: groupedData };
    const root = d3
      .treemap()
      .tile(d3.treemapSquarify)
      .size([width, height])
      .padding(1)
      .round(true)(
      d3
        .hierarchy(rootData)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value)
    );

    const color = d3
      .scaleLinear()
      .domain([0, d3.max(root.leaves(), (d) => d.data.value)])
      .range(["red", "yellow"]);

    const svg = d3
      .select("#" + state)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height);

    const leaf = svg
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    leaf
      .append("rect")
      .attr("fill", (d) => color(d.data.value))
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(`<strong>${d.data.name}</strong><br>Qty: ${d.data.value}`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    leaf
      .append("clipPath")
      .attr("id", (d, i) => `clip${state}-${i}`)
      .append("rect")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0);

    leaf
      .append("text")
      .attr("clip-path", (d, i) => `url(#clip${state}-${i})`)
      .selectAll("tspan")
      .data((d) =>
        d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat("Qty: " + d.data.value)
      )
      .join("tspan")
      .attr("x", 3)
      .attr(
        "y",
        (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
      )
      .attr("fill-opacity", (d, i, nodes) =>
        i === nodes.length - 1 ? 0.7 : null
      )
      .text((d) => d);
    // });
  }, [dimensions, state]);

  return <svg id={state} style={{ display: "block", margin: "auto" }}></svg>;
};

export default TreeMapSquarify;
