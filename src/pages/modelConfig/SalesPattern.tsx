import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/ui/button";
import ModelConfiguration from "../ModelConfiguration";
// import { maincontainer } from "../Home";
import { useAppDispatch, useAppSelector } from "../../store/reduxHooks";
import InventoryNorms from "./InventoryNorms";
import { useAlert } from "react-alert";
import { addSalesPattern } from "../../store/userThunks";
import { setsalesPatternStatus } from "../../store/modelConfiguration/salesPatternSlice";
import { setModelProgress } from "../../store/modelConfiguration/modelSlice";
import axios from "axios";
import Spinner from "../../components/ui/spinner/Spinner";
import { maincontainer } from "@/configs/mainContainer";
import SelectDays from "@/components/ui/SelectDays";

interface MainContainerContext {
  current: HTMLDivElement | null;
  pages: React.FC[];
  setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
}
const ConfigurationCard = ({
  categoryName,
  index,
  inventory,
  days,
  setDays,
}: {
  categoryName: string;
  index: number;
  inventory: { days: number };
  days: number[];
  setDays: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  // const [name, setName] = useState(categoryName);
  const setDaysState = (value: number) => {
    const tempDays = [...days];
    tempDays[index] = value;
    setDays(tempDays);
  };
  return (
    <div className="flex relative items-center justify-around py-2 mb-[6px] bg-gray-900  rounded-lg shadow-lg">
      {/* category Field */}
      <div className="absolute text-white left-5 font-bold">{index + 1}</div>
      <div>
        <input
          type="text"
          id="category"
          value={categoryName}
          readOnly={true}
          className=" p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter Category"
        />
      </div>
      {/* inventory days Field */}
      <div>
        <div className="relative inline-block w-32">
          {/* Dropdown button */}
          {days.length > index ? (
            <SelectDays day={days[index]} handleDaysChanges={setDaysState} />
          ) : (
            <button
              type="button"
              className="w-full px-4 py-2  bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 text-center text-sm"
            >
              Days
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
const SalesPattern = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfWarehouse, setNumberOfWarehouse] = useState(8);
  const mainContent = useContext(maincontainer) as MainContainerContext;
  const [navigateBack, setNavigateBack] = useState(false);
  const alert = useAlert();
  const dispatch = useAppDispatch();
  const { categories, error } = useAppSelector(
    (state) => state.modelConfiguration.CategoryMaster
  );
  const { status, categories: salesPattern } = useAppSelector(
    (state) => state.modelConfiguration.SalesPattern
  );
  const { inventoryNorms } = useAppSelector(
    (state) => state.modelConfiguration.InventoryNorms
  );
  const { transferbased } = useAppSelector(
    (state) => state.modelConfiguration.ShipmentNorms
  );
  // if (!inventoryNorms.days) {
  //   inventoryNorms.days = salesPattern[0].inventory_days;
  // }
  const daysforall = Array(categories.length).fill(
    inventoryNorms.days ? inventoryNorms.days : 0
  );

  const [days, setDays] = useState(daysforall);
  const handleSubmit = async () => {
    setIsLoading(true);
    if (!inventoryNorms.days) {
      alert.info("days are not selected");
      setIsLoading(false);
      return;
    }
    if (!categories.length) {
      alert.info("category are not selected");
      setIsLoading(false);
      return;
    }
    // const salesPatternData = [];

    // for (const category of categories) {
    //   salesPatternData.push({
    //     categoryname: category.name,
    //     day: inventoryNorms.days,
    //   });
    // }
    const categoryArr: string[] = [];
    categories.forEach((category) => {
      categoryArr.push(category.category_name);
    });
    console.log(days);
    await dispatch(
      addSalesPattern({ category_names: categoryArr, inventory_days: days })
    );
    console.log({ category_names: categories, inventory_days: days });
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
    try {
      await axios.post("/api/inventory_norms/", {
        user_id,
        company_id,
        normbasis: inventoryNorms.normbasis,
        level:
          inventoryNorms.level.charAt(0).toUpperCase() +
          inventoryNorms.level.slice(1),
        transportation_type: transferbased,
        UOM: "",
      });
    } catch (error) {
      console.error("Error posting inventory norms:", error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
    // setNavigateBack((prev) => !prev);
    // mainContent.setPages((prev) => [...prev, ModelConfiguration]);
    // mainContent.current.scrollTo({
    //   left: mainContent.current.scrollWidth / mainContent.pages.length,
    //   behavior: "smooth",
    // });
  };
  useEffect(() => {
    if (mainContent.current && status === "succeeded") {
      setIsLoading(false);
      console.log("eefgsgg");
      setNavigateBack((prev) => !prev);
      mainContent.setPages((prev) => [...prev, ModelConfiguration]);
      dispatch(setModelProgress("InventoryNorms"));
      dispatch(setsalesPatternStatus("idel"));
      mainContent.current.scrollTo({
        left: mainContent.current.scrollWidth / mainContent.pages.length,
        behavior: "smooth",
      });
    }
  }, [status]);
  const handleNavigateBack = (component: React.FC) => {
    setNavigateBack((prev) => !prev);
    mainContent.setPages((prev) => [...prev, component]);

    mainContent.current?.scrollTo({
      left: mainContent.current.scrollWidth / mainContent.pages.length,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    console.log(categories);
    setNumberOfWarehouse(categories.length > 8 ? categories.length : 12);
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
    <div className=" h-full grid grid-cols-[3fr_1fr] items-center justify-center  w-full ">
      <Spinner isLoading={isLoading} />
      <div className="m-auto h-[95%] w-[82%]">
        <div className="flex items-center mb-4">
          <h2 className="text-white text-2xl font-bold">
            Sales pattern for each Warehouse
          </h2>
        </div>
        <div className="bg-gray-900  h-[93%] bg-opacity-75 px-8 py-4  rounded-lg max-w-3xl w-full">
          {/* <div className="flex mb-4  space-x-2">
            <label className="text-lg font-semibold text-gray-300">
              Enter the Number of Warehouse to be Created
            </label>
            <input
              type="number"
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(40,50,86)] focus:border-transparent w-[4rem]  text-gray-900"
              placeholder="e.g., 5"
              min="1"
              value={numberOfWarehouse}
              onChange={(e) => setNumberOfWarehouse(Number(e.target.value))}
            />
          </div> */}
          <div className="h-[32.6rem] gap-[1px] overflow-auto hide-scrollbar">
            <div className="flex mb-2 sticky top-0 z-10 bg-gray-800">
              {/* Email Field */}
              <div className="text-white font-bold text-xl text-center w-full">
                Category
              </div>
              {/* Email Field */}
              <div className=" text-white text-xl text-center font-bold  w-full ">
                Inventory Days
              </div>
            </div>
            {[...Array(numberOfWarehouse)].map((_, index) => (
              <ConfigurationCard
                categoryName={
                  categories.length > index
                    ? categories[index].category_name
                    : ""
                }
                index={index}
                inventory={inventoryNorms}
                key={index}
                days={days}
                setDays={setDays}
              />
            ))}
            {/* <div
              onClick={() => setNumberOfWarehouse((prev) => prev + 1)}
              className="text-white font-bold hover:bg-gray-700 flex  h-16 items-center justify-center p-4 cursor-pointer bg-gray-900 rounded-lg mb-4 shadow-lg"
            >
              + Add more Category
            </div> */}
          </div>
        </div>
      </div>

      <div className="gap-4 flex justify-center items-center flex-col">
        <div>
          <Button
            disabled={isLoading}
            onClick={() => handleNavigateBack(InventoryNorms)}
            className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32 m-auto"
          >
            Edit Days
          </Button>
        </div>
        <div>
          <Button
            disabled={isLoading}
            onClick={handleSubmit}
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
export default SalesPattern;
