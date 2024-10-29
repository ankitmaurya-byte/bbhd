import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useResizeObserver from "@/hooks/useResizeObserver";

const Percentage = ({ parentRef }) => {
  const chartRef = useRef();
  const dimensions = useResizeObserver(parentRef);

  useEffect(() => {
    if (!dimensions) return;
    const { width, height } = dimensions;
    const marginTop = 30,
      marginRight = 20,
      marginBottom = 10,
      marginLeft = 90;

    // Load CSV and format data
    d3.csv("sku_invt_bucket_percent.csv").then((data) => {
      const formattedData = {};

      data.forEach((d) => {
        if (d["Row Labels"] === "Grand Total") return;
        Object.keys(d).forEach((key) => {
          if (key !== "Row Labels") {
            // Convert percentage string to a number without "%" and divide by 100 to get a value between 0 and 100
            // formattedData[key] = {
            //   ...formattedData[key],
            //   [d["Row Labels"]]: parseFloat(d[key].replace("%", "")),
            // };
            formattedData[key] = {
              ...formattedData[key],
              [d["Row Labels"]]: parseFloat(d[key]),
            };
          }
        });
      });

      const ageGroups = Object.keys(
        formattedData[Object.keys(formattedData)[0]]
      );
      const cities = Object.keys(formattedData);

      // Prepare data for stacking
      const series = d3
        .stack()
        .keys(ageGroups)
        .value((d, key) => d[1][key] || 0)(Object.entries(formattedData));

      const x = d3
        .scaleLinear()
        .domain([0, 100]) // Ensure the domain is set to 0 to 100
        .range([marginLeft, width - marginRight]);

      const y = d3
        .scaleBand()
        .domain(cities)
        .range([marginTop, height - marginBottom])
        .padding(0.08);

      const color = d3
        .scaleOrdinal()
        .domain(ageGroups)
        .range(d3.schemeSpectral[ageGroups.length]);

      const svg = d3
        .create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

      svg
        .append("g")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", (d) => color(d.key))
        .selectAll("rect")
        .data((d) => d)
        .join("rect")
        .attr("x", (d) => x(d[0]))
        .attr("y", (d) => y(d.data[0])) // City name
        .attr("height", y.bandwidth())
        .attr("width", (d) => x(d[1]) - x(d[0]))
        .append("title")
        .text((d) => `${d.data[0]} ${d.key}: ${d[1] - d[0]}%`);

      // X-axis
      svg
        .append("g")
        .attr("transform", `translate(0,${marginTop})`)
        .call(
          d3
            .axisTop(x)
            .tickValues([0, 20, 40, 60, 80, 100])
            .tickFormat((d) => `${d}%`)
        )
        .call((g) => {
          g.selectAll(".domain, .tick line").attr("stroke", "white");
          g.selectAll(".tick text")
            .attr("fill", "white")
            .attr("font-size", "14px");
        });

      // Y-axis
      svg
        .append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call((g) => {
          g.selectAll(".domain, .tick line").attr("stroke", "white");
          g.selectAll(".tick text")
            .attr("fill", "white")
            .attr("font-size", "14px");
        });

      // Append to chart container
      chartRef.current.innerHTML = "";
      chartRef.current.appendChild(svg.node());
    });
  }, [dimensions]);

  return <div ref={chartRef}></div>;
};

export default Percentage;
