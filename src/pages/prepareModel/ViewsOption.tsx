import React, { useContext, useEffect, useState } from "react";
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

interface MainContainerContext {
  current: HTMLDivElement | null;
  pages: React.FC[];
  setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
}
const ViewsOption = () => {
  const { setActiveStep } = useContext(StepperProgressContext) as {
    setActiveStep: (value: React.SetStateAction<number>) => void;
  };

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // const [fileType, setFileType] = useState("Xlxs");
  // const [priceBasedOn, setPriceBasedOn] = useState("Ton");

  // const handleFileTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFileType(event.target.value);
  // };

  // const handlePriceBasedOnChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setPriceBasedOn(event.target.value);
  // };

  const handlRun = async () => {
    setIsLoading(true);
    try {
      console.log("model run started ....");
      const user_id = Number(
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("user_id="))
          ?.split("=")[1]
      );
      const company_id = Number(
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("company_id="))
          ?.split("=")[1]
      );
      const response = await axios.post(
        "/api/run_model/",
        {},
        {
          params: {
            user_id,
            company_id,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log("model run end ....");
      console.error("Error running model:", error);
    }
    setIsLoading(false);
  };
  const mainContent = useContext(maincontainer) as MainContainerContext;
  const [navigateBack, setNavigateBack] = useState(false);

  const handleNavigateBack = (component: React.FC) => {
    setNavigateBack((prev) => !prev);
    mainContent.setPages((prev) => [...prev, component]);

    mainContent.current?.scrollTo({
      left: mainContent.current.scrollWidth / mainContent.pages.length,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    console.log("navigateBack" + navigateBack);
    if (navigateBack && mainContent.current) {
      setNavigateBack((prev) => !prev);
      console.log(mainContent.pages);
      mainContent.current.scrollTo({
        left: mainContent.current.scrollWidth / mainContent.pages.length,
        behavior: "smooth",
      });
      // setTimeout(() => {
      //   mainContent.current.scrollTo({
      //     left: 0,
      //     behavior: "smooth",
      //   });
      // }, 100);
      setTimeout(() => {
        mainContent.setPages((prev) =>
          prev.length >= 2 ? prev.slice(-1) : prev
        );
      }, 1000);
    }
  }, [navigateBack]);
  return (
    <ContentWrapper>
      <div className="flex h-screen items-center rounded-lg w-full  mx-auto">
        <div className=" absolute inset-0 h-full w-full bg-[rgb(40,50,86)]/75 -z-10"></div>
        <Img
          src="/background-image.jpg"
          alt="Product Image"
          className="absolute -z-20 inset-0 h-full w-full object-cover"
        />
        <Spinner isLoading={isLoading} />
        <div className="bg-gray-900 bg-opacity-75  p-8 rounded-lg h-[55%] grid grid-rows-3   text-white place-items-center w-[80%] mx-auto">
          <div className="flex justify-center  h-full items-center gap-4">
            <h1 className="text-2xl">Model Run Complete!</h1>
          </div>
          <div className="flex h-full justify-center items-center gap-4">
            <img className="h-[60%]" src="/gif/Post-unscreen.gif" alt="" />
            <Button
              disabled={isLoading}
              // onClick={handlRun}
              onClick={() => navigate("/shipment")}
              className="bg-yellow-600 text-gray-800 text-2xl py-8 px-12 hover:bg-yellow-700 font-bold"
            >
              {" "}
              view Full Analysis & charts
            </Button>
            <FontAwesomeIcon
              className="text-yellow-600 text-6xl font-bold"
              icon={faAnglesRight}
            />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default ViewsOption;
