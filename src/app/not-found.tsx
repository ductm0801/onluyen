import { IMAGES } from "@/constants/images";
import Link from "next/link";
import React from "react";

const notFound = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <img src={IMAGES.notFound} />
      <p className="text-2xl font-bold text-center">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
        <br /> Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
      </p>
      <Link
        href="/student/home"
        className="text-center bg-[#1244A2] text-white w-fit px-4 font-bold  py-3  rounded-xl"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
};

export default notFound;
