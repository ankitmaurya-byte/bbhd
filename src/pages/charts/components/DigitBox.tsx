import React from "react";

const DigitBox = ({ title, digit }: { title: string; digit: string }) => {
  return (
    <div className="border-2 h-20 border-white bg-[#e9f5db] text-center p-2 rounded-xl flex flex-col justify-center">
      <p className="whitespace-nowrap overflow-hidden text-ellipsis">{title}</p>
      <div className="font-bold text-2xl">{digit}</div>
    </div>
  );
};

export default DigitBox;
