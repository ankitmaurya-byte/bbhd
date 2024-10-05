import { StepperProgressContext } from "@/App";
import ContentWrapper from "@/components/ContentWrapper";
import Img from "@/components/LasyLoading";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner/Spinner";
import { maincontainer } from "@/configs/mainContainer";
import { useAppSelector } from "@/store/reduxHooks";
import {
  faChevronRight,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
interface MainContainerContext {
  current: HTMLDivElement | null;
  pages: React.FC[];
  setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
}
type Props = {};

const RunModel = (props: Props) => {
  const { setActiveStep } = useContext(StepperProgressContext) as {
    setActiveStep: (value: React.SetStateAction<number>) => void;
  };

  const [isLoading, setIsLoading] = useState(false);

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
      navigate("/chart");
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
  const navigate = useNavigate();
  return (
    <ContentWrapper>
      <Spinner isLoading={isLoading} />
      <div className="overflow-hidden">
        {/* <Spinner isLoading={isLoading} /> */}
        <div className=" absolute inset-0 h-full w-full bg-[rgb(40,50,86)]/75 -z-10"></div>
        <Img
          src="/background-image.jpg"
          alt="Product Image"
          className="absolute -z-20 inset-0 h-full w-full object-cover"
        />
        <div
          className="h-[88vh] mt-[12vh] overflow-hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div
            className={` h-full grid grid-cols-[2fr_1fr] place-items-center
         `}
          >
            <div className="h-[60%]  text-white w-[80%]">
              <h1 className="text-4xl font-bold mb-6">File Uploads</h1>
              <div className="bg-gray-900 bg-opacity-70  p-8 rounded-lg gap-12 grid grid-rows-4 items-center h-full place-items-start mx-auto">
                <div className="grid h-full grid-cols-[1.5fr_4fr] items-center w-full">
                  <div className="text-lg font-semibold">Sales File:</div>
                  <div className="bg-[#b4b1bb] bg-opacity-75 h-full rounded-xl grid place-items-center grid-cols-[2fr_1fr] p-1 grid-rows-1 text-black">
                    <div className="text-lg font-semibold">Choose file</div>
                    <Button className="bg-yellow-600 h-full text-gray-800 px-8 justify-self-end hover:bg-yellow-700 font-bold">
                      Browse
                    </Button>
                  </div>
                </div>
                <div className="grid h-full grid-cols-[1.5fr_4fr] items-center w-full">
                  <div className="text-lg font-semibold">Forecast File:</div>
                  <div className="bg-[#b4b1bb] bg-opacity-75 h-full rounded-xl grid place-items-center grid-cols-[2fr_1fr] p-1 grid-rows-1 text-black">
                    <div className="text-lg font-semibold">Choose file</div>
                    <Button className="bg-yellow-600 h-full text-gray-800 px-8 justify-self-end hover:bg-yellow-700 font-bold">
                      Browse
                    </Button>
                  </div>
                </div>
                <div className="grid h-full grid-cols-[1.5fr_4fr] items-center w-full">
                  <div className="text-lg font-semibold">Inventory File:</div>
                  <div className="bg-[#b4b1bb] bg-opacity-90 h-full rounded-xl grid place-items-center grid-cols-[2fr_1fr] p-1 grid-rows-1 text-black">
                    <div className="text-lg font-semibold">Choose file</div>
                    <Button className="bg-yellow-600 h-full text-gray-800 px-8 justify-self-end hover:bg-yellow-700 font-bold">
                      Browse
                    </Button>
                  </div>
                </div>
                <div className="grid h-full grid-cols-[1.5fr_4fr] items-center w-full">
                  <div className="text-lg font-semibold">Intransit File:</div>
                  <div className="bg-[#b4b1bb] bg-opacity-40 h-full rounded-xl grid place-items-center grid-cols-[2fr_1fr] p-1 grid-rows-1 text-black">
                    <div className="text-lg font-semibold">Choose file</div>
                    <Button className="bg-yellow-600 h-full text-gray-800 px-8 justify-self-end hover:bg-yellow-700 font-bold">
                      Browse
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex h-full justify-center items-center gap-4">
              <Button
                // disabled={isLoading}
                onClick={handlRun}
                // onClick={() => navigate("/chart")}
                className="bg-yellow-600 text-gray-800 text-2xl py-6 px-12 hover:bg-yellow-700 font-bold"
              >
                {" "}
                model run
              </Button>
            </div>
          </div>
        </div>
        {/* <div className="w-full  h-[30vh]"></div>
      <div className="w-full h-[30vh]"></div> */}{" "}
      </div>
      <div className="w-full h-[30vh]"></div>
    </ContentWrapper>
  );
};

export default RunModel;
