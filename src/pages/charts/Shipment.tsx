import React, { useContext, useEffect, useRef, useState } from "react";
// import { CloudUploadIcon } from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
// import { maincontainer } from "./Home";
import axios from "axios";
import { maincontainer } from "@/configs/mainContainer";
import { useNavigate } from "react-router-dom";
import { StepperProgressContext } from "@/App";
import Spinner from "@/components/ui/spinner/Spinner";
import { Button } from "@/components/ui/button";
import ContentWrapper from "@/components/ContentWrapper";
import Img from "@/components/LasyLoading";
// import TransferPlanTree from "./graphs/Tree";
// import Map from "./graphs/Map";
import DigitBox from "./components/DigitBox";
interface MainContainerContext {
  current: HTMLDivElement | null;
  pages: React.FC[];
  setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
}
const ShipmentChart = () => {
  const { setActiveStep } = useContext(StepperProgressContext) as {
    setActiveStep: (value: React.SetStateAction<number>) => void;
  };
  const treeRef = useRef();
  const mapRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ContentWrapper>
      <div className="h-screen items-center overflow-hidden  w-full  mx-auto ">
        <div className=" absolute inset-0 h-full w-full bg-[rgb(40,50,86)]/75 -z-10"></div>
        <Img
          src="/background-image.jpg"
          alt="Product Image"
          className="absolute -z-20 inset-0 h-full w-full object-cover"
        />
        <Spinner isLoading={isLoading} />
        <div className="h-[88vh] mt-[12vh] overflow-hidden grid grid-rows-[1fr_4fr] gap-x-4 grid-cols-2">
          <div className="col-span-full grid grid-cols-6  justify-between items-center gap-4">
            <DigitBox title="Total Inventory" digit="103K" />
            <DigitBox title="Transfered Inventory" digit="2480" />
            <DigitBox title="#Supply Loations" digit="18" />
            <DigitBox title="#Demand Locations" digit="18" />
            <DigitBox title="Total SKY's" digit="300" />
            <DigitBox title="Total SKU Transfered" digit="243" />
          </div>
          <div ref={mapRef} className=" border-white rounded-xl border-2 p-2">
            {/* <Map parentref={mapRef} /> */}
          </div>
          <div ref={treeRef} className=" border-white rounded-xl border-2 p-4">
            {/* <TransferPlanTree parentRef={treeRef} /> */}
          </div>
        </div>
      </div>
      <div className="w-full h-[30vh]"></div>
    </ContentWrapper>
  );
};

export default ShipmentChart;
