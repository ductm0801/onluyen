"use client";
import React, { useState } from "react";

const cols = [
  {
    name: "Tên khoá học",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Mô tả",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Loại khoá học",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Giá bán",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Trạng thái",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },

  {
    name: "Hành động",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-e-lg",
  },
];

const FeedbackCourse = () => {
  const [fb, setFb] = useState([]);
  return <div>FeedbackCourse</div>;
};

export default FeedbackCourse;
