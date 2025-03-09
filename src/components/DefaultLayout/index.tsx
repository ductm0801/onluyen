"use client";
import { IMAGES } from "@/constants/images";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Nav from "../Nav";
import { menus } from "@/constants/menu";
import { useAuth } from "@/providers/authProvider";
import { useTheme } from "@/providers/themeProvider";
import { Moon, Sun } from "lucide-react";
import path from "path";

type props = {
  children: React.ReactNode;
};

const DefaultLayout: React.FC<props> = ({ children }) => {
  const pathName = usePathname();
  const [isTopHidden, setIsTopHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [label, setLabel] = useState<string | undefined>("");
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleDropDown = () => {
    setOpen(!open);
  };
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY + 10) {
        setIsTopHidden(true);
      } else if (currentScrollY < lastScrollY - 10) {
        setIsTopHidden(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);
  useEffect(() => {
    if (!user) return;

    const role = user.Role as keyof typeof menus;
    if (menus[role]) {
      const label = menus[role].find((item) =>
        pathName.startsWith(item.path)
      )?.label;
      setLabel(label);
      setOpen(false);
    }
  }, [pathName, user]);

  return (
    <>
      <Nav sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <div
        className={
          pathName === "/login" || pathName === "/" ? "" : "xl:ml-[288px]"
        }
      >
        <nav
          className={`${
            pathName === "/login" || pathName === "/" ? "hidden" : "block"
          } flex flex-wrap z-30 items-center justify-between min-h-[84px] top-[10px] px-0 py-2 mx-[10px] xl:mr-[10px] xl:ml-[4px] rounded-2xl lg:flex-nowrap lg:justify-start sticky backdrop-saturate-200 backdrop-blur-2xl bg-[#111c44cc] transform transition-transform duration-300 ease-in-out ${
            isTopHidden ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <div className="flex items-center justify-between w-full sm:px-6 px-4 py-1.5 mx-auto flex-wrap-inherit">
            <nav className="flex flex-row justify-start">
              <ol className="flex flex-wrap list-none p-0 m-0 bg-transparent rounded-md">
                <li
                  id="iconSideBar"
                  className="flex items-center pl-1 pr-4 xl:hidden"
                  onClick={toggleSidebar}
                >
                  <img
                    className="w-[24px] h-[24px]"
                    src={IMAGES.bars}
                    alt="bars"
                  />
                </li>
              </ol>
              <div>
                <h6 className="mb-0 font-bold text-lg !text-white capitalize">
                  {label}
                </h6>
              </div>
            </nav>

            <div className="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto">
              <ul className="flex flex-row justify-end pl-0 mb-0 mt-0 list-none w-full">
                <div className="menu-layout">
                  <div className="flex flex-row items-center gap-[18px] sm:gap-[36px]">
                    <div className="flex flex-row items-center gap-[18px]">
                      {/* <div
                        role="button"
                        onClick={() => navigate('/my-wallet')}
                        className="cursor-pointer">
                        <img src={images.wallet} alt="wallet" />
                      </div> */}
                      <div className="">
                        {" "}
                        <div
                          onClick={toggleTheme}
                          className="p-2 rounded-md bg-gray-200 dark:bg-gray-800"
                        >
                          {theme === "light" ? (
                            <Sun
                              size={20}
                              className="bg-white text-black rounded-full p-0.5"
                            />
                          ) : (
                            <div className="bg-black text-white rounded-full p-0.5">
                              <Moon size={20} color="white" />
                            </div>
                          )}
                        </div>
                      </div>
                      {/* <div>
                        <NotificationMobileComponents />
                      </div> */}
                    </div>
                    {user ? (
                      <div className="flex flex-row gap-[8px] items-center relative group cursor-pointer">
                        <div>
                          <div
                            className="font-semibold text-white text-lg"
                            onClick={() => toggleDropDown()}
                          >
                            {user?.FullName}
                          </div>
                          {/* {user?.avatar ? (
     <Avatar
       className="border-2 border-white w-[38px] h-[38px]"
       src={user?.avatar}
     />
   ) : (
     <Avatar className="border-2 border-white w-[36px] h-[36px]">
       {user?.username?.charAt(0).toUpperCase()}
     </Avatar>
   )} */}
                        </div>
                        <div
                          className={`${
                            open ? "max-h-[300px]" : "max-h-0"
                          } transition-all overflow-hidden min-w-[150px] duration-300 ease-in-out absolute top-10 right-0 w-full`}
                        >
                          <div className="flex flex-col gap-1 bg-white rounded-xl p-2">
                            <button className="bg-white rounded-[10px] border border-gray-300 py-2 text-black w-full flex items-center justify-center cursor-pointer">
                              Hồ sơ
                            </button>

                            <button
                              className="bg-white rounded-[10px] border border-gray-300 py-2 text-black w-full flex items-center justify-center cursor-pointer"
                              onClick={logout}
                            >
                              Đăng xuất
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link href="/login" className="text-white">
                        Đăng nhập
                      </Link>
                    )}
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </nav>
        <div
          className={
            pathName === "/login" || pathName === "/"
              ? ""
              : "max-w-[1020px] py-8 px-4 mx-auto"
          }
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default DefaultLayout;
