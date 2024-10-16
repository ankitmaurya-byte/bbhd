import { StepperProgressContext } from "@/App";
import ContentWrapper from "@/components/ContentWrapper";
import Img from "@/components/LasyLoading";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner/Spinner";
import { maincontainer } from "@/configs/mainContainer";
import { clearCategories } from "@/store/modelConfiguration/categorySlice";
import { clearLocation } from "@/store/modelConfiguration/locationSlice";
import { clearModelProcess } from "@/store/modelConfiguration/modelSlice";
import { clearSalesPattern } from "@/store/modelConfiguration/salesPatternSlice";
import { clearWarehouse } from "@/store/modelConfiguration/warehouseSlice";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { clearByUser, clearInfo, clearUser } from "@/store/slice";
import {
  faChevronRight,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useAlert } from "react-alert";
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
  const handleForcastUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Access the files from the input
    const files = e.target.files;
  };
  const mainContent = useContext(maincontainer) as MainContainerContext;
  const dispatch = useAppDispatch();
  const alert = useAlert();
  const { setIsVisible } = useContext(StepperProgressContext);
  const handleLogout = () => {
    // axios
    //   .post("/api/logout")
    //   .then(() => {
    //     setIsVisible(false);
    //     setActiveStep((prev: number) => prev - 1);
    //     dispatch(clearUser());
    //     dispatch(clearInfo());
    //     setPages([Auth]);
    //     alert.success("User logged out successfully");
    //   })
    //   .catch((error) => {
    //     console.error("Logout failed:", error);
    //     alert.error("Logout failed. Please try again.");
    //   });
    // document.cookie = "";
    const cookies = document.cookie.split(";");
    console.log(cookies);
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
    console.log(document.cookie);
    setIsVisible(false);
    setActiveStep(0);
    dispatch(clearByUser());
    dispatch(clearInfo());
    dispatch(clearCategories());
    dispatch(clearLocation());
    dispatch(clearModelProcess());
    dispatch(clearWarehouse());
    dispatch(clearSalesPattern());
    navigate("/");
    alert.success("User logged out successfully");
  };
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
                  <div className="bg-[#b4b1bb] bg-opacity-70 h-full rounded-xl grid place-items-center grid-cols-[2fr_1fr] p-1 grid-rows-1 text-black">
                    <div className="text-lg">Choose file</div>

                    {/* Label wrapped around Button for file input */}
                    <label
                      htmlFor="file-upload"
                      className="bg-yellow-600 h-full text-gray-800 px-8 justify-self-end rounded-lg hover:bg-yellow-700 font-bold flex items-center cursor-pointer"
                    >
                      Browse
                    </label>

                    {/* Hidden file input */}
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={(e) => console.log(e.target.files[0])} // Optional: Handle file selection
                    />
                  </div>
                </div>
                <div className="grid h-full grid-cols-[1.5fr_4fr] items-center w-full">
                  <div className="text-lg font-semibold">Forecast File:</div>
                  <div className="bg-[#b4b1bb] bg-opacity-70 h-full rounded-xl grid place-items-center grid-cols-[2fr_1fr] p-1 grid-rows-1 text-black">
                    <div className="text-lg">Choose file</div>

                    {/* Label wrapped around Button for file input */}
                    <label
                      htmlFor="file-upload"
                      className="bg-yellow-600 h-full text-gray-800 px-8 justify-self-end rounded-lg hover:bg-yellow-700 font-bold flex items-center cursor-pointer"
                    >
                      Browse
                    </label>

                    {/* Hidden file input */}
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleForcastUpload} // Optional: Handle file selection
                    />
                  </div>
                </div>
                <div className="grid h-full grid-cols-[1.5fr_4fr] items-center w-full">
                  <div className="text-lg font-semibold">Inventory File:</div>
                  <div className="bg-[#b4b1bb] bg-opacity-70 h-full rounded-xl grid place-items-center grid-cols-[2fr_1fr] p-1 grid-rows-1 text-black">
                    <div className="text-lg">Choose file</div>

                    {/* Label wrapped around Button for file input */}
                    <label
                      htmlFor="file-upload"
                      className="bg-yellow-600 h-full text-gray-800 px-8 justify-self-end rounded-lg hover:bg-yellow-700 font-bold flex items-center cursor-pointer"
                    >
                      Browse
                    </label>

                    {/* Hidden file input */}
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={(e) => console.log(e.target.files[0])} // Optional: Handle file selection
                    />
                  </div>
                </div>
                <div className="grid h-full grid-cols-[1.5fr_4fr] items-center w-full">
                  <div className="text-lg font-semibold">Intransit File:</div>
                  <div className="bg-[#b4b1bb] bg-opacity-70 h-full rounded-xl grid place-items-center grid-cols-[2fr_1fr] p-1 grid-rows-1 text-black">
                    <div className="text-lg">Choose file</div>

                    {/* Label wrapped around Button for file input */}
                    <label
                      htmlFor="file-upload"
                      className="bg-yellow-600 h-full text-gray-800 px-8 justify-self-end rounded-lg hover:bg-yellow-700 font-bold flex items-center cursor-pointer"
                    >
                      Browse
                    </label>

                    {/* Hidden file input */}
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={(e) => console.log(e.target.files[0])} // Optional: Handle file selection
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col h-full justify-center items-center gap-4">
              <Button
                // disabled={isLoading}
                onClick={handlRun}
                // onClick={() => navigate("/chart")}
                className="bg-yellow-600 text-gray-800 text-xl py-6 px-12 hover:bg-yellow-700 font-bold w-full"
              >
                {" "}
                model run
              </Button>
              <Button
                onClick={() => navigate("/user")}
                className="bg-yellow-600 text-gray-800 text-xl py-6 px-12 hover:bg-yellow-700 font-bold w-full"
              >
                {" "}
                Profile
              </Button>
              <div
                onClick={handleLogout}
                className="cursor-pointer px-2rem text-yellow-600 text-center text-2xl self-end hover:text-yellow-700 justify-self-end font-bold"
              >
                Logout <FontAwesomeIcon icon={faRightFromBracket} />
              </div>
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
