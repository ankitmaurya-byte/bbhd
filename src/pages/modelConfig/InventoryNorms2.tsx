import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/ui/button";
import ModelConfiguration from "../ModelConfiguration";
// import { maincontainer } from "../Home";
import SalesPattern from "./SalesPattern";
import { useAppDispatch, useAppSelector } from "../../store/reduxHooks";
import InventoryNorms from "./InventoryNorms";
import { addWarehouse } from "../../store/userThunks";
import { setModelProgress } from "../../store/modelConfiguration/modelSlice";
import { setWarehouses } from "../../store/modelConfiguration/warehouseSlice";
import { clearInventoryNorms } from "../../store/modelConfiguration/inventoryNorms";
import SelectDays from "../../components/ui/SelectDays";
import axios from "axios";
import Spinner from "../../components/ui/spinner/Spinner";
import { maincontainer } from "@/configs/mainContainer";
interface MainContainerContext {
  current: HTMLDivElement | null;
  pages: React.FC[];
  setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
}
const ConfigurationCard = ({
  index,
  warehouseName,
  inventory,
  Day,
  days,
  setDays,
}: {
  index: number;
  warehouseName: string;
  inventory: {
    warehouse: string;
    days: number;
    normbasis: string;
    level: string;
  };
  Day: number;
  days: number[];
  setDays: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  // const [Days, setDays] = useState(
  //   inventory.days !== "" ? inventory.days : "not set"
  // );
  const setDaysState = (value: number) => {
    const tempDays = [...days];
    tempDays[index] = value;
    setDays(tempDays);
  };
  const readonly = inventory.warehouse === "All warehouses";
  return (
    <div className="flex relative items-center justify-around py-2 mb-[6px] bg-gray-900 rounded-lg shadow-lg">
      {/* warehouse Field */}
      <div className="absolute text-white left-5 font-bold">{index + 1}</div>
      <div>
        <input
          type="text"
          id="warehouse"
          readOnly={true}
          value={warehouseName}
          className=" p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="ware house name"
        />
      </div>
      {/* inventory days Field */}
      <div>
        {readonly || Day === 0 ? (
          <div className="relative inline-block w-32">
            {/* Dropdown button */}
            <button
              type="button"
              className="w-full px-4 py-2  bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 text-center text-sm"
            >
              {Day ? `${Day} ${Day === 1 ? "day" : "days"}` : "Days"}
            </button>
          </div>
        ) : (
          <SelectDays day={Day} handleDaysChanges={setDaysState} />
        )}
      </div>
    </div>
  );
};
const InventoryNorms2 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfWarehouse, setNumberOfWarehouse] = useState(8);
  const dispatch = useAppDispatch();
  const { locations, error } = useAppSelector(
    (state) => state.modelConfiguration.LocationMaster
  );
  const { status } = useAppSelector(
    (state) => state.modelConfiguration.warehouses
  );
  const { inventoryNorms } = useAppSelector(
    (state) => state.modelConfiguration.InventoryNorms
  );

  const mainContent = useContext(maincontainer) as MainContainerContext;
  const [navigateBack, setNavigateBack] = useState(false);
  // const locationKeys = Object.keys(locations);
  const daysforall = Array(locations.length).fill(
    inventoryNorms.days ? inventoryNorms.days : 0
  );
  const [days, setDays] = useState(daysforall);
  const handelSubmit = async () => {
    setIsLoading(true);
    console.log(days);
    const wareHouseNames = [];
    const inventoryDays = [];
    for (let i = 0; i < locations.length; i++) {
      wareHouseNames.push(locations[i].location);
      inventoryDays.push(days[i]);
    }
    console.log({
      warehouse_names: wareHouseNames,
      inventory_days: inventoryDays,
    });
    await dispatch(
      addWarehouse({
        warehouse_names: wareHouseNames,
        inventory_days: inventoryDays,
      })
    );
    dispatch(clearInventoryNorms());
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
    console.log(company_id);
    console.log(user_id);
    await axios.post("/api/inventory_norms/", {
      user_id,
      company_id,
      normbasis: inventoryNorms.normbasis,
      level:
        inventoryNorms.level.charAt(0).toUpperCase() +
        inventoryNorms.level.slice(1),
    });
  };
  useEffect(() => {
    if (status === "idel") {
      // Add any necessary logic here
    }
    if (mainContent.current && status === "succeeded") {
      setIsLoading(false);
      dispatch(setModelProgress("InventoryNorms"));
      dispatch(setWarehouses("idel"));

      setNavigateBack((prev) => !prev);
      mainContent.setPages((prev) => [...prev, ModelConfiguration]);
      mainContent.current?.scrollTo({
        left: mainContent.current.scrollWidth / mainContent.pages.length,
        behavior: "smooth",
      });
    }
  }, [status, dispatch, mainContent]);
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
  useEffect(() => {
    if (locations.length > 8) {
      setNumberOfWarehouse(locations.length);
    } else {
      setNumberOfWarehouse(12);
    }
  }, []);
  return (
    <div className=" h-full grid grid-cols-[3fr_1fr] items-center justify-center  w-full ">
      <Spinner isLoading={isLoading} />
      <div className="m-auto h-[95%] w-[82%]">
        <div className="flex items-center mb-4">
          <h2 className="text-white text-2xl font-bold">Inventory Norms</h2>
        </div>
        <div className="bg-gray-900 h-[93%] bg-opacity-75 px-8 py-4 rounded-lg max-w-3xl w-full">
          <div className="h-[32.6rem] flex flex-col gap-[1px] overflow-auto hide-scrollbar">
            <div className="flex mb-2 sticky top-0 z-10 bg-gray-800">
              <div className="text-white font-bold text-xl text-center w-full">
                Warehouse Name
              </div>
              {/* Email Field */}
              <div className=" text-white text-xl text-center font-bold  w-full ">
                Inventory Days
              </div>
            </div>
            {[...Array(numberOfWarehouse)].map((_, index) => (
              <ConfigurationCard
                key={index}
                warehouseName={
                  locations.length > index ? locations[index].location : ""
                }
                inventory={inventoryNorms}
                index={index}
                Day={locations.length > index ? days[index] : 0}
                days={days}
                setDays={setDays}
              />
            ))}
          </div>
        </div>
      </div>

      <div className=" gap-4 flex justify-center items-center flex-col">
        <div>
          <Button
            disabled={isLoading}
            onClick={handelSubmit}
            className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32 m-auto"
          >
            Submit
          </Button>
        </div>
        <div>
          <Button
            disabled={isLoading}
            onClick={() => handleNavigateBack(InventoryNorms)}
            className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32 m-auto"
          >
            Back
          </Button>
        </div>
        <div>
          <Button
            disabled={isLoading}
            onClick={() => handleNavigateBack(SalesPattern)}
            className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32 m-auto"
          >
            Next
          </Button>
        </div>
        <div>
          <div
            onClick={() => handleNavigateBack(ModelConfiguration)}
            className="text-yellow-600 hover:text-yellow-700 text-center font-bold"
          >
            Back to model configuration
          </div>
        </div>
        <div className="relative items-center flex w-full">
          <FontAwesomeIcon
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

export default InventoryNorms2;
