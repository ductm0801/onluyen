"use client";
import { usePathname } from "next/navigation";
import React from "react";

type props = {
  children: React.ReactNode;
};

const DefaultLayout: React.FC<props> = ({ children }) => {
  const pathName = usePathname();
  return (
    <div className={pathName === "/login" ? "" : "ml-[288px]"}>
      <div
        className={
          pathName === "/login" ? "" : "max-w-[1020px] py-8 px-4 mx-auto"
        }
      >
        {children}
      </div>
    </div>
  );
};

export default DefaultLayout;
