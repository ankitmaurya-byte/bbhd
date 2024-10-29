// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
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
} from "d3";
import { FeatureCollection, Feature as GeoFeature, Geometry } from "geojson";
import useResizeObserver from "../../../../hooks/useResizeObserver";
import json from "../../jsons/india_map.json";
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

const Map: React.FC<TransferPlanTreeProps> = ({ parentRef }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [offset, setOffset] = useState<number>(15);
  const [mapLocation, setMapLocation] = useState<Feature | null>(null);
  const dimensions = useResizeObserver(parentRef) as Dimensions | undefined;

  useEffect(() => {
    if (!dimensions || !svgRef.current) return;

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

    // Draw map with proper typing for selections and data
    mapGroup
      .selectAll<SVGPathElement, Feature>("path.map")
      .data(mapData.features)
      .join("path")
      .attr("class", "map")
      .attr("d", (feature) => pathGenerator(feature) || "")
      .attr("fill", "none")
      .attr("stroke", "#000000")
      .attr("stroke-width", 0.5);

    // Setup zoom behavior with proper typing
    const zoomBehavior: ZoomBehavior<SVGSVGElement, unknown> = zoom<
      SVGSVGElement,
      unknown
    >()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        mapGroup.attr("transform", event.transform.toString());
      });

    // Apply zoom behavior with proper typing
    svg.call(zoomBehavior);

    // Cleanup function
    return () => {
      svg.on(".zoom", null); // Remove zoom listeners
    };
  }, [dimensions]);

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
