"use client";
import { IMAGES } from "@/constants/images";
import { menus } from "@/constants/menu";
import { useAuth } from "@/providers/authProvider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type props = {
  sidebarOpen: boolean;
  closeSidebar: () => void;
};

const Nav: React.FC<props> = ({ sidebarOpen, closeSidebar }) => {
  const pathName = usePathname();
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<
    { label: string; path: string; icon: string }[]
  >([]);
  console.log(user);

  useEffect(() => {
    if (!user) return;
    setMenuItems(menus[user.Role as keyof typeof menus] || []);
  }, [user, menus]);

  return (
    <div
      className={`${
        pathName === "/login" || pathName === "/test" ? "hidden" : "block"
      } fixed top-0 left-0 bottom-0 bg-[#1244A2] w-[288px] p-8 z-[100] transition-all duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "xl:translate-x-0 -translate-x-[100%]"
      } `}
    >
      <div
        className="absolute top-2 right-4 text-xl font-bold rounded-lg xl:hidden"
        onClick={closeSidebar}
      >
        &times;
      </div>
      <div className="flex flex-col gap-6 h-full ">
        <div className="flex items-center gap-4">
          <img src={IMAGES.logo} alt="logo" className="w-12" />
          <div className="font-bold text-[30px] leading-[38px] text-white">
            Ôn luyện
          </div>
        </div>
        <div className="flex flex-col gap-3 h-full">
          {menuItems.map((item) => (
            <Link
              href={item.path}
              className={`transition-all duration-300 ease-in-out flex items-center gap-2 py-2 px-[18px] cursor-pointer text-white ${
                pathName === item.path
                  ? "bg-[#FDB022] rounded-xl "
                  : " bg-transparent"
              }`}
              key={item.label}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={20}
                height={20}
                className={`transition-all duration-300 ease-out ${
                  pathName === item.path
                    ? "filter brightness-0 invert"
                    : "opacity-50"
                }`}
              />
              <p className="text-base">{item.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Nav;
