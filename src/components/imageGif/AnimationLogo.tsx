import React from "react";

type Props = {};

const AnimationLogo1 = (props: Props) => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <img
        className="h-1/2 w-1/3  transform -rotate-[59deg] ml-[13%]"
        src="/gif/07eb5016af.gif"
        alt="Product Image"
      />
      <img
        className="h-1/2 w-3/4  z-10 -mt-[25%]"
        src="/gif/07ba2e6363.gif"
        alt="Product Image"
      />
    </div>
  );
};

const AnimationLogo2 = (props: Props) => {
  return (
    <div className="relative w-full h-full">
      <img
        className="absolute w-[94%] h-[94%] blur-sm"
        src="/gif/45cb848511.gif"
        alt="Product Image"
      />
      <div className="absolute top-[24%] left-[9%] w-80 h-80 rounded-full overflow-hidden">
        <div className="relative w-full h-full">
          <video
            className="h-full  w-full object-cover"
            src="/video/069cb969b5.mp4"
            autoPlay
            loop
            muted
          ></video>
          <div className="absolute top-0 right-0 h-full w-1/3 blur-xl bg-gradient-to-r from-transparent to-black/50 mix-blend-multiply"></div>
        </div>
      </div>
    </div>
  );
};
const AnimationLogo3 = (props: Props) => {
  return (
    <div className="absolute h-full w-full flex flex-col justify-center items-center">
      <img
        className="h-1/2 w-1/3  transform -rotate-[59deg] ml-[13%]"
        src="/gif/094501087b.gif"
        alt="Product Image"
      />
      <img
        className="h-1/2 w-3/4  -mt-[25%]"
        src="/gif/07ba2e6363.gif"
        alt="Product Image"
      />
    </div>
  );
};
const AnimationLogo4 = (props: Props) => {
  return (
    <div className=" flex flex-col justify-center items-center">
      <img
        className="h-1/2 w-1/3  transform -rotate-[59deg] ml-[13%]"
        src="/gif/094501087b.gif"
        alt="Product Image"
      />
      {/* <img
        className="h-1/2 w-3/4  -mt-[25%]"
        src="/gif/1b0d7efe92.gif"
        alt="Product Image"
      /> */}
    </div>
  );
};
export { AnimationLogo1, AnimationLogo3, AnimationLogo4, AnimationLogo2 };
