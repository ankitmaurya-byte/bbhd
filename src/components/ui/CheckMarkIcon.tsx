import React from "react";

const CheckmarkIcon = ({
  width = 50,
  height = 50,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z"
        fill="#2C3E50" // Dark Blue color
      />
      <path
        d="M9 15L4.5 10.5L3.5 11.5L9 17L21 5L20 4L9 15Z"
        fill="#BDC3C7" // Light Grey color
      />
    </svg>
  );
};

export default CheckmarkIcon;
