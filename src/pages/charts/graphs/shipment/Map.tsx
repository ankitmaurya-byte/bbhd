// @ts-nocheck
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  select,
  geoMercator,
  min,
  max,
  scaleLinear,
  geoPath,
  zoom,
  ZoomBehavior,
  Selection,
  BaseType,
  GeoPermissibleObjects,
  GeoPath,
  GeoProjection,
  line,
  curveCardinal,
} from "d3";
import { FeatureCollection, Feature as GeoFeature, Geometry } from "geojson";
import useResizeObserver from "../../../../hooks/useResizeObserver";
import json from "../../jsons/india_map.json";
import { LocationContext } from "../../Shipment";

// Import map data with proper typing
const mapData = json as FeatureCollection<
  Geometry,
  { name: string; pop_est: number }
>;

interface Dimensions {
  width: number;
  height: number;
}

interface Feature
  extends GeoFeature<Geometry, { name: string; pop_est: number }> {
  id: string;
}

interface TransferPlanTreeProps {
  parentRef: React.RefObject<HTMLDivElement>;
}

function getPathCenter(d) {
  // Regular expression to match x and y coordinates in the path
  const points = Array.from(
    d.matchAll(/[ML]\s*(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/g)
  );

  // Separate and accumulate x and y coordinates
  const { xSum, ySum, count } = points.reduce(
    (acc, point) => {
      acc.xSum += parseFloat(point[1]);
      acc.ySum += parseFloat(point[2]);
      acc.count += 1;
      return acc;
    },
    { xSum: 0, ySum: 0, count: 0 }
  );

  // Calculate average x and y coordinates
  const centerX = xSum / count;
  const centerY = ySum / count;

  return { x: centerX, y: centerY };
}

const createLine = (mapGroup, { from_location, to_location }) => {
  if (!mapGroup) return; // Check for valid inputs

  // Remove previously drawn lines
  mapGroup.selectAll("path.line").remove(); // Assuming you add a class "line" to your new paths

  to_location.forEach((city) => {
    console.log(city);

    const p1 = mapGroup
      .selectAll("path.map")
      .filter((d) =>
        d.properties.name.toLowerCase().includes(from_location.toLowerCase())
      );
    if (p1["_groups"][0].length === 0) return;
    const path1 = p1.attr("d");

    const lineCentre1 = getPathCenter(path1);

    const p2 = mapGroup
      .selectAll("path.map")
      .filter((d) =>
        d.properties.name.toLowerCase().includes(city.toLowerCase())
      );

    console.log(p2["_groups"][0].length);
    if (p2["_groups"][0].length === 0) return;

    const path2 = p2.attr("d");

    const lineCentre2 = getPathCenter(path2);

    const lineGenerator = line()
      .curve(curveCardinal)
      .x((d) => d[0])
      .y((d) => d[1]);

    mapGroup
      .append("path")
      .attr("class", "line") // Add a class to the path for easier removal later
      .attr(
        "d",
        lineGenerator([
          [lineCentre1.x, lineCentre1.y],
          [
            (lineCentre1.x + lineCentre2.x) / 2,
            (lineCentre1.y + lineCentre2.y) / 2 - 50,
          ],
          [lineCentre2.x, lineCentre2.y],
        ])
      )
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round");
  });
};

const Map: React.FC<TransferPlanTreeProps> = ({ parentRef }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const mapGroupRef =
    useRef<Selection<SVGGElement, unknown, null, undefined>>(null);
  const [mapLocation, setMapLocation] = useState<Feature | null>(null);
  const dimensions = useResizeObserver(parentRef) as Dimensions | undefined;
  const { locationData } = useContext(LocationContext);

  useEffect(() => {
    if (!dimensions || !svgRef.current) return;
    console.log(mapData);

    // Calculate min and max population safely
    const minPopulation =
      min(mapData.features, (d) => d.properties.pop_est) ?? 0;
    const maxPopulation =
      max(mapData.features, (d) => d.properties.pop_est) ?? 1;

    // Setup SVG
    const svg: Selection<SVGSVGElement, unknown, null, undefined> = select(
      svgRef.current
    );
    svg.attr("width", dimensions.width).attr("height", dimensions.height);

    // Setup projection with proper typing
    const projection: GeoProjection = geoMercator().fitSize(
      [dimensions.width, dimensions.height],
      mapData
    );

    // Setup path generator with proper typing
    const pathGenerator: GeoPath<any, GeoPermissibleObjects> =
      geoPath().projection(projection);

    // Setup color scale with proper typing
    const colorScale = scaleLinear<string>()
      .domain([minPopulation, maxPopulation])
      .range(["#9a17ca", "#79d714"]);

    // Clear existing elements
    svg.selectAll("*").remove();

    // Create map group with proper typing
    const mapGroup: Selection<SVGGElement, unknown, null, undefined> =
      svg.append("g");
    mapGroupRef.current = mapGroup; // Store the mapGroup

    // Draw map with proper typing for selections and data
    mapGroup
      .selectAll<SVGPathElement, Feature>("path.map")
      .data(mapData.features)
      .join("path")
      .attr("class", "map")
      .attr("d", (feature) => pathGenerator(feature) || "")
      .attr("fill", "none")
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 0.1);

    // Setup zoom behavior with proper typing
    const zoomBehavior: ZoomBehavior<SVGSVGElement, unknown> = zoom<
      SVGSVGElement,
      unknown
    >()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        mapGroup.attr("transform", event.transform.toString());
      });

    svg.call(zoomBehavior);

    // Cleanup function
    return () => {
      svg.on(".zoom", null); // Remove zoom listeners
    };
  }, [dimensions]);

  useEffect(() => {
    console.log(locationData);

    createLine(mapGroupRef.current, locationData);
  }, [locationData, mapGroupRef.current]);

  return (
    <div>
      <svg
        className="rounded-xl cursor-grab active:cursor-grabbing"
        ref={svgRef}
      />
    </div>
  );
};

export default Map;
