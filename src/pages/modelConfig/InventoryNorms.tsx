import React, { useContext, useEffect, useState } from "react";
// import { CloudUploadIcon } from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/ui/button";
import SelectDays from "../../components/ui/SelectDays";
import ModelConfiguration from "../ModelConfiguration";
// import { maincontainer } from "../Home";
import InventoryNorms2 from "./InventoryNorms2";

import { useAppDispatch, useAppSelector } from "../../store/reduxHooks";
import { setInventory } from "../../store/modelConfiguration/inventoryNorms";
import SalesPattern from "./SalesPattern";
import { useAlert } from "react-alert";
import { maincontainer } from "@/configs/mainContainer";
interface MainContainerContext {
  current: HTMLDivElement | null;
  pages: React.FC[];
  setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
}
const InventoryNorms = () => {
  const { status, inventoryNorms } = useAppSelector(
    (state) => state.modelConfiguration.InventoryNorms
  );
  const [navigateBack, setNavigateBack] = useState(false);
  const dispatch = useAppDispatch();
  const alert = useAlert();
  const mainContent = useContext(maincontainer) as MainContainerContext;
  const [normBasis, setNormsBasis] = useState(inventoryNorms.normbasis);
  const [level, setLevel] = useState(inventoryNorms.level);
  const [categoryDisable, setCategoryDisable] = useState(
    inventoryNorms.normbasis === "Sales Pattern" ? true : false
  );
  const [allWarehouseDisable, setAllWarehouseDisable] = useState(
    inventoryNorms.level === "category" ? true : false
  );
  const [days, setDays] = useState(inventoryNorms.days);
  const [warehouse, setWarehouse] = useState(inventoryNorms.warehouse);
  const handelNormBasis = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNormsBasis(event.target.value);
    if (event.target.value === "Sales Pattern") {
      setLevel("global");
    }
  };
  const handelLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLevel(event.target.value.toLowerCase());
    if (event.target.value === "category") {
      setWarehouse("All warehouses");
    }
  };
  const handeWareHouseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWarehouse(event.target.value);
  };
  const handelDaysChanges = (selectedDay: number) => {
    setDays(selectedDay);
  };
  const handleNavigateBack = () => {
    setNavigateBack((prev) => !prev);
    mainContent.setPages((prev) => [...prev, ModelConfiguration]);
    mainContent.current.scrollTo({
      left: mainContent.current.scrollWidth / mainContent.pages.length,
      behavior: "smooth",
    });
  };
  useEffect(() => {
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
    setNormsBasis(inventoryNorms.normbasis);
    setLevel(inventoryNorms.level);
    setDays(inventoryNorms.days);
    setWarehouse(inventoryNorms.warehouse);
    // if (mainContent.current && status === "succeeded") {
    //   dispatch(setInventoryNormsStatus("idel"));
    //   mainContent.setPages((prev) => [
    //     ...prev,
    //     level === "category" ? SalesPattern : InventoryNorms2,
    //   ]);
    //   mainContent.current.scroll({
    //     left: mainContent.current.scrollWidth / mainContent.pages.length,
    //     behavior: "smooth",
    //   });
    //   // console.log(mainContent.current);
    //   setNavigateBack(true);
    // }
  }, [status]);
  const handelSaveNorms = () => {
    console.log({ normbasis: normBasis, level, days, warehouse });
    dispatch(
      setInventory({
        normbasis: normBasis,
        level,
        days: days,
        warehouse,
      })
    );

    mainContent.setPages((prev) => [
      ...prev,
      level === "category" ? SalesPattern : InventoryNorms2,
    ]);
    mainContent.current.scroll({
      left: mainContent.current.scrollWidth / mainContent.pages.length,
      behavior: "smooth",
    });
    // console.log(mainContent.current);
    setNavigateBack(true);
  };
  const handelNext = () => {
    console.log(level, normBasis, days, warehouse);

    if (!level || !normBasis || !days || !warehouse) {
      alert.removeAll();
      alert.info("please fill all data");
    } else {
      alert.removeAll();
      mainContent.setPages((prev) => [
        ...prev,
        level === "category" ? SalesPattern : InventoryNorms2,
      ]);
      mainContent.current.scrollTo({
        left: mainContent.current.scrollWidth / mainContent.pages.length,
        behavior: "smooth",
      });
      setNavigateBack((prev) => !prev);
    }
  };
  return (
    <div className="grid grid-cols-[3fr_1fr] rounded-lg w-full self-center mx-auto">
      <div className="w-[90%] justify-self-end">
        <div className="flex items-center mb-6">
          <h2 className="text-white text-2xl font-bold">Inventory Norms</h2>
        </div>
        <div className="bg-gray-900 bg-opacity-75 p-8 rounded-lg text-white w-full mx-auto">
          {/* question 1 */}
          <div className="grid gap-10 grid-cols-2 mb-6">
            <h3 className="mb-4 justify-self-center text-lg font-semibold">
              Want to define Inventory Norms Basis:
            </h3>
            <div className="grid grid-cols-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="Inventory days"
                  checked={normBasis === "Inventory days"}
                  onChange={(e) => {
                    setCategoryDisable(false);
                    handelNormBasis(e);
                  }}
                  className="form-checkbox text-orange-500"
                />
                <span className="ml-2">Inventory days</span>
              </label>
              <label className="flex mt-0 items-center">
                <input
                  type="checkbox"
                  value="Sales Pattern"
                  checked={normBasis === "Sales Pattern"}
                  onChange={(e) => {
                    setAllWarehouseDisable(false);
                    setCategoryDisable(true);
                    handelNormBasis(e);
                  }}
                  className="form-checkbox text-orange-500"
                />
                <span className="ml-2">Sales Pattern</span>
              </label>
            </div>
          </div>
          {/* question 2 */}
          <div className="grid gap-10 grid-cols-2  justify-center mb-6">
            <h3 className="mb-4 justify-self-center text-lg font-semibold">
              Inventory level based on Global & Category:
            </h3>
            <div className="grid grid-cols-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="global"
                  checked={level === "global"}
                  onChange={(e) => {
                    setAllWarehouseDisable(false);
                    handelLevelChange(e);
                  }}
                  className="form-checkbox text-orange-500"
                />
                <span className="ml-2">Global</span>
              </label>
              <label className="flex mt-0 items-center">
                <input
                  type="checkbox"
                  value="category"
                  disabled={categoryDisable}
                  checked={level === "category"}
                  onChange={(e) => {
                    setAllWarehouseDisable(true);
                    handelLevelChange(e);
                  }}
                  className="form-checkbox text-orange-500"
                />
                <span className="ml-2">Category</span>
              </label>
            </div>
          </div>
          {/* question 3 */}
          <div className="grid gap-10 grid-cols-2  justify-center mb-6">
            <h3 className="mb-4 justify-self-center text-lg font-semibold">
              How many days of inventory you wanna set ?
            </h3>

            <SelectDays day={days} handleDaysChanges={handelDaysChanges} />
          </div>
          {/* question 4 */}
          <div className="grid gap-10 grid-cols-2  justify-center mb-6">
            <h3 className="mb-4 justify-self-center text-lg font-semibold">
              Do you want to set inventory days same for all warehouses?
            </h3>
            <div className="grid grid-cols-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="All warehouses"
                  checked={warehouse === "All warehouses"}
                  onChange={handeWareHouseChange}
                  className="form-checkbox text-orange-500"
                />
                <span className="ml-2">All warehouses</span>
              </label>
              <label className="flex mt-0 items-center">
                <input
                  type="checkbox"
                  value="Diffrent for each warehouses"
                  checked={warehouse === "Diffrent for each warehouses"}
                  disabled={allWarehouseDisable}
                  onChange={handeWareHouseChange}
                  className="form-checkbox text-orange-500"
                />
                <span className="ml-2">Diffrent for each warehouses</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className=" gap-4 flex justify-center items-center flex-col">
        <div>
          <Button
            onClick={handelSaveNorms}
            className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32 "
          >
            Submit
          </Button>
        </div>
        <Button
          onClick={handelNext}
          className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32 "
        >
          Next
        </Button>
        <div>
          <div
            onClick={handleNavigateBack}
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
            onClick={handleNavigateBack}
            className="m-auto cursor-pointer text-yellow-600 hover:text-yellow-700 font-bold"
          >
            Back to main
          </div>
        </div>
      </div>
    </div>
  );
};
export default InventoryNorms;
