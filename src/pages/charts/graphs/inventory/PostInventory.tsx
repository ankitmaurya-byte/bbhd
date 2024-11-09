// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import ContentWrapper from "@/components/ContentWrapper";
import Img from "@/components/LasyLoading";
import Spinner from "@/components/ui/spinner/Spinner";
import useResizeObserver from "@/hooks/useResizeObserver";

const PostInventory = ({ data, parentRef }) => {
  const chartRef = useRef(null);
  const dimensions = useResizeObserver(parentRef) as
    | { width: number; height: number }
    | undefined;
  const [isLoading, setIsLoading] = useState(false);

  const createChart = (data) => {
    const margin = { top: 20, right: 30, bottom: 30, left: 70 };
    const width = dimensions.width - 20;
    const height = dimensions.height - 10;

    // Remove existing chart for re-render
    d3.select(chartRef.current).select("svg").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "max-w-full h-auto overflow-visible font-sans text-sm");
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", `tooltip tooltip-prevspost`)
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "14px")
      .style("box-shadow", "0px 4px 10px rgba(0, 0, 0, 0.25)")
      .style("opacity", 0);
    // .append("div");
    // .attr(
    //   "class",
    //   "tooltip absolute bg-black border border-gray-300 p-2 text-xs opacity-0 pointer-events-none transition-opacity duration-200 ease-in-out"
    // );

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, 60])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Horizontal axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .style("color", "black")
      .selectAll("text")
      .attr("dy", "12")
      .attr("transform", "rotate(-15)")
      .style("text-anchor", "middle")
      .style("font-size", "9px")
      .style("color", "black")
      .style("font-weight", "100")
      .style("letter-spacing", "1px");

    // Vertical axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .style("color", "black")
      .call((g) =>
        g
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -height / 2) // Center the text vertically
          .attr("y", -margin.left + 15) // Position the text to the left of the Y-axis
          .attr("dy", "1em") // Adjust vertical alignment
          .style("text-anchor", "middle")
          .style("fill", "black") // Set label color
          .style("font-size", "18px")
          .text("Inventory Days")
      )
      .selectAll("text")
      .style("color", "black");
    // .style("font-weight", "100");

    const line = d3
      .line()
      .x((d) => x(d.category) + x.bandwidth() / 2)
      .y((d) => y(d.value))
      .curve(d3.curveCardinal);

    const lines = [
      {
        name: "Avg Ideal Inventory Days",
        key: "ideal_invt_days",
        color: "steelblue",
      },
      {
        name: "Avg Pre Inventory Days",
        key: "pre_invt_days",
        color: "#358602",
      },
      {
        name: "Avg Post Inventory Days",
        key: "post_invt_days",
        color: "#d4d700",
      },
    ];

    lines.forEach((lineData) => {
      const lineGroup = svg.append("g");

      // Draw line
      lineGroup
        .append("path")
        .datum(
          data.map((d) => ({ category: d.category, value: d[lineData.key] }))
        )
        .attr("fill", "none")
        .attr("stroke", lineData.color)
        .attr("stroke-width", 2)
        .attr("d", line);

      // Draw circles and add tooltip
      lineGroup
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", (d) => x(d.category) + x.bandwidth() / 2)
        .attr("cy", (d) => y(d[lineData.key]))
        .attr("r", 5)
        .attr("fill", lineData.color)
        .style("cursor", "pointer")
        .on("mouseover", (event, d) => {
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip
            .html(
              `<div>
              <div>Category: ${d.category}<br></div>
                ${lines
                  .map((line) => `${line.name}: ${d[line.key].toFixed(2)}`)
                  .join("<br>")}
              </div>`
            )
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", () =>
          tooltip.transition().duration(200).style("opacity", 0)
        );
    });

    // Legend
    const legend = svg
      .append("g")
      .attr(
        "transform",
        `translate(${width - margin.right - 170}, ${margin.top})`
      );

    lines.forEach((lineData, i) => {
      const g = legend.append("g").attr("transform", `translate(0, ${i * 20})`);

      g.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", lineData.color);
      g.append("text").attr("x", 15).attr("y", 10).text(lineData.name);
    });
  };

  useEffect(() => {
    if (!dimensions) return; // Ensure dimensions are available

    data.forEach((d) => {
      d.ideal_invt_days = +d.ideal_invt_days;
      d.pre_invt_days = +d.pre_invt_days;
      d.post_invt_days = +d.post_invt_days;
    });

    // Group data by category and calculate averages
    const groupedData = d3
      .rollups(
        data,
        (v) => {
          return {
            avg_ideal_invt_days: d3.mean(v, (d) => d.ideal_invt_days),
            avg_pre_invt_days: d3.mean(v, (d) => d.pre_invt_days),
            avg_post_invt_days: d3.mean(v, (d) => d.post_invt_days),
          };
        },
        (d) => d.category
      )
      .map(([category, values]) => ({
        category,
        ideal_invt_days: values.avg_ideal_invt_days,
        pre_invt_days: values.avg_pre_invt_days,
        post_invt_days: values.avg_post_invt_days,
      }));

    createChart(groupedData);
  }, [dimensions]);

  return <div ref={chartRef} className="relative py-[5px] px-2"></div>;
};

export default PostInventory;
