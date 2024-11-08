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
import TransferPlanTree from "./graphs/shipment/Tree";
import TreeCopy from "./graphs/shipment/TreeCopy";
import { useQuery } from "@tanstack/react-query";

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
  const [locationData, setLocationData] = useState({
    from_location: "",
    to_location: [],
  });

  const user_id = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("user_id="))
    ?.split("=")[1];

  const [shipmentOutputs, setShipmentOutputs] = useState();
  const [dataToDownload, setDataToDownload] = useState([]);
  const treeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const fetchANDformatData = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["postSKUdacccta"],
    queryFn: () => fetchANDformatData(`api/shipments_outputs/${user_id}`),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  useEffect(() => {
    if (data && !isLoading && !shipmentOutputs) {
      setDataToDownload(data);
      let totalValue = 0;

      const locationMap = data.reduce((acc, shipment) => {
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
        from_location: data[0].from_location,
        to_location: Object.keys(locationMap[data[0].from_location].children),
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
  }, [data, isLoading, shipmentOutputs]);

  const convertToCSV = (data) => {
    if (!data.length) return "";
    const headers = Object.keys(data[0]).join(",");
    const rows = data
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

  const handleDownload = () => {
    const selectedData = dataToDownload.filter(
      (e) => e.from_location === locationData.from_location
    );
    download(convertToCSV(selectedData));
  };

  const handleDownloadAll = () => {
    download(convertToCSV(dataToDownload));
  };

  return (
    <LocationContext.Provider value={{ locationData, setLocationData }}>
      <div className="h-screen items-center overflow-hidden w-full mx-auto">
        <div className="absolute inset-0 h-full w-full bg-[rgb(40,50,86)]/75 -z-10"></div>
        <Img
          src="/background-image.jpg"
          alt="Product Image"
          className="absolute -z-20 inset-0 h-full w-full object-cover"
        />
        <Spinner isLoading={isLoading} />
        <div className="h-[88vh] mt-[12vh] overflow-hidden grid grid-rows-[1fr_4fr] gap-x-4 grid-cols-[1fr_4fr_4fr]">
          <div className="border-white row-span-full rounded-xl border-2 p-2 flex flex-col items-center justify-start">
            <button
              onClick={handleDownload}
              className="text-xl text-black bg-yellow-500 flex items-center justify-center w-full rounded-lg p-4 hover:bg-yellow-600 transition-colors"
            >
              Download Selected as CSV
            </button>
            <button
              onClick={handleDownloadAll}
              className="text-xl text-black bg-yellow-500 flex items-center justify-center w-full mt-10 rounded-lg p-4 hover:bg-yellow-600 transition-colors"
            >
              Download All as CSV
            </button>
            <Link
              to={"/inventory"}
              className="text-xl text-black bg-yellow-500 flex items-center p-4 justify-center w-full mt-10 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Next
            </Link>
          </div>
          <div className="col-start-2 row-start-1 col-span-full grid grid-cols-6 justify-between items-center gap-4">
            <DigitBox title="Total Inventory" digit="103K" />
            <DigitBox title="Transferred Inventory" digit="2480" />
            <DigitBox title="#Supply Locations" digit="18" />
            <DigitBox title="#Demand Locations" digit="18" />
            <DigitBox title="Total SKUs" digit="300" />
            <DigitBox title="Total SKU Transferred" digit="243" />
          </div>
          <div ref={mapRef} className="border-white rounded-xl border-2 p-2">
            <Map parentRef={mapRef} />
          </div>
          <div className="border-white rounded-xl border-2 p-4 grid grid-row-[1fr_5fr]">
            <div className="flex justify-start items-center gap-10">
              <div className="text-xl text-gray-300 font-extrabold underline  decoration-2">
                Transfer Plan by Qty
              </div>
              <div className="text-base ml-2 font-semibold text-gray-300">
                Supply Location
                <hr className="border-[#4c9875] w-full border-t-2" />
              </div>
              <div className="text-base font-semibold ml-3 text-gray-300">
                Demand Location
                <hr className="border-[#4c9875] w-full border-t-2" />
              </div>
            </div>
            <div ref={treeRef} className="px-6">
              {shipmentOutputs && (
                <TransferPlanTree
                  parentRef={treeRef}
                  jsonData={shipmentOutputs}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[30vh]"></div>
    </LocationContext.Provider>
  );
};

export default ShipmentChart;
