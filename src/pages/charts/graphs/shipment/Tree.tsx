// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import {
  select,
  hierarchy,
  tree,
  linkHorizontal,
  HierarchyNode,
  max,
  scaleLinear,
  HierarchyPointLink,
  HierarchyPointNode,
  scaleBand,
  Selection,
  BaseType,
} from "d3";
import jsonData from "../../jsons/tree.json";
import useResizeObserver from "../../../../hooks/useResizeObserver";

interface Dimensions {
  width: number;
  height: number;
}

interface TreeNode {
  name: string;
  value: number;
  children?: TreeNode[];
}

interface TransferPlanTreeProps {
  parentRef: React.RefObject<HTMLElement>;
}

type D3Selection = Selection<BaseType, unknown, HTMLElement, any>;

const TransferPlanTree: React.FC<TransferPlanTreeProps> = ({ parentRef }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dimensions = useResizeObserver(parentRef) as Dimensions | undefined;
  const [previousClicked, setPreviousClicked] = useState("");
  const [rectWidth, setRectWidth] = useState(100);
  const [json, setJson] = useState(jsonData);
  const [jsonCopy, setJsonCopy] = useState(
    JSON.parse(JSON.stringify(jsonData))
  );
  useEffect(() => {
    if (!dimensions || !svgRef.current) return;

    const { width, height } = dimensions;
    const svg = select(svgRef.current);
    svg
      .attr("width", width)
      .attr("height", height)
      .style("user-select", "none");

    const root = hierarchy<TreeNode>(json);
    const treeLayout = tree<TreeNode>().size([height, width - 180]);
    const descendantsNodes = root.descendants();
    // const descendantsDepth1 = descendantsNodes.filter((d) => d.depth === 1);
    // const descendantsDepth2 = descendantsNodes.filter((d) => d.depth === 2);
    // const maxValue1 = max(descendantsDepth1, (d) => d.data.value || 1) || 0;
    // const maxValue2 = max(descendantsDepth2, (d) => d.data.value || 1) || 0;
    // const qualityScale1 = scaleLinear()
    //   .domain([0, maxValue1])
    //   .range([0, rectWidth]);
    // const qualityScale2 = scaleLinear()
    //   .domain([0, maxValue2])
    //   .range([0, rectWidth]);

    // Group nodes by depth
    const nodesByDepth = new Map<number, HierarchyNode<TreeNode>[]>();
    descendantsNodes.forEach((node) => {
      if (!nodesByDepth.has(node.depth)) {
        nodesByDepth.set(node.depth, []);
      }
      nodesByDepth.get(node.depth)?.push(node);
    });

    // Create scale bands for each depth
    const depthScales = new Map<number, ReturnType<typeof scaleBand>>();
    nodesByDepth.forEach((nodes, depth) => {
      const padding = 0.2;
      const scale = scaleBand()
        .domain(nodes.map((n) => n.data.name))
        .range([0, height])
        .padding(padding);
      depthScales.set(depth, scale);
    });
    const maxValueOfEachDepth = new Map<number, number>();
    nodesByDepth.forEach((nodes, depth) => {
      maxValueOfEachDepth.set(
        depth,
        max(nodesByDepth.get(depth), (d) => d.data.value || 1) || 0
      );
    });
    const qualityScale = new Map<number, ReturnType<typeof scaleLinear>>();
    maxValueOfEachDepth.forEach((max, depth) => {
      qualityScale.set(
        depth,
        scaleLinear().domain([0, max]).range([0, rectWidth])
      );
    });
    // Modified link path generator with correct types
    const generateLinkPath = linkHorizontal<TreeNode>()
      .source((d: HierarchyPointLink<TreeNode>) => {
        console.log(d);
        console.log(rectWidth);
        console.log(d.target.depth);

        return [
          d.source.y + rectWidth,
          (depthScales.get(d.source.depth)?.(d.source.data.name) ?? 0) +
            (depthScales.get(d.source.depth)?.bandwidth() ?? 0) / 2,
        ];
      })
      .target((d: HierarchyPointLink<TreeNode>) => {
        d.target.y = d.target.depth * 150;
        return [
          d.target.y,
          (depthScales.get(d.target.depth)?.(d.target.data.name) ?? 0) +
            (depthScales.get(d.target.depth)?.bandwidth() ?? 0) / 2,
        ];
      });

    // Draw links with proper typing
    svg
      .selectAll<SVGPathElement, HierarchyPointLink<TreeNode>>(".link")
      .data(treeLayout(root).links())
      .join("path")
      .attr("class", "link")
      .attr("d", (d) => generateLinkPath(d) || "")
      .attr("fill", "none")
      .attr("stroke", "white");
    // .attr("stroke-dasharray", function (this: SVGPathElement) {
    //   const length = this.getTotalLength();
    //   return `${length} ${length}`;
    // })
    // .attr("stroke-dashoffset", function (this: SVGPathElement) {
    //   return this.getTotalLength();
    // })
    // .transition()
    // .attr("stroke-dashoffset", 0);

    // Draw rectangles with proper typing
    const rectsBg = svg
      .selectAll<SVGRectElement, HierarchyNode<TreeNode>>("rect.bg")
      .data(root.descendants())
      .join("rect")
      .attr("class", "bg")
      .attr("x", (d) => d.y)
      .attr("y", (d) => {
        const scale = depthScales.get(d.depth);
        return (scale?.(d.data.name) ?? 0) + (scale?.bandwidth() ?? 0) / 2 - 6;
      })
      .attr("width", rectWidth)
      .attr("height", 12)
      .attr("fill", "#eeeded")
      .attr("rx", 1)
      .attr("ry", 1)
      .style("cursor", "pointer");

    const rectsValue = svg
      .selectAll<SVGRectElement, HierarchyNode<TreeNode>>("rect.value")
      .data(root.descendants())
      .join("rect")
      .attr("class", "value")
      .attr("x", (d) => d.y)
      .attr("y", (d) => {
        const scale = depthScales.get(d.depth);
        return (scale?.(d.data.name) ?? 0) + (scale?.bandwidth() ?? 0) / 2 - 6;
      })
      .attr("width", (d) => {
        const scale = qualityScale.get(d.depth);
        return scale?.(d.data.value);
      })
      .attr("height", 12)
      .attr("fill", "#4c9875")
      .style("cursor", "pointer");

    // Modified hover handlers with proper typing
    const hoverHandler = (
      event: MouseEvent,
      d: HierarchyNode<TreeNode>
    ): void => {
      const hoverScale = scaleLinear()
        .domain([0, maxValue])
        .range([0, rectWidth + 5]);

      const scale = depthScales.get(d.depth);
      const yPos = scale?.(d.data.name) ?? 0;

      svg
        .selectAll<SVGRectElement, HierarchyNode<TreeNode>>("rect.bg")
        .filter((node) => node === d)
        .transition()
        .attr("width", rectWidth + 5)
        .attr("height", 14)
        .attr("y", yPos - 1)
        .attr("x", (h) => h.y - 2.5);

      svg
        .selectAll<SVGRectElement, HierarchyNode<TreeNode>>("rect.value")
        .filter((node) => node === d)
        .transition()
        .attr("width", (node) => hoverScale(node.data.value))
        .attr("height", 14)
        .attr("y", yPos - 1)
        .attr("x", (h) => h.y - 2.5);
    };

    const mouseOutHandler = (
      event: MouseEvent,
      d: HierarchyNode<TreeNode>
    ): void => {
      const scale = depthScales.get(d.depth);
      const yPos = scale?.(d.data.name) ?? 0;

      svg
        .selectAll<SVGRectElement, HierarchyNode<TreeNode>>("rect.bg")
        .filter((node) => node === d)
        .transition()
        .attr("width", rectWidth)
        .attr("height", 12)
        .attr("x", (h) => h.y)
        .attr("y", yPos);

      svg
        .selectAll<SVGRectElement, HierarchyNode<TreeNode>>("rect.value")
        .filter((node) => node === d)
        .transition()
        .attr("width", (node) => qualityScale(node.data.value))
        .attr("height", 12)
        .attr("x", (h) => h.y)
        .attr("y", yPos);
    };
    const clickHandler = (
      event: MouseEvent,
      d: HierarchyNode<TreeNode>
    ): void => {
      const updatedChildren = json.children.map((child, index) => {
        // if (child.name === previousClicked) {
        //   child.children = [];
        // }
        if (child.name === d.data.name) {
          if (child.children.length === 0) {
            setPreviousClicked(child.name);
            child.children = jsonCopy.children[index].children;
          } else {
            child.children = [];
          }
        }
        return child;
      });
      console.log(updatedChildren);
      setJson({ ...json, children: updatedChildren });
      // if (d.data.children) {
      //   d._children = d.data.children;
      //   d.data.children = null;
      // } else {
      //   d.data.children = d._children;
      //   d._children = null;
      // }
    };
    // Optional: Uncomment to enable hover effects
    // rectsBg.on("mouseover", hoverHandler).on("mouseout", mouseOutHandler);
    // rectsValue.on("mouseover", hoverHandler).on("mouseout", mouseOutHandler);
    rectsBg.on("click", clickHandler); // Update text positions with proper typing
    svg
      .selectAll<SVGTextElement, HierarchyNode<TreeNode>>("text")
      .data(root.descendants())
      .join("text")
      .attr("x", (d) => d.y)
      .attr("y", (d) => {
        const scale = depthScales.get(d.depth);
        return (scale?.(d.data.name) ?? 0) + (scale?.bandwidth() ?? 0) / 2;
      })
      .attr("fill", "white")
      .text((d) => d.data.name)
      .attr("dy", "1.5em");
  }, [dimensions, json, rectWidth]);

  return (
    <div>
      <svg className="rounded-xl" ref={svgRef}></svg>
    </div>
  );
};

export default TransferPlanTree;
