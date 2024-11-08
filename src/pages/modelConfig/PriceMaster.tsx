import React, { useContext, useEffect, useState } from "react";
// import { CloudUploadIcon } from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import * as XLSX from "xlsx";

import {
  faCheckDouble,
  faCircleArrowLeft,
  faCircleArrowRight,
  faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { City } from "country-state-city";

import { Button } from "../../components/ui/button";
import ModelConfiguration from "../ModelConfiguration";
// import { maincontainer } from "../Home";
import FileUpload from "../../components/ui/FileUpload";
import axios from "axios";
import { setModelProgress } from "../../store/modelConfiguration/modelSlice";
import { useAppDispatch, useAppSelector } from "../../store/reduxHooks";
import { addPriceMaster } from "../../store/userThunks";
import { useAlert } from "react-alert";
import { setPriceMasterStatus } from "../../store/modelConfiguration/priceMaster";
import Spinner from "../../components/ui/spinner/Spinner";
import { maincontainer } from "@/configs/mainContainer";
interface MainContainerContext {
  current: HTMLDivElement | null;
  pages: React.FC[];
  setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
}
const PriceMaster = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [fileType, setFileType] = useState("xlsx");
  const [priceBasedOn, setPriceBasedOn] = useState("KG");
  const dispatch = useAppDispatch();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const alert = useAlert();
  const [tableData, setTableData] = useState<
    { [key: string]: string | number }[]
  >([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | undefined>();
  const handleFileTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileType(event.target.value);
  };
  const changeFileUrl = (fileUrlFromChild: string) => {
    setFileUrl(fileUrlFromChild);
  };
  const { status, error } = useAppSelector(
    (state) => state.modelConfiguration.PriceMaster
  );
  const { inventoryNorms } = useAppSelector(
    (state) => state.modelConfiguration.InventoryNorms
  );
  const { transferbased } = useAppSelector(
    (state) => state.modelConfiguration.ShipmentNorms
  );

  const cities = City.getCitiesOfCountry("IN");
  const allCity = cities?.map((city) => city.name.toLowerCase());
  // const handlePriceBasedOnChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const checkValue = event.target.value;
  //   setIsUploaded(false);
  //   setTableData([]);
  //   if (priceBasedOn.includes(checkValue)) {
  //     const temp = priceBasedOn.filter((value) => value !== checkValue);
  //     setPriceBasedOn(temp);
  //   } else {
  //     const temp = [...priceBasedOn, checkValue];
  //     setPriceBasedOn(temp);
  //   }
  // };
  const checkNameValidation = (colName: string, colIndex: number) => {
    const rateTypeNames: string[] = [];
    // priceBasedOn.forEach((type) => {
    //   switch (type) {
    //     case "kg":
    //       rateTypeNames.push("rate_per_kg");
    //       break;
    //     case "case":
    //       rateTypeNames.push("rate_per_case");
    //       break;
    //     case "ltrs":
    //       rateTypeNames.push("rate_per_ltr", "rate_per_ltrs");
    //       break;
    //     case "ton":
    //       rateTypeNames.push("rate_per_ton");
    //       break;
    //     case "each":
    //       rateTypeNames.push("rate_per_each");
    //       break;
    //   }
    // });
    if (colIndex === 0 && colName !== "from_location") {
      alert.error("table first column name should be from_location");
      return true;
    } else if (colIndex === 1 && colName !== "to_location") {
      alert.error("table second column name should be to_location");
      return true;
    } else if (colIndex === 2 && colName !== "vehicle_type") {
      alert.error("table third column name should be vehicle_type");
      return true;
    } else if (colIndex === 3 && colName !== "vehicle_capacity_kg") {
      alert.error("table fourth column name should be vehicle_capacity_kg");
      return true;
    } else if (colIndex === 4 && !rateTypeNames.includes(colName)) {
      alert.error("price based on type is not valid");
      return true;
    }
    return false;
  };
  const locationNameValidation = (locationName: string) => {
    return allCity?.includes(locationName.toLowerCase().replace(/\s/g, ""));
  };
  const printcity = () => {
    return allCity?.filter((city) => city.toLowerCase().startsWith("bhiwan"));
  };
  const formatData = (worksheet: any) => {
    const worksheetKeys = Object.keys(worksheet);

    const rowCollection = [];
    let noOfTables = 0;
    for (const key of worksheetKeys) {
      if (worksheet[key].v === "from_location") {
        noOfTables++;
        const dataArr: { [key: string]: string | number }[] = [];

        let col = key.match(/[A-Z]+/g)?.[0];
        const row = parseInt(key.match(/\d+/g)?.[0], 10);
        const lastcol = String.fromCharCode(col.charCodeAt(0) + 4);
        const lastColName = worksheet[lastcol + row].v;
        const priceType = lastColName.split("_").pop()?.toUpperCase();
        let colIndex = 0;
        while (worksheet[col + row]) {
          const colName = worksheet[col + row].v.toLowerCase();

          if (checkNameValidation(colName, colIndex)) {
            setTableData([]);
            setIsUploaded(false);
            return;
          }

          let index = 0;
          let mrow = row + 1; //moving row

          while (worksheet[col + mrow]) {
            const value = worksheet[col + mrow].v;
            if (
              (colIndex === 0 || colIndex === 1) &&
              !locationNameValidation(value)
            ) {
              alert.error(
                `${value} in sheet ${col}-${mrow} is not a valid location`
              );
              setTableData([]);
              setIsUploaded(false);
              return;
            }

            if (!dataArr[index]) {
              dataArr[index] = {};
            }
            if (colIndex === 4) {
              dataArr[index].pricebasedon = priceType;
              dataArr[index].rate_per_unit =
                typeof value === "string" ? value.toUpperCase() : value;
            } else {
              dataArr[index][colName] =
                typeof value === "string" ? value.toUpperCase() : value;
            }
            mrow++;
            index++;
          }
          col = String.fromCharCode(col.charCodeAt(0) + 1);
          colIndex++;
        }

        rowCollection.push(...dataArr);
      }
    }
    if (noOfTables === 0) {
      setTableData([]);
      setIsUploaded(false);
    } else {
      setTableData(rowCollection);
      setIsUploaded(true);
    }
  };
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();

    const file = event.target.files?.[0];

    const allowedExtensions =
      fileType === "xlsx" ? [".xls", ".xlsx", ".xlsm"] : [".csv"];

    const allowedMimeTypes =
      fileType === "xlsx"
        ? [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ]
        : ["text/csv"];

    if (file) {
      const fileExtension = file?.name
        ? `.${file.name.split(".").pop()?.toLowerCase() || ""}`
        : "";
      const fileMimeType = file.type.toLowerCase() || "";

      if (
        !allowedExtensions.includes(fileExtension) ||
        !allowedMimeTypes.includes(fileMimeType)
      ) {
        console.error("Invalid file type");
        event.target.value = "";
        alert.error("please select correct file");
        return;
      }
      setUploadFile(file);
      setIsUploaded(true);
      // const url = URL.createObjectURL(file);
      // setFileUrl(url);
      // const reader = new FileReader();
      // setFileName(file.name);
      // reader.onload = (e) => {
      //   const binaryStr = e.target.result;
      //   const workbook = XLSX.read(binaryStr, { type: "binary" });
      //   // Get the first sheet
      //   const sheetName = workbook.SheetNames[0];
      //   const worksheet = workbook.Sheets[sheetName];
      //   // Convert sheet to JSON data
      //   // console.log(worksheet);
      //   // const jsonData = XLSX.utils.sheet_to_json(worksheet);
      //   // console.log(jsonData);
      //   // setData(jsonData);
      //   formatData(worksheet);
      // };
      // reader.readAsBinaryString(file);
    }
  };
  const mainContent = useContext(maincontainer) as MainContainerContext;
  const [navigateBack, setNavigateBack] = useState(false);
  const handleNavigateBack = () => {
    setNavigateBack((prev) => !prev);
    mainContent.setPages((prev) => [...prev, ModelConfiguration]);
    mainContent.current?.scrollTo({
      left: mainContent.current.scrollWidth / mainContent.pages.length,
      behavior: "smooth",
    });
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (uploadFile) {
        formData.append("file", uploadFile);
      }
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
      const masterConfig = await axios.post("/api/master_config/", {
        user_id,
        company_id,
        normbasis: inventoryNorms.normbasis,
        level:
          inventoryNorms.level.charAt(0).toUpperCase() +
          inventoryNorms.level.slice(1),
        transportation_type: transferbased,
        UOM: priceBasedOn,
      });

      console.log("post request started.....");

      const response = await axios.post(
        "/api/shipment_price_upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            user_id,
            company_id,
          },
        }
      );
      console.log(response);
      console.log("post request end.....");
      if (response.status === 200) {
        console.log("post request end.....");
        if (masterConfig.status !== 200) {
          alert.error("Something went wrong in master configuration");
          return;
        }
        dispatch(setModelProgress("pricemaster"));
        dispatch(setPriceMasterStatus("idel"));
        console.log("Sgsg");
        mainContent.setPages((prev) => [...prev, ModelConfiguration]);
        mainContent.current.scroll({
          left: mainContent.current.scrollWidth / mainContent.pages.length,
          behavior: "smooth",
        });
        setNavigateBack(true);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error submitting form:", error);
      // Handle error (e.g., show error message to user)
    }
    // console.log(tableData);
    // console.log(printcity());
    // if (tableData.length === 0) {
    //   alert.error("select file before submition");
    //   return;
    // }
    // dispatch(addPriceMaster(tableData));
    // setNavigateBack((prev) => !prev);
    // mainContent.setPages((prev) => [...prev, ModelConfiguration]);
    // dispatch(setModelProgress("pricemaster"));
    // mainContent.current?.scrollTo({
    //   left: mainContent.current.scrollWidth / mainContent.pages.length,
    //   behavior: "smooth",
    // });
    setIsLoading(false);
  };
  useEffect(() => {
    if (mainContent.current && status === "succeeded") {
      dispatch(setModelProgress("pricemaster"));
      dispatch(setPriceMasterStatus("idel"));

      mainContent.setPages((prev) => [...prev, ModelConfiguration]);
      mainContent.current.scroll({
        left: mainContent.current.scrollWidth / mainContent.pages.length,
        behavior: "smooth",
      });
      // console.log(mainContent.current);
      setNavigateBack(true);
    }
  }, [status]);
  useEffect(() => {
    console.log("navigateBack" + navigateBack);
    if (navigateBack && mainContent.current) {
      setNavigateBack((prev) => !prev);
      console.log(mainContent.pages);
      mainContent.current.scrollTo({
        left: mainContent.current.scrollWidth / mainContent.pages.length,
        behavior: "smooth",
      });
      setTimeout(() => {
        mainContent.setPages((prev) =>
          prev.length >= 2 ? prev.slice(-1) : prev
        );
      }, 1000);
    }
  }, [navigateBack]);
  return (
    <div className=" grid grid-cols-[70%_30%] rounded-lg w-full self-center mx-auto">
      <Spinner isLoading={isLoading} />
      <div className="p-8">
        <div className="flex items-center mb-6">
          <h2 className="text-white text-2xl font-bold">Price Master</h2>
        </div>
        <div className="bg-gray-900 bg-opacity-75 p-8 rounded-lg text-white w-full mx-auto">
          <div className="grid grid-cols-2 mb-6">
            <div className="grid grid-rows-[1fr_3fr]">
              <h3 className="  justify-self-center text-lg font-semibold">
                Upload price file:
              </h3>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="xlsx"
                  checked={fileType === "xlsx"}
                  onChange={handleFileTypeChange}
                  className="form-checkbox text-orange-500"
                />
                <span className="ml-2">Xlsx</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="csv"
                  checked={fileType === "csv"}
                  onChange={handleFileTypeChange}
                  className="form-checkbox text-orange-500"
                />
                <span className="ml-2">CSV</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="sql"
                  checked={fileType === "sql"}
                  onChange={handleFileTypeChange}
                  className="form-checkbox text-orange-500"
                />
                <span className="ml-2">SQL</span>
              </label>

              <label className="mt-4 max-w-28 flex items-center bg-white text-black px-2 py-2 rounded shadow hover:bg-gray-200 cursor-pointer">
                <input
                  type="file"
                  accept={
                    fileType === "xlsx"
                      ? ".xls, .xlsx, .xlsm, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      : ".csv, text/csv"
                  }
                  multiple
                  onChange={handleUpload}
                  className="hidden"
                />
                {isUploaded ? (
                  <div className="m-auto flex gap-3 items-center whitespace-nowrap overflow-hidden text-ellipsis">
                    <FontAwesomeIcon
                      icon={faCheckDouble}
                      style={{ color: "green" }}
                      size="lg"
                    />
                    {fileName}
                  </div>
                ) : (
                  <div className="m-auto">
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                    Upload
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2  justify-center mb-6">
            <h3 className="mb-4 justify-self-center text-lg font-semibold">
              Price Based on:
            </h3>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="KG"
                  checked={priceBasedOn === "KG"}
                  onChange={(e) => setPriceBasedOn(e.target.value)}
                  className="form-checkbox text-orange-500"
                />
                <span className="ml-2">Kg</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="EACH"
                  checked={priceBasedOn === "EACH"}
                  onChange={(e) => setPriceBasedOn(e.target.value)}
                  className="form-checkbox text-orange-500"
                />
                <span className="ml-2">Each</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="TON"
                  checked={priceBasedOn === "TON"}
                  onChange={(e) => setPriceBasedOn(e.target.value)}
                  className="form-checkbox text-orange-500"
                />
                <span className="ml-2">Ton</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="LTR"
                  checked={priceBasedOn === "LTR"}
                  onChange={(e) => setPriceBasedOn(e.target.value)}
                  className="form-checkbox text-orange-500"
                />
                <span className="ml-2">Ltrs</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="CASE"
                  checked={priceBasedOn === "CASE"}
                  onChange={(e) => setPriceBasedOn(e.target.value)}
                  className="form-checkbox text-orange-500"
                />
                <span className="ml-2">Case</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="gap-4 flex  flex-col justify-center items-center">
        <div className="relative flex w-full">
          <Button
            disabled={isLoading}
            onClick={handleSubmit}
            className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32 m-auto"
          >
            Submit
          </Button>
          <FontAwesomeIcon
            className="cursor-pointer text-yellow-600 hover:text-yellow-700 font-bold absolute right-[20%] top-1/2 transform -translate-y-1/2"
            size="lg"
            icon={faCircleArrowRight}
          />
        </div>
        <div className="relative flex w-full">
          <FontAwesomeIcon
            className="cursor-pointer text-yellow-600 hover:text-yellow-700 font-bold absolute left-[20%] top-1/2 transform -translate-y-1/2"
            size="lg"
            icon={faCircleArrowLeft}
          />
          <Button
            disabled={isLoading}
            onClick={handleNavigateBack}
            className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32 m-auto"
          >
            Back to main
          </Button>
        </div>
      </div>
    </div>
  );
};
export default PriceMaster;
