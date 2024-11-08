// @ts-nocheck
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useResizeObserver from "@/hooks/useResizeObserver";

const Sunburst = ({ data, parentRef }) => {
  const dimensions = useResizeObserver(parentRef);
  const chartRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    if (!dimensions) return;

    let { width, height } = dimensions;
    width = width / 2;
    height = height - 20;
    const radius = Math.min(width, height) / 2;
    const createSunburst = async () => {
      // const response = await fetch("shipment_outputs.csv");
      // const csvText = await response.text();
      // const data = d3.csvParse(csvText);
      const locationMap = {};

      data.forEach((row) => {
        if (!locationMap[row.from_location]) {
          locationMap[row.from_location] = {};
        }
        if (!locationMap[row.from_location][row.to_location]) {
          locationMap[row.from_location][row.to_location] = {
            total_allocated_qty: 0,
          };
        }
        locationMap[row.from_location][row.to_location].total_allocated_qty +=
          row.total_allocated_qty;
      });

      const graphData = {
        name: "Locations",
        children: Object.keys(locationMap).map((fromLocation) => ({
          name: fromLocation,

          children: Object.keys(locationMap[fromLocation]).map((row) => ({
            name: row,
            value: +locationMap[fromLocation][row].total_allocated_qty,
          })),
          value: Object.keys(locationMap[fromLocation]).reduce((sum, e) => {
            // sum + e.total_allocated_qty
            return sum + locationMap[fromLocation][e].total_allocated_qty;
          }),
        })),
      };

      const partition = (data) => {
        const root = d3
          .hierarchy(data)
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value);
        return d3.partition().size([2 * Math.PI, radius])(root);
      };

      const root = partition(graphData);

      const arc = d3
        .arc()
        .startAngle((d) => d.x0)
        .endAngle((d) => d.x1)
        .innerRadius((d) => d.y0)
        .outerRadius((d) => d.y1);

      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)

        .attr("viewBox", [-radius, -radius, width, height]);

      const tooltip = d3.select(tooltipRef.current);

      svg
        .append("g")
        .attr("class", "sunburst")
        .selectAll("path")
        .data(root.descendants().filter((d) => d.depth))
        .join("path")
        .attr("d", arc)
        .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
        .on("mouseover", (event, d) => {
          tooltip
            .style("opacity", 1)
            .html(
              `<div>
                <strong>Name:</strong> ${d.data.name}<br>
                <strong>Qty:</strong> ${d.value}
              </div>`
            )
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px");
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px");
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });

      // Add labels (optional)
      svg
        .append("g")
        .attr("class", "labels")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(
          root
            .descendants()
            .filter((d) => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
        )
        .join("text")
        .attr("transform", (d) => {
          const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
          const y = (d.y0 + d.y1) / 2;
          return `
            rotate(${x - 90})
            translate(${y},0)
            rotate(${x < 180 ? 0 : 180})
          `;
        })
        .attr("dy", "0.35em")
        .text((d) => d.data.name);
    };

    // Clear the SVG before redrawing on resize
    d3.select(chartRef.current).selectAll("*").remove();
    createSunburst();
  }, [dimensions]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <div ref={chartRef}></div>
      <div
        ref={tooltipRef}
        id="tooltip"
        style={{
          position: "absolute",
          padding: "8px",
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          borderRadius: "4px",
          fontSize: "12px",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.3s",
        }}
      ></div>
    </div>
  );
};

export default Sunburst;
