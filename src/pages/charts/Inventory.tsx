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
import PostInventory from "./graphs/inventory/PostInventory";
import PrepostMultibar from "./graphs/inventory/PrepostMultibar";
import TreeMapSquarify from "./graphs/treemap/TreeMapSquarify";
import Percentage from "./graphs/treemap/Percentage";
type Props = {};

const Inventory = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const postInventoryRef = useRef();
  const prePostMultibar = useRef();
  const treemapref = useRef();
  const percentageref = useRef();
  return (
    <ContentWrapper>
      <div className="h-screen items-center overflow-hidden w-full mx-auto p-4">
        <div className="absolute inset-0 h-full w-full bg-[rgb(40,50,86)]/75 -z-10"></div>
        <Img
          src="/background-image.jpg"
          alt="Product Image"
          className="absolute -z-20 inset-0 h-full w-full object-cover"
        />
        <Spinner isLoading={isLoading} />
        <div className="h-[84vh] mt-[12vh] grid grid-cols-2 grid-rows-[1.5fr_1fr_1fr] gap-2">
          <div
            ref={percentageref}
            className="border border-white rounded bg-white/10 col-span-full row-span-full"
          >
            <Percentage parentRef={percentageref} />
          </div>
          {/* <div className="border border-white rounded bg-white/10 grid grid-rows-[1fr_3fr] gap-2 p-2">
            <div className="bg-white/10 grid grid-cols-3 gap-2">
              <div className="border border-wheat bg-[#e9f5db] rounded">
                chart 1
              </div>
              <div className="border border-wheat bg-[#e9f5db] rounded">
                chart 2
              </div>
              <div className="border border-wheat bg-[#e9f5db] rounded">
                chart 3
              </div>{" "}
            </div>
            <div ref={prePostMultibar} className="bg-white/10">
              <PrepostMultibar parentRef={prePostMultibar} />
            </div>
          </div>
          <div
            ref={treemapref}
            className="border border-white rounded row-span-2 bg-white/10"
          >
            <TreeMapSquarify parentRef={treemapref} />
          </div>
          <div
            ref={postInventoryRef}
            className="border border-white rounded bg-white/10"
          >
            <PostInventory parentRef={postInventoryRef} />
          </div>
          <div className="border border-white rounded bg-white/10">div5</div> */}
        </div>
      </div>
      <div className="w-full h-[30vh]"></div>
    </ContentWrapper>
  );
};

export default Inventory;
