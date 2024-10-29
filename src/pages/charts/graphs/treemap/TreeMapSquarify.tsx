// @ts-nocheck
import React, { useEffect } from "react";
import * as d3 from "d3";
import useResizeObserver from "@/hooks/useResizeObserver";

const TreeMapSquarify = ({ parentRef }) => {
  const dimensions = useResizeObserver(parentRef);

  useEffect(() => {
    if (!dimensions) return;

    const { width, height } = dimensions;

    // Define color scale
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    // Load CSV data and create the treemap
    d3.csv("post.csv").then((data) => {
      // Group data by dc_name and sum prev_inventory for each group
      const groupedData = d3
        .rollups(
          data,
          (v) => d3.sum(v, (d) => +d.post_transfer_inventory),
          (d) => d.dc_name
        )
        .map(([name, value]) => ({ name, value }));

      // Convert grouped data into a hierarchy-compatible format
      const rootData = {
        name: "root",
        children: groupedData,
      };

      // Compute the treemap layout
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

      // Select the SVG container
      const svg = d3
        .select("#chart")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height);

      // Append a cell for each leaf
      const leaf = svg
        .selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

      // Append tooltip
      const format = d3.format(",d");
      leaf.append("title").text(
        (d) =>
          `${d
            .ancestors()
            .reverse()
            .map((d) => d.data.name)
            .join(".")}\n${format(d.value)}`
      );

      // Append color rectangles
      leaf
        .append("rect")
        .attr("fill", (d) => {
          while (d.depth > 1) d = d.parent;
          return color(d.data.name);
        })
        .attr("fill-opacity", 0.6)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0);

      // Append clipPath for text clipping
      leaf
        .append("clipPath")
        .attr("id", (d, i) => `clip${i}`)
        .append("rect")
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0);

      // Append multiline text
      leaf
        .append("text")
        .attr("clip-path", (d, i) => `url(#clip${i})`)
        .selectAll("tspan")
        .data((d) =>
          d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value))
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
    });
  }, [dimensions]);

  return <svg id="chart" className="chart"></svg>;
};

export default TreeMapSquarify;
