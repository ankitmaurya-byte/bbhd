// @ts-nocheck
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { maincontainer } from "@/configs/mainContainer";
import { Link, useNavigate } from "react-router-dom";
import { StepperProgressContext } from "@/App";
import Spinner from "@/components/ui/spinner/Spinner";
import { Button } from "@/components/ui/button";
import ContentWrapper from "@/components/ContentWrapper";
import Img from "@/components/LasyLoading";
import DigitBox from "./components/DigitBox";
import Map from "./graphs/shipment/Map";
import { saveAs } from "file-saver";
import TransferPlanTree from "./graphs/shipment/Tree";
import TreeCopy from "./graphs/shipment/TreeCopy";
import { useQuery } from "@tanstack/react-query";
import ComponentSpinner from "@/components/ui/spinner/ComponentSpinner";
import Sunburst from "./graphs/treemap/Sunburst";
import PostInventory from "./graphs/inventory/PostInventory";
import PrepostMultibar from "./graphs/inventory/PrepostMultibar";
import TreeMapSquarify from "./graphs/treemap/TreeMapSquarify";
import CopyPercentage from "./graphs/treemap/copyPercentage";
import Percentage from "./graphs/treemap/Percentage";
import JSZip from "jszip";

interface MainContainerContext {
  current: HTMLDivElement | null;
  pages: React.FC[];
  setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
}

export const LocationContext = createContext({
  locationData: { from_location: "", to_location: [] },
  setLocationData: () => {},
});

const ShipmentChart = () => {
  const { setActiveStep } = useContext(StepperProgressContext) as {
    setActiveStep: (value: React.SetStateAction<number>) => void;
  };
  const navigate = useNavigate();
  const [locationData, setLocationData] = useState({
    from_location: "",
    to_location: [],
  });

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
  const fetchData = async (url: string) => {
    const response = await axios.get(url);
    if (response.status !== 200) throw new Error("Network response was not ok");
    return response.data;
  };
  const fetchTruckData = async (url: string) => {
    console.log("truck data");

    const response = await axios.get(url);
    if (response.status !== 200) throw new Error("Network response was not ok");
    console.log(response.data);
    const truckTypesDistinct = {};
    response.data.forEach((item) => {
      // const truckType = item.truck_type.split("-")[0].trim();
      // const truckMaxnumber = parseInt(
      //   item.truck_type.split("-")[1].trim().slice(-1)
      // );
      if (truckTypesDistinct[item.truck_type] === undefined) {
        truckTypesDistinct[item.truck_type] = 0;
      }
      truckTypesDistinct[item.truck_type] =
        truckTypesDistinct[item.truck_type] + 1;
    });
    console.log(truckTypesDistinct);
    return response.data;
  };

  const { data: postSKUdata, isLoading: postSKUIsLoading } = useQuery({
    queryKey: ["postSKUdata"],
    queryFn: () => fetchData(`api/sku_bucket_data_post/${user_id}`),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const { data: truckAllocation, isLoading: truckAllocationLoading } = useQuery(
    {
      queryKey: ["truckTypesData"],
      queryFn: () => fetchTruckData(`api/truck_allocation_outputs/${user_id}`),
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
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

  const [shipmentOutputs, setShipmentOutputs] = useState();
  const [dataToDownload, setDataToDownload] = useState([]);
  const treeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // const fetchANDformatData = async (url) => {
  //   try {
  //     const response = await axios.get(url);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     return [];
  //   }
  // };

  // const { data, isLoading } = useQuery({
  //   queryKey: ["postSKUdacccta"],
  //   queryFn: () => fetchANDformatData(`api/shipments_outputs/${user_id}`),
  //   staleTime: Infinity,
  //   cacheTime: Infinity,
  // });

  useEffect(() => {
    if (shipmentData && !postIsLoading && !shipmentOutputs) {
      setDataToDownload(shipmentData);
      console.log(shipmentData);

      let totalValue = 0;
      console.log("data running");

      const locationMap = shipmentData.reduce((acc, shipment) => {
        const { from_location, to_location, total_allocated_qty } = shipment;

        if (!acc[from_location]) {
          acc[from_location] = { name: from_location, children: {}, value: 0 };
        }
        const children = acc[from_location].children;
        if (!children[to_location]) {
          children[to_location] = { name: to_location, children: [], value: 0 };
        }

        children[to_location].value += total_allocated_qty;
        totalValue += total_allocated_qty;
        acc[from_location].value += total_allocated_qty;

        return acc;
      }, {});
      console.log(locationMap);
      setLocationData({
        from_location: shipmentData[0].from_location,
        to_location: Object.keys(
          locationMap[shipmentData[0].from_location].children
        ),
      });

      const formattedData = {
        name: "sum of quantity",
        value: totalValue,
        children: Object.values(locationMap)
          .map((location) => ({
            ...location,
            children: Object.values(location.children).sort(
              (a, b) => b.value - a.value
            ),
          }))
          .sort((a, b) => b.value - a.value),
      };
      console.log(formattedData);

      setShipmentOutputs(formattedData);
    }
  }, [shipmentData, postIsLoading, shipmentOutputs]);

  const convertToCSV = (csvData) => {
    if (!csvData.length) return "";
    const headers = Object.keys(csvData[0]).join(",");
    const rows = csvData
      .map((row) =>
        Object.values(row)
          .map((value) => `"${value}"`)
          .join(",")
      )
      .join("\n");
    return [headers, ...rows].join("\n");
  };

  const download = (csvData) => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shipments_data.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // const handleDownload = () => {
  //   const selectedData = dataToDownload.filter(
  //     (e) => e.from_location === locationData.from_location
  //   );
  //   download(convertToCSV(selectedData));
  // };

  // const handleDownloadAll = () => {
  //   download(convertToCSV(dataToDownload));
  // };
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
    <LocationContext.Provider value={{ locationData, setLocationData }}>
      <div className="  items-center overflow-hidden w-full mx-auto">
        <div className="absolute  inset-0 h-full w-full bg-white/55 -z-10"></div>
        <Img
          src="/background-image.jpg"
          alt="Product Image"
          className="absolute -z-20 inset-0 h-full w-full object-cover"
        />
        <div className="h-[450vh] mt-[12vh] overflow-hidden grid grid-rows-[.5fr_.5fr_3.5fr_4fr_2.5fr_3fr_2.5fr_5fr] gap-x-4 grid-cols-2 px-16 gap-5">
          <div className="col-span-full text-black text-start font-bold text-4xl flex justify-start items-center">
            Opti Inventory days
          </div>
          <div className=" col-span-full grid grid-cols-6 justify-between items-center gap-4">
            <DigitBox title="Total Inventory" digit="103K" />
            <DigitBox title="Transferred Inventory" digit="2480" />
            <DigitBox title="#Supply Locations" digit="18" />
            <DigitBox title="#Demand Locations" digit="18" />
            <DigitBox title="Total SKUs" digit="300" />
            <DigitBox title="Total SKU Transferred" digit="243" />
          </div>
          <div className="grid grid-rows-[1fr_7fr]">
            <div className="text-black m-auto font-bold text-2xl">
              Transfer Plan Map view
            </div>
            <div
              ref={mapRef}
              className="border-white bg-white/50 rounded-xl border-2 p-2"
            >
              {shipmentOutputs ? (
                <Map parentRef={mapRef} />
              ) : (
                <ComponentSpinner parentRef={treeRef} />
              )}
            </div>
          </div>
          <div className="border-white rounded-xl border-2 p-4 grid grid-row-[1fr_5fr] bg-white/50">
            <div className="flex justify-start items-start gap-10">
              <div className="text-xl text-black-300 font-extrabold underline  decoration-2">
                Transfer Plan by Qty
              </div>
              <div className="text-base ml-2 font-semibold text-black-300">
                Supply Location
                <hr className="border-[#4c9875] w-full border-t-2" />
              </div>
              <div className="text-base font-semibold ml-3 text-black-300">
                Demand Location
                <hr className="border-[#4c9875] w-full border-t-2" />
              </div>
            </div>
            <div ref={treeRef} className="px-6 ">
              {shipmentOutputs ? (
                <TransferPlanTree
                  parentRef={treeRef}
                  jsonData={shipmentOutputs}
                />
              ) : (
                <ComponentSpinner parentRef={treeRef} />
              )}
            </div>
          </div>
          <div className="border-white col-span-full rounded-xl border-2 p-4  bg-white/50 grid grid-cols-2 grid-rows-2">
            <div className="bg-pink-200 row-span-full grid grid-rows-2">
              <div className="grid grid-cols-2">
                {" "}
                <div className="bg-blue-300"></div>
                <div className="bg-purple-400"></div>
              </div>

              <div></div>
            </div>

            <div className="bg-blue-500">div2</div>
            <div className="bg-red-500">div3</div>
          </div>
          {/* <div className="border-white rounded-xl border-2 p-4  bg-white/50"></div> */}
          {/* Copy Percentage Component */}
          <div className="grid grid-rows-[1fr_7fr]">
            <div className="text-black text-center font-bold text-2xl tracking-wide">
              SKU Count by Pre Inventory Days
            </div>
            <div
              className="border border-white rounded bg-white/50"
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
          <div className="grid grid-rows-[1fr_7fr]">
            <div className="text-black text-center font-bold text-2xl tracking-wide">
              SKU Count by Post Inventory Days
            </div>
            <div
              className="border border-white rounded bg-white/50"
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

          {/* TreeMap Components */}
          <div className="grid grid-rows-[1fr_7fr]">
            <div className="text-black text-center font-bold text-2xl tracking-wide">
              Previous Inventory Treemap
            </div>
            <div
              ref={treemapref2}
              className="border border-white rounded bg-white/50"
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
            <div className="text-black text-center font-bold text-2xl">
              Post-Transfer Inventory Treemap
            </div>
            <div
              ref={treemapref1}
              className="border border-white rounded bg-white/50"
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
            <div className="text-black text-center font-bold text-2xl tracking-wide">
              Pre VS Post Inventory Days
            </div>
            <div
              className="border border-white rounded bg-white/50"
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
            <div className="text-black text-center font-bold text-2xl tracking-wide">
              Post Inventory
            </div>
            <div
              ref={postInventoryRef}
              className="border border-white rounded bg-white/50"
            >
              {!postIsLoading ? (
                <PostInventory data={postData} parentRef={postInventoryRef} />
              ) : (
                <ComponentSpinner parentRef={postInventoryRef} />
              )}
            </div>
          </div>
          {/* Sunburst Component */}
          <div className="grid grid-rows-[1fr_7fr] col-span-full">
            <div className="text-black text-center font-bold text-2xl tracking-wide flex justify-center items-center">
              Sun Burst
            </div>{" "}
            <div
              className="border border-white rounded bg-white/50 "
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
      </div>
      <div className="flex flex-row justify-between mt-8">
        <button
          onClick={downloadZip}
          className="bg-yellow-400 text-gray-800 hover:bg-yellow-500 font-bold py-4 w-60 m-auto rounded"
        >
          Download charts data
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-yellow-400 text-gray-800 hover:bg-yellow-500 font-bold py-4 w-60 m-auto rounded"
        >
          back to model configuration
        </button>
      </div>
      <div className="w-full h-[30vh]"></div>
    </LocationContext.Provider>
  );
};

export default ShipmentChart;
