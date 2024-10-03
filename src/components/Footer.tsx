import React from "react";
import ContentWrapper from "./ContentWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

type Props = {};

const Footer = (props: Props) => {
  return (
    <ContentWrapper>
      <div className="w-full mt-16 flex items-center h-40">
        <div className="flex justify-between w-96 h-24 p-8 border-2 border-solid text-white items-center text-2xl">
          <p>SOCIAL</p>
          <div className="flex gap-8">
            <FontAwesomeIcon icon={faFacebookF} />
            <FontAwesomeIcon icon={faTwitter} />
            <FontAwesomeIcon icon={faInstagram} />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Footer;
