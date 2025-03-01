import Exam from "@/views/Exam";
import React from "react";

const cols = [
  {
    name: "Tiêu đề",
    className:
      "min-w-[380px] px-4 py-3 font-bold text-left uppercase border-b text-base",
    style: {},
  },
  {
    name: "Thời lượng",
    className:
      "min-w-[140px] px-4 py-3 font-bold text-center uppercase border-b text-base",
    style: {},
  },
  {
    name: "Tags",
    className:
      "min-w-[180px] px-4 py-3 font-bold text-left uppercase border-b text-base",
    style: {},
  },
  {
    name: "Điểm/Câu",
    className:
      "min-w-[110px] px-4 py-3 font-bold text-center uppercase border-b text-base",
    style: {},
  },
  {
    name: "Câu hỏi",
    className:
      "min-w-[100px] px-4 py-3 font-bold text-center uppercase border-b text-base",
    style: {},
  },
  {
    name: "Trạng thái",
    className: "px-4 py-3 font-bold text-center uppercase border-b text-base",
    style: {},
  },
  {
    name: "Ngày tạo",
    className: "px-4 py-3 font-bold text-center uppercase border-b text-base",
    style: {},
  },
  {
    name: "Hoạt động",
    className: "px-4 py-3 font-bold text-center uppercase border-b text-base",
    style: {},
  },
];

const ExamPage = () => {
  return <Exam />;
};

export default ExamPage;
