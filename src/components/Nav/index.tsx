"use client";
import { IMAGES } from "@/constants/images";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Trang chủ", icon: IMAGES.house, href: "/" },
  { label: "Lớp học trực tuyến", icon: IMAGES.school, href: "/calendar" },
  { label: "Tự học", icon: IMAGES.book, href: "", subItem: [] },
  { label: "Ôn luyện plus", icon: IMAGES.earth, href: "/question" },
];

const Nav = () => {
  const pathName = usePathname();
  return (
    <div
      className={`${
        pathName === "/login" || pathName === "/test" ? "hidden" : "block"
      } fixed top-0 left-0 bottom-0 bg-[#1244A2] w-[288px] p-8`}
    >
      <div className="flex flex-col gap-6 h-full ">
        <div className="flex items-center gap-4">
          <img src={IMAGES.logo} alt="logo" className="w-12" />
          <div className="font-bold text-[30px] leading-[38px] text-white">
            Ôn luyện
          </div>
        </div>
        <div className="flex flex-col gap-3 h-full">
          {items.map((item) => (
            <div
              className={`flex items-center gap-2 py-2 px-[18px] cursor-pointer text-white ${
                pathName === item.href
                  ? "bg-[#FDB022] rounded-xl "
                  : " bg-transparent"
              }`}
              key={item.label}
            >
              <img src={item.icon} alt="icon" className="w-6" />
              <p className="text-base">{item.label}</p>
            </div>
          ))}
          <Link href="/login" className="text-base text-white mt-auto">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Nav;
