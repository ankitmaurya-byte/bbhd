import React, { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import ContentWrapper from "./ContentWrapper";
import { Link, useLocation } from "react-router-dom";
import CustomizedSteppers from "./ui/Stepper";
import { StepperProgressContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { clearInfo, clearUser } from "@/store/slice";
import Auth from "../pages/Auth";
import { clearCategories } from "@/store/modelConfiguration/categorySlice";
import { clearLocation } from "@/store/modelConfiguration/locationSlice";
import { clearModelProcess } from "@/store/modelConfiguration/modelSlice";
import { clearWarehouse } from "@/store/modelConfiguration/warehouseSlice";
import { clearSalesPattern } from "@/store/modelConfiguration/salesPatternSlice";
import { useAlert } from "react-alert";
import UserCredentials from "../pages/UserCredentials";
type Props = {
  setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
  pages: React.FC[];
};
const Header = ({ setPages, pages }: Props) => {
  const dispatch = useAppDispatch();
  const { isVisible, setIsVisible, setActiveStep } = useContext(
    StepperProgressContext
  );
  const alert = useAlert();
  const location = useLocation();
  console.log(location.pathname);
  const [showPfp, setShowPfp] = useState(false);
  useEffect(() => {
    setShowPfp(location.pathname !== "/");
  }, [location]);
  const { user } = useAppSelector((state) => state.user);
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const handelScroll = () => {
    if (window.scrollY > 200) {
      if (lastScrollY < window.scrollY) {
        setShow("hide");
      } else {
        setShow("show");
      }
    } else {
      setShow("top");
    }
    setLastScrollY(window.scrollY);
  };
  window.addEventListener("scroll", handelScroll);
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
    dispatch(clearUser());
    dispatch(clearInfo());
    dispatch(clearCategories());
    dispatch(clearLocation());
    dispatch(clearModelProcess());
    dispatch(clearWarehouse());
    dispatch(clearSalesPattern());
    setPages([Auth]);
    alert.success("User logged out successfully");
  };

  return (
    <div
      className={`h-[12vh] ${show} bg-[rgb(42,5,114)] fixed left-0 w-full transition-all ease-in-out duration-300`}
    >
      <ContentWrapper className="h-full flex justify-between items-center">
        <div className="h-full w-40">
          <img className="h-full w-full" src="/data_mingle.png" alt="" />
        </div>
        {isVisible && <CustomizedSteppers />}
        {pages[0] !== Auth && pages[0] !== UserCredentials && !showPfp ? (
          <div className=" p-4 ">
            <FontAwesomeIcon
              icon={faRightFromBracket}
              size="2xl"
              style={{
                color: "#ff0000",
                transition: "color 0.3s",
                cursor: "pointer",
              }}
              onClick={handleLogout}
            />
          </div>
        ) : (
          <div className=" p-4 ">
            <div
              style={{
                width: "2em",
                height: "2em",
                transition: "color 0.3s",
                cursor: "pointer",
              }}
            />
          </div>
        )}

        {showPfp && (
          <div className="flex gap-4">
            <div className="text-white text-xl hover:font-bold transition-all ease-in-out duration-300 cursor-pointer m-auto">
              {user.email}
            </div>
            <div className="h-12 w-12 overflow-hidden rounded-full">
              <img
                src="/60111.jpg"
                alt=""
                className="w-full h-full scale-125 object-cover object-center hover:scale-150 transition-transform duration-300 mt-[3px]"
              />
            </div>
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Header;
