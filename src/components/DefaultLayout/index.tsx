"use client";
import { IMAGES } from "@/constants/images";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Nav from "../Nav";
import { menus } from "@/constants/menu";
import { useAuth } from "@/providers/authProvider";
import { useTheme } from "@/providers/themeProvider";
import { Moon, Sun } from "lucide-react";
import path from "path";
import { Avatar, Form } from "antd";
import { useLoading } from "@/providers/loadingProvider";
import { getChat, sendMessage } from "@/services";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";

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
  const [openChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const params = useParams();
  const [form] = Form.useForm();

  const { setLoading } = useLoading();

  const sliderRef = useRef<any>();
  const fetchChat = async () => {
    try {
      // const res = await getChat(params.id);
      // if (res) setMessages(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    onSnapshot(collection(db, "chats"), (snapshot) => {
      fetchChat();
    });
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      await sendMessage({ text: values.text });
    } catch (err) {
      console.log(err);
    } finally {
      form.resetFields();
    }
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const router = useRouter();

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
          !user || pathName === "/" || pathName === "/login"
            ? ""
            : "xl:ml-[288px]"
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
                        <div
                          className="font-semibold text-white text-lg"
                          onClick={() => toggleDropDown()}
                        >
                          {user?.fullName}
                        </div>

                        <Avatar
                          className="border-2 border-white w-[38px] h-[38px]"
                          src={user?.imageUrl || IMAGES.defaultAvatar}
                        />

                        <div
                          className={`${
                            open ? "max-h-[300px]" : "max-h-0"
                          } transition-all overflow-hidden min-w-[150px] duration-300 ease-in-out absolute top-10 right-0 w-full`}
                        >
                          <div className="flex flex-col gap-1 bg-white rounded-xl p-2">
                            <button
                              className="bg-white rounded-[10px] border border-gray-300 py-2 text-black w-full flex items-center justify-center cursor-pointer"
                              onClick={() => router.push("/profile")}
                            >
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
              : "xl:max-w-[70vw] xl:px-0 px-4 py-8 mx-auto overflow-visible"
          }
        >
          {children}
        </div>
      </div>

      <div
        className={
          user?.Role !== "Student" ||
          pathName.startsWith("/instructor-detail") ||
          pathName === "/login" ||
          pathName === "/student/message"
            ? "hidden"
            : ""
        }
      >
        {openChat ? (
          <div className="w-[400px] aspect-[3/2] flex flex-col rounded-t-lg bg-white border fixed bottom-0 right-10 ">
            <div className="flex justify-between items-center p-4 border-b bg-blue-600 text-white rounded-t-lg">
              <div>Đặt câu hỏi cho tư vấn</div>
              <div
                onClick={() => setOpenChat(false)}
                className="cursor-pointer"
              >
                &times;
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2 overflow-y-auto h-[300px]">
              {messages.map((m, index) =>
                m.sender === user?.UserId ? (
                  <div className="flex justify-end mb-4">
                    <div className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                      {m?.text}
                    </div>
                    <img
                      src={IMAGES.defaultAvatar}
                      className="object-cover h-8 w-8 rounded-full"
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="flex justify-start mb-4">
                    <img
                      src={IMAGES.defaultAvatar}
                      className="object-cover h-8 w-8 rounded-full"
                      alt=""
                    />
                    <div className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                      {m?.text}
                    </div>
                  </div>
                )
              )}
              <div ref={messagesEndRef} />
            </div>

            <Form
              form={form}
              onFinish={handleSubmit}
              className="flex justify-between gap-2 mt-auto p-4 border-t"
            >
              <Form.Item noStyle name="text">
                <input
                  type="text"
                  placeholder="Nhập nội dung chat"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </Form.Item>
              <Form.Item noStyle>
                <button
                  className="text-white bg-blue-600 border px-3 rounded-lg"
                  type="submit"
                >
                  Gửi
                </button>
              </Form.Item>
            </Form>
          </div>
        ) : (
          <img
            src={IMAGES.chatIcon}
            alt="chat"
            className="fixed bottom-10 right-10 w-[40px]"
            onClick={() => setOpenChat(true)}
          />
        )}
      </div>
    </>
  );
};

export default DefaultLayout;
