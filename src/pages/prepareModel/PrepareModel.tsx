import ContentWrapper from "@/components/ContentWrapper";
import Img from "@/components/LasyLoading";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/reduxHooks";
import {
  faAnglesRight,
  faChevronRight,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

const PrepareModel = (props: Props) => {
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <ContentWrapper>
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
            className={` h-full grid grid-cols-2 grid-rows-[1.5fr_1fr_3fr] place-items-center
         `}
          >
            <div className="col-span-full self-end text-center text-orange-500 text-2xl font-bold">
              Welcome Back!{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-300 via-orange-500 to-orange-700">
                {user.username}
              </span>
              <br />
              Glad to see you
            </div>
            <div className="col-span-full text-white text-2xl font-bold">
              your previous configurations have been succesfully loaded{" "}
              <img
                className="h-12 inline-block"
                src="/vecteezy_green-check-mark-icon-png-on-transparent-background_16774415.png"
                alt=""
              />
            </div>
            <div>
              <div className="bg-gray-900 bg-opacity-75 p-8 rounded-lg grid grid-rows-3 items-center text-white place-items-start mx-auto border-r">
                <p className="text-xl ">Recent Activity </p>
                <p className="text-xl">Last model run :data and time</p>
                <p className="text-xl">last configuration run :date and time</p>
              </div>
            </div>
            <div className="flex flex-col h-full justify-around text-white">
              <div className="text-xl">
                <u>
                  Choose an action to proceed{" "}
                  <span className="font-bold">:</span>
                </u>
              </div>
              <div>
                {" "}
                <Button
                  onClick={() => {
                    navigate("/");
                  }}
                  className="bg-yellow-600 text-gray-800 hover:bg-yellow-700  w-full relative p-6 font-bold m-auto"
                >
                  Update | Edit <br />
                  MODELS configuration{" "}
                  <img
                    className="absolute h-10 right-2"
                    src="/Service.png"
                    alt=""
                  />
                </Button>
              </div>
              <div>
                {" "}
                <Button
                  onClick={() => navigate("/runmodel")}
                  className="bg-yellow-600 w-full p-6 text-gray-800 relative text-xl hover:bg-yellow-700 font-bold m-auto"
                >
                  Prepare model run
                  <FontAwesomeIcon
                    className="absolute right-4"
                    icon={faChevronRight}
                    spinPulse
                    size="2xl"
                  />
                </Button>
              </div>
              <div className="cursor-pointer px-2rem text-yellow-600 text-center text-2xl self-end hover:text-yellow-700 font-bold">
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

export default PrepareModel;
