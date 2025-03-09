"use client";
import { IMAGES } from "@/constants/images";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const menu = [
  {
    title: "Về chúng tôi",
    href: "#ve-chung-toi",
  },
  {
    title: "Khoá học",
    href: "#khoa-hoc",
  },
  {
    title: "Giảng viên",
    href: "#giang-vien",
  },
];
const items = [
  IMAGES.about1,
  IMAGES.about2,
  IMAGES.about3,
  IMAGES.about4,
  IMAGES.about5,
  IMAGES.about6,
];

const Intro = () => {
  const [positions, setPositions] = useState<number[]>(items.map((_, i) => i));
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prevPositions) => {
        const newPositions = [...prevPositions];
        const last = newPositions.pop();
        if (last !== undefined) {
          newPositions.unshift(last);
        }
        return newPositions;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 border-b border-[#A4A4A4] bg-white z-20">
        <div className="flex justify-between items-center max-w-[1300px] py-8 mx-auto">
          <div className="flex items-center gap-2">
            <img src={IMAGES.logo} alt="logo" />
            <h1 className="text-3xl font-bold text-[#2E90FA] ">Ôn luyện</h1>
          </div>
          <div className="flex gap-8 border border-[#A4A4A4] rounded-full py-6 px-8">
            {menu.map((m, index) => (
              <Link
                key={index}
                href={m.href}
                className="text-black hover:text-[#1244A2]"
              >
                {m.title}
              </Link>
            ))}
          </div>
          <Link
            href="/login"
            className="text-white bg-[#1244A2] flex items-center gap-2 py-[10px] px-[14px] rounded-md"
          >
            Đăng nhập
            <svg
              width="8"
              height="12"
              viewBox="0 0 8 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 11L6.5 6L1.5 1"
                stroke="white"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
      <div className=" pt-[160px]">
        <div className="bg-welcome aspect-[1216/604] max-w-[1300px] mx-auto bg-center bg-no-repeat flex items-center justify-between px-16">
          <div className="flex flex-col gap-6">
            <p className="text-[60px] text-white">Chào mừng đến với Ôn Luyện</p>
            <p className="text-white max-w-lg">
              Chào mừng bạn đến với nền tảng ôn luyện chuyên sâu dành cho kỳ thi
              năng lực Việt Nam!
            </p>
          </div>
          <img src={IMAGES.object} alt="object" />
        </div>
        <div
          id="ve-chung-toi"
          className="bg-aboutus bg-no-repeat bg-cover w-full py-16 gap-4"
        >
          <div className="flex flex-col items-center justify-center  relative">
            <p className="text-[#2E90FA] font-bold text-[60px]">Về chúng tôi</p>
            <p className="max-w-xl text-center">
              {" "}
              Chúng tôi cung cấp hệ thống bài giảng, bộ đề thi thử bám sát cấu
              trúc đề thi chính thức, cùng kho tài liệu phong phú giúp bạn nắm
              vững kiến thức và nâng cao kỹ năng làm bài.
            </p>
            <img
              src={IMAGES.courseBg}
              alt="bg"
              className="cursor-pointer pt-12"
              onClick={() => setIsActive((prev) => !prev)}
            />
            <div className="flex items-center justify-center pointer-events-none ">
              {items.map((item, index) => {
                const posIndex = positions[index];
                const theta = ((2 * Math.PI) / items.length) * posIndex;
                const y = 230 * Math.cos(theta);
                const x = 500 * Math.sin(theta);
                return (
                  <img
                    key={index}
                    src={item}
                    alt={`${index}`}
                    className={`${
                      isActive ? "opacity-100" : " opacity-0"
                    } absolute top-[55%] transition-all duration-1000 ease-in-out`}
                    style={{
                      transform: isActive
                        ? `translate3d(${x}px, ${y}px, 0px)`
                        : `translate3d(0px, 0px, 0px)`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div id="course" className="max-w-[1300px] mx-auto">
          <p className="text-[#2E90FA] font-bold text-[60px]">Các khoá học</p>
          <div className="flex items-end justify-between">
            <p className="max-w-xl text-start">
              {" "}
              Với giao diện trực quan, lộ trình học tập cá nhân hóa và sự hỗ trợ
              từ đội ngũ giảng viên giàu kinh nghiệm, chúng tôi cam kết đồng
              hành cùng bạn trên hành trình chinh phục kỳ thi quan trọng này.
              Hãy bắt đầu luyện tập ngay hôm nay để đạt kết quả tốt nhất!
            </p>
            <div className="text-white bg-[#1244A2] flex items-center gap-2 py-[10px] px-[14px] rounded-md">
              Xem thêm
              <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 11L6.5 6L1.5 1"
                  stroke="white"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
