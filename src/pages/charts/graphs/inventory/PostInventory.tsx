// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import ContentWrapper from "@/components/ContentWrapper";
import Img from "@/components/LasyLoading";
import Spinner from "@/components/ui/spinner/Spinner";
import useResizeObserver from "@/hooks/useResizeObserver";

const PostInventory = ({ parentRef }) => {
  const chartRef = useRef(null);
  const dimensions = useResizeObserver(parentRef) as
    | { width: number; height: number }
    | undefined;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!dimensions) return; // Ensure dimensions are available
    console.log(dimensions.width);
    console.log(dimensions.height);

    d3.csv("post_inventory.csv").then((data) => {
      console.log(data);

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
    });

    const createChart = (data) => {
      const margin = { top: 20, right: 30, bottom: 20, left: 30 };
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
        .select(chartRef.current)
        .append("div")
        .attr(
          "class",
          "tooltip absolute bg-white border border-gray-300 p-2 text-xs opacity-0 pointer-events-none"
        );

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
        .selectAll("text")
        .attr("dy", (d, i) => (i % 2 === 0 ? "12" : "2"))
        .style("text-anchor", "middle")
        .style("font-size", "6px")
        .style("color", "white")
        .style("font-weight", "100");
      svg.selectAll("path, line, text");
      svg
        .selectAll(".tick line")
        .attr("y2", (d, i) => (i % 2 === 0 ? "12" : "2"));
      // Vertical axis
      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call((g) =>
          g
            .append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("Average Days")
        )
        .selectAll("text")
        .style("color", "white")
        .style("font-weight", "100");

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
          color: "green",
        },
        {
          name: "Avg Post Inventory Days",
          key: "post_invt_days",
          color: "red",
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
          .data(
            data.map((d) => ({ category: d.category, value: d[lineData.key] }))
          )
          .join("circle")
          .attr("cx", (d) => x(d.category) + x.bandwidth() / 2)
          .attr("cy", (d) => y(d.value))
          .attr("r", 4)
          .attr("fill", lineData.color)
          .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip
              .html(
                `${lineData.name}<br>Category: ${
                  d.category
                }<br>Value: ${d.value.toFixed(2)}`
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
        const g = legend
          .append("g")
          .attr("transform", `translate(0, ${i * 20})`);

        g.append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", lineData.color);
        g.append("text").attr("x", 15).attr("y", 10).text(lineData.name);
      });
    };
  }, [dimensions]); // Re-run when dimensions change
  return <div ref={chartRef} className="relative py-[5px] px-2"></div>;
};

export default PostInventory;
