import { IMAGES } from "@/constants/images";
import React from "react";
type props = {
  text: string;
  textHover: string;
  onClick?: () => void;
};

const CustomButton: React.FC<props> = ({ text, textHover, onClick }) => {
  return (
    <div
      className="flex cursor-pointer  overflow-hidden transition-all duration-500 ease-linear group relative items-center gap-2 bg-[#FDB022] rounded-full py-2 px-3"
      onClick={onClick}
    >
      <p className=" absolute animate-butonNoHover group-hover:animate-butonHover">
        {textHover}
      </p>
      <p className=" transition-all duration-500 ease-linear animate-butonNoHover2  group-hover:animate-buttonHover2">
        {text}
      </p>

      <div className="bg-[#1244A2] w-4 aspect-square rounded-full overflow-hidden">
        <img
          src={IMAGES.arrowRight}
          alt="arrow"
          className="-translate-x-[100%] group-hover:translate-x-0 transition-all duration-500 ease-linear"
        />
      </div>
    </div>
  );
};

export default CustomButton;
