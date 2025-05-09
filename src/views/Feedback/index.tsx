"use client";
import Paging from "@/components/Paging";
import { IMAGES } from "@/constants/images";
import { useLoading } from "@/providers/loadingProvider";
import { getFeedback } from "@/services";
import { Rate } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const cols = [
  {
    name: "Tên người dừng",
    className:
      "px-6 py-4 font-medium min-w-[300px] text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Nội dung",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Khoá học",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Đánh giá",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Ngày tạo",
    className:
      "px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Hành động",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-e-lg",
  },
];

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const { setLoading } = useLoading();
  const [detail, setDetail] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = (item: any) => {
    setDetail(item);
    setIsOpen(true);
  };
  const handleClose = () => {
    setDetail(null);
    setIsOpen(false);
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getFeedback(currentPage, pageSize);
      if (res) setFeedback(res.data.items);
      setTotalItems(res.data.totalItemsCount);
      setTotalPageCount(res.data.totalPageCount);
    } catch (e: any) {
      setLoading(false);
      toast.error(e.response?.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {cols.map((col, idx) => (
              <th scope="col" className={col.className} key={idx}>
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {feedback &&
            feedback.map((a: any, idx) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={idx}
              >
                <th
                  scope="row"
                  className="flex group cursor-pointer items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    className="w-10 spect-square rounded-full object-cover"
                    src={a.imageUrl || IMAGES.defaultAvatar}
                    alt="avatar"
                  />
                  <div className="ps-3">
                    <div className="text-base max-w-[200px] truncate  font-semibold">
                      {a.fullName}
                    </div>
                  </div>
                </th>

                <td className="px-6 py-4">
                  {" "}
                  <div
                    className="font-normal text-gray-500 line-clamp-1"
                    dangerouslySetInnerHTML={{ __html: a.content }}
                  />
                </td>
                <td className="px-6 py-4"> {a.courseName}</td>
                <td className="px-6 py-4">{a.rating} ⭐</td>
                <td className="px-6 py-4 ">
                  <div className="flex flex-col items-center">
                    <p>{moment(a.creationDate).format("DD/MM/YYYY")}</p>
                    <p className="text-xs">
                      {moment(a.creationDate).format("HH:mm:ss")}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                      onClick={() => handleOpen(a)}
                    >
                      Chi tiết
                    </div>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Paging
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        totalPages={totalPageCount}
        setCurrentPage={setCurrentPage}
      />
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={handleClose}
      >
        <div className="bg-white p-4 w-[300px] h-[400px] flex flex-col items-center justify-center rounded-lg relative">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={handleClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex flex-col gap-4 items-center">
            <img
              className="w-10 spect-square rounded-full border object-cover"
              src={detail?.imageUrl || IMAGES.defaultAvatar}
              alt="avatar"
            />
            <Rate disabled value={detail?.rating} />
            <div className="text-base max-w-[200px] truncate  font-semibold">
              {detail?.fullName}
            </div>
            <div className="font-normal text-gray-500 line-clamp-1">
              {detail?.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
