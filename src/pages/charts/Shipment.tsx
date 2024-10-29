import React, { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { maincontainer } from "@/configs/mainContainer";
import { useNavigate } from "react-router-dom";
import { StepperProgressContext } from "@/App";
import Spinner from "@/components/ui/spinner/Spinner";
import { Button } from "@/components/ui/button";
import ContentWrapper from "@/components/ContentWrapper";
import Img from "@/components/LasyLoading";
import DigitBox from "./components/DigitBox";
import Map from "./graphs/shipment/Map";
import TransferPlanTree from "./graphs/shipment/Tree";
import TreeCopy from "./graphs/shipment/TreeCopy";
interface MainContainerContext {
  current: HTMLDivElement | null;
  pages: React.FC[];
  setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
}

const ShipmentChart = () => {
  const { setActiveStep } = useContext(StepperProgressContext) as {
    setActiveStep: (value: React.SetStateAction<number>) => void;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [shipmentOutputs, setShipmentOutputs] = useState<any[]>([]);
  const cookies = document.cookie.split(";");
  const user_id = cookies
    .find((cookie) => cookie.trim().startsWith("user_id="))
    ?.split("=")[1];

  const treeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchShipmentOutputs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/shipments_outputs/${user_id}`);
        setShipmentOutputs(response.data);
      } catch (error) {
        console.error("Error fetching shipment outputs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (shipmentOutputs.length === 0) {
      // fetchShipmentOutputs();
    }
  }, []);

  return (
    <ContentWrapper>
      <div className="h-screen items-center overflow-hidden w-full mx-auto">
        <div className="absolute inset-0 h-full w-full bg-[rgb(40,50,86)]/75 -z-10"></div>
        <Img
          src="/background-image.jpg"
          alt="Product Image"
          className="absolute -z-20 inset-0 h-full w-full object-cover"
        />
        <Spinner isLoading={isLoading} />
        <div className="h-[88vh] mt-[12vh] overflow-hidden grid grid-rows-[1fr_4fr] gap-x-4 grid-cols-2">
          <div className="col-span-full grid grid-cols-6 justify-between items-center gap-4">
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
              <div className="text-xl text-gray-300 font-extrabold underline decoration-2">
                Transfer Plan
              </div>
              <div className="text-base font-semibold text-gray-300">
                Supply Location
                <hr className="border-[#4c9875] w-full border-t-2" />
              </div>
              <div className="text-base ml-7 font-semibold text-gray-300">
                Demand Location
                <hr className="border-[#4c9875] w-full border-t-2" />
              </div>
            </div>
            <div ref={treeRef}>
              <TransferPlanTree parentRef={treeRef} />
              {/* <TreeCopy parentRef={treeRef} /> */}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[30vh]"></div>
    </ContentWrapper>
  );
};

export default ShipmentChart;
