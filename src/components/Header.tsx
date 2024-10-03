import React, { useContext, useState } from "react";
import { Button } from "./ui/button";
import ContentWrapper from "./ContentWrapper";
import { Link } from "react-router-dom";
import CustomizedSteppers from "./ui/Stepper";
import { StepperProgressContext } from "../App";

type Props = {};

const Header = (props: Props) => {
  const { isVisible } = useContext(StepperProgressContext);
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
  return (
    <div
      className={`h-[12vh] ${show} bg-[rgb(42,5,114)] fixed left-0 w-full transition-all ease-in-out duration-300`}
    >
      <ContentWrapper className="h-full grid grid-cols-[20%_80%] ">
        <div className="h-full w-40">
          <img className="h-full w-full" src="/data_mingle.png" alt="" />
        </div>
        {isVisible && <CustomizedSteppers />}
      </ContentWrapper>
    </div>
  );
};

export default Header;
