// @ts-nocheck
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useResizeObserver from "@/hooks/useResizeObserver";

const Percentage = ({ key, data, parentRef }) => {
  const chartRef = useRef();
  const dimensions = useResizeObserver(parentRef);

  useEffect(() => {
    if (!dimensions) return;
    d3.select(chartRef.current).selectAll("*").remove();
    const { width, height } = dimensions;
    const marginTop = 60,
      marginRight = 20,
      marginBottom = 10,
      marginLeft = 90;

    // Load CSV and format data
    // d3.csv("SKU_percent_by_bucket.csv").then((datacsv) => {
    const formattedData = {};
    data.forEach(
      (d: {
        Location: string;
        bucket_post_invt_days: string;
        bucket_pre_invt_days: string;
        Percent: number;
      }) => {
        if (formattedData[d.Location] === undefined) {
          formattedData[d.Location] = {};
        }
        formattedData[d.Location][d.bucket_post_invt_days] = d.Percent;
      }
    );
    // datacsv.forEach((d) => {
    //   if (d["Row Labels"] === "Grand Total") return;
    //   Object.keys(d).forEach((key) => {
    //     if (key !== "Row Labels") {
    //       formattedData[key] = {
    //         ...formattedData[key],
    //         [d["Row Labels"]]: parseFloat(d[key]),
    //       };
    //     }
    //   });
    // });
    // console.log(datacsv);
    // console.log(formatedData);
    // console.log(formattedData);
    // });
    const ageGroups = Object.keys(
      formattedData[Object.keys(formattedData)[0]]
    ).sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.match(/\d+/)?.[0] || "0");
      return numA - numB;
    });
    const cities = Object.keys(formattedData);

    const series = d3
      .stack()
      .keys(ageGroups)
      .value((d, key) => d[1][key] || 0)(Object.entries(formattedData));

    const x = d3
      .scaleLinear()
      .domain([0, 100])
      .range([marginLeft, width - marginRight]);
    const colorList = [
      "#d53e4f",
      "#fc8d59",
      "#ffff3f",
      "#d4d700",
      "#55a630",
      "#882732",
      "#55181f",
    ];
    const y = d3
      .scaleBand()
      .domain(cities)
      .range([marginTop, height - marginBottom])
      .padding(0.08);
    const color = d3
      .scaleOrdinal()
      .domain(ageGroups)
      .range(colorList.slice(0, ageGroups.length));
    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height - marginBottom)
      .attr("viewBox", [0, 0, width, height - marginBottom]);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "#333")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("pointer-events", "none");

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
      .attr("y", (d) => y(d.data[0]))
      .attr("height", y.bandwidth())
      .attr("width", (d) => x(d[1]) - x(d[0]))
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget)
          .attr("stroke", "black")
          .attr("stroke-width", 1.5);
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`${d.data[0]}: ${d[1] - d[0]}%`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget)
          .attr("stroke", null)
          .attr("stroke-width", null);
        tooltip.transition().duration(500).style("opacity", 0);
      });

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
        g.selectAll(".domain, .tick line").attr("stroke", "black");
        g.selectAll(".tick text")
          .attr("fill", "black")
          .attr("font-size", "14px");
      });

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .call((g) => {
        g.selectAll(".domain, .tick line").attr("stroke", "black");
        g.selectAll(".tick text")
          .attr("fill", "black")
          .attr("font-size", "14px");
      });

    const legend = svg.append("g").attr("transform", `translate(${20}, ${14})`);

    legend
      .selectAll("rect")
      .data(ageGroups)
      .join("rect")
      .attr("x", (d, i) => i * (width / ageGroups.length))
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d) => color(d));

    legend
      .selectAll("text")
      .data(ageGroups)
      .join("text")
      .attr("x", (d, i) => i * (width / ageGroups.length) + 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .attr("fill", "black")
      .attr("font-size", "12px")
      .text((d) => d);

    chartRef.current.innerHTML = "";
    chartRef.current.appendChild(svg.node());
    // })
  }, [dimensions]);

  return <div ref={chartRef} style={{ overflowX: "hidden" }}></div>;
};

export default Percentage;
