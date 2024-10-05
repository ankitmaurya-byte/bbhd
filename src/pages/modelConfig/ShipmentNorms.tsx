import React, { useContext, useEffect, useState } from "react";
// import { CloudUploadIcon } from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/ui/button";
// import { maincontainer } from "../Home";
import ModelRun from "../ModelRun";
import ModelConfiguration from "../ModelConfiguration";
import { StepperProgressContext } from "../../App";
import { useAppDispatch, useAppSelector } from "../../store/reduxHooks";
import { setModelProgress } from "../../store/modelConfiguration/modelSlice";
import { setShipmentStatus } from "../../store/modelConfiguration/shipmentNorms";
import { maincontainer } from "@/configs/mainContainer";
import axios from "axios";
import { useAlert } from "react-alert";
import Spinner from "@/components/ui/spinner/Spinner";
import { addShipmentNorms } from "@/store/userThunks";
interface MainContainerContext {
  current: HTMLDivElement | null;
  pages: React.FC[];
  setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
}
const ShipmentNorms = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setActiveStep } = useContext(StepperProgressContext) as {
    setActiveStep: (value: React.SetStateAction<number>) => void;
  };
  const { inventoryNorms } = useAppSelector(
    (state) => state.modelConfiguration.InventoryNorms
  );
  const alert = useAlert();
  const { status } = useAppSelector(
    (state) => state.modelConfiguration.ShipmentNorms
  );

  const [transferBasedOn, setTransferBasedOn] = useState("");
  const dispatch = useAppDispatch();
  const handeltransferBasedOn = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTransferBasedOn(event.target.value);
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
  const handleSubmit = () => {
    if (transferBasedOn === "") {
      alert.error("please select a transfer based on");
      return;
    }
    setIsLoading(true);
    dispatch(
      addShipmentNorms({
        normbasis: inventoryNorms.normbasis,
        level:
          inventoryNorms.level.charAt(0).toUpperCase() +
          inventoryNorms.level.slice(1),
        transportation_type: transferBasedOn,
        UOM: "",
      })
    );
  };
  useEffect(() => {
    if (status === "idle") {
      // Add any necessary logic here
    }
    if (mainContent.current && status === "succeeded") {
      setIsLoading(false);
      dispatch(setModelProgress("ShipmentNorm"));
      dispatch(setShipmentStatus("idle"));

      mainContent.setPages((prev) => [...prev, ModelConfiguration]);
      mainContent.current.scroll({
        left: mainContent.current.scrollWidth / mainContent.pages.length,
        behavior: "smooth",
      });
      setNavigateBack(true);
    }
  }, [status, dispatch, mainContent]);
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
    <div className=" grid grid-cols-[3fr_1fr] rounded-lg w-full items-center h-full self-center mx-auto">
      <Spinner isLoading={isLoading} />
      <div className="h-[73%] px-16">
        <div className="flex items-center mb-6">
          <h2 className="text-white text-2xl font-bold">Shipment Norms</h2>
        </div>
        <div className="bg-gray-900 bg-opacity-75  p-8 rounded-lg h-full text-white w-full mx-auto">
          <div className="grid grid-cols-2 mb-6">
            <h3 className="mb-4 justify-self-center text-lg font-semibold">
              Transfer Based on:
            </h3>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="FTL"
                  checked={transferBasedOn === "FTL"}
                  onChange={handeltransferBasedOn}
                  className="form-checkbox text-orange-500"
                />
                <span className="ml-2">FTL</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="PTL"
                  checked={transferBasedOn === "PTL"}
                  onChange={handeltransferBasedOn}
                  className="form-checkbox text-orange-500"
                />
                <span className="ml-2">PTL</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="Express"
                  checked={transferBasedOn === "Express"}
                  onChange={handeltransferBasedOn}
                  className="form-checkbox text-orange-500"
                />
                <span className="ml-2">Express</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className=" gap-4 flex justify-center items-center flex-col">
        <div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32 m-auto"
          >
            Submit
          </Button>
        </div>
        <div>
          <div
            onClick={() => !isLoading && handleNavigateBack(ModelConfiguration)}
            className="text-yellow-600 text-center hover:text-yellow-700 font-bold"
          >
            Back to model configuration
          </div>
        </div>
        <div className="relative items-center flex w-full">
          <FontAwesomeIcon
            onClick={() => !isLoading && handleNavigateBack(ModelConfiguration)}
            className="absolute ml-16 cursor-pointer text-yellow-600 hover:text-yellow-700 font-bold"
            size="lg"
            icon={faCircleArrowLeft}
          />
          <div
            onClick={() => handleNavigateBack(ModelConfiguration)}
            className="m-auto cursor-pointer text-yellow-600 hover:text-yellow-700 font-bold"
          >
            Back to main
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentNorms;
