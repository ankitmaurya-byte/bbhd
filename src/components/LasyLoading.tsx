import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
const Img = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) => {
  return (
    <LazyLoadImage
      className={className || ""}
      alt={alt || ""}
      // style={{ filters: "blur(5px)" }}
      src={src}
    />
  );
};
export default Img;
