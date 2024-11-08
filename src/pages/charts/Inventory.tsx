import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Spinner from "@/components/ui/spinner/Spinner";
import ComponentSpinner from "@/components/ui/spinner/ComponentSpinner";
import ContentWrapper from "@/components/ContentWrapper";
import Percentage from "./graphs/treemap/Percentage";
import CopyPercentage from "./graphs/treemap/copyPercentage";
import TreeMapSquarify from "./graphs/treemap/TreeMapSquarify";
import PrepostMultibar from "./graphs/inventory/PrepostMultibar";
import PostInventory from "./graphs/inventory/PostInventory";
import Sunburst from "./graphs/treemap/Sunburst";
import Img from "@/components/LasyLoading";
import axios from "axios";

const Inventory = () => {
  const user_id = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("user_id="))
    ?.split("=")[1];

  const postInventoryRef = useRef();
  const prePostMultibar = useRef();
  const treemapref1 = useRef();
  const treemapref2 = useRef();
  const percentageref = useRef();
  const copypercentageref = useRef();
  const sunburst = useRef();

  // Async fetch functions
  const fetchData = async (url: string) => {
    const response = await axios.get(url);
    if (response.status !== 200) throw new Error("Network response was not ok");
    return response.data;
  };

  const { data: postSKUdata, isLoading: postSKUIsLoading } = useQuery({
    queryKey: ["postSKUdata"],
    queryFn: () => fetchData(`api/sku_bucket_data_post/${user_id}`),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const { data: preSKUdata, isLoading: preSKUIsLoading } = useQuery({
    queryKey: ["preSKUdata"],
    queryFn: () => fetchData(`api/sku_bucket_data_pre/${user_id}`),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const { data: postData, isLoading: postIsLoading } = useQuery({
    queryKey: ["postData"],
    queryFn: () => fetchData(`api/post_inventory_outputs/${user_id}`),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const { data: shipmentData, isLoading: shipmentIsLoading } = useQuery({
    queryKey: ["shipmentData"],
    queryFn: () => fetchData(`api/shipments_outputs/${user_id}`),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  // CSV Conversion
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((value) => `"${value}"`)
        .join(",")
    );
    return [headers, ...rows].join("\n");
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    zip.file("postSKUdata.csv", convertToCSV(postSKUdata));
    zip.file("preSKUdata.csv", convertToCSV(preSKUdata));
    zip.file("postData.csv", convertToCSV(postData));
    zip.file("shipmentData.csv", convertToCSV(shipmentData));
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "datamingle_charts_data.zip");
  };

  return (
    <ContentWrapper>
      <div className="items-center overflow-hidden w-full mx-auto p-4 select-none">
        <div className="absolute inset-0 h-full w-full bg-[rgb(40,50,86)]/75 -z-10"></div>
        <Img
          src="/background-image.jpg"
          alt="Product Image"
          className="absolute -z-20 inset-0 h-full w-full object-cover"
        />
        <div className="h-[230vh] mt-[12vh] grid grid-cols-2 grid-rows-[1.8fr_2fr_1.5fr_3fr] gap-5">
          {/* Percentage Component */}
          <div className="grid grid-rows-[1fr_7fr]">
            <div className="text-white text-center font-bold text-2xl tracking-wide">
              SKU Count by Previous Inventory Days
            </div>
            <div
              className="border border-white rounded bg-white/10"
              ref={percentageref}
            >
              {!postSKUIsLoading ? (
                <Percentage
                  key={"post"}
                  data={postSKUdata}
                  parentRef={percentageref}
                />
              ) : (
                <ComponentSpinner parentRef={percentageref} />
              )}
            </div>
          </div>

          {/* Copy Percentage Component */}
          <div className="grid grid-rows-[1fr_7fr]">
            <div className="text-white text-center font-bold text-2xl tracking-wide">
              SKU Count by Pre Inventory Days
            </div>
            <div
              className="border border-white rounded bg-white/10"
              ref={copypercentageref}
            >
              {!preSKUIsLoading ? (
                <CopyPercentage
                  key={"pre"}
                  data={preSKUdata}
                  parentRef={copypercentageref}
                />
              ) : (
                <ComponentSpinner parentRef={copypercentageref} />
              )}
            </div>
          </div>

          {/* TreeMap Components */}
          <div className="grid grid-rows-[1fr_7fr]">
            <div className="text-white text-center font-bold text-2xl tracking-wide">
              Previous Inventory Treemap
            </div>
            <div
              ref={treemapref2}
              className="border border-white rounded bg-white/10"
            >
              {!postIsLoading ? (
                <TreeMapSquarify
                  data={postData}
                  parentRef={treemapref2}
                  state="prev"
                />
              ) : (
                <ComponentSpinner parentRef={treemapref2} />
              )}
            </div>
          </div>

          <div className="grid grid-rows-[1fr_7fr]">
            <div className="text-white text-center font-bold text-2xl">
              Post-Transfer Inventory Treemap
            </div>
            <div
              ref={treemapref1}
              className="border border-white rounded bg-white/10"
            >
              {!postIsLoading ? (
                <TreeMapSquarify
                  data={postData}
                  parentRef={treemapref1}
                  state="post"
                />
              ) : (
                <ComponentSpinner parentRef={treemapref1} />
              )}
            </div>
          </div>

          {/* Multibar and Post Inventory Components */}
          <div className="grid grid-rows-[1fr_7fr]">
            <div className="text-white text-center font-bold text-2xl tracking-wide">
              Pre VS Post Inventory Days
            </div>
            <div
              className="border border-white rounded bg-white/10"
              ref={prePostMultibar}
            >
              {!postIsLoading ? (
                <PrepostMultibar data={postData} parentRef={prePostMultibar} />
              ) : (
                <ComponentSpinner parentRef={prePostMultibar} />
              )}
            </div>
          </div>

          <div className="grid grid-rows-[1fr_7fr]">
            <div className="text-white text-center font-bold text-2xl tracking-wide">
              Post Inventory
            </div>
            <div
              ref={postInventoryRef}
              className="border border-white rounded bg-white/10"
            >
              {!postIsLoading ? (
                <PostInventory data={postData} parentRef={postInventoryRef} />
              ) : (
                <ComponentSpinner parentRef={postInventoryRef} />
              )}
            </div>
          </div>

          {/* Sunburst Component */}
          <div
            className="border border-white rounded bg-white/10 col-span-full"
            ref={sunburst}
          >
            {!shipmentIsLoading ? (
              <Sunburst data={shipmentData} parentRef={sunburst} />
            ) : (
              <ComponentSpinner parentRef={sunburst} />
            )}
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={downloadZip}
        className="text-2xl text-white bg-yellow-500 flex items-center justify-center w-full h-full mt-10"
      >
        Download All CSV as ZIP
      </button>

      <Link
        to={"/shipment"}
        className="text-2xl text-white bg-yellow-500 flex items-center justify-center w-full h-full mt-10"
      >
        Previous
      </Link>

      <div className="w-full h-[30vh]"></div>
    </ContentWrapper>
  );
};

export default Inventory;
