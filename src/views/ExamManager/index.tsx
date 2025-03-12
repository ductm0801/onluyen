"use client";
import Paging from "@/components/Paging";
import { statusEnum } from "@/constants/enum";
import { ITest } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getExamList } from "@/services";
import dayjs from "dayjs";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const cols = [
  {
    name: "Tên kì thi",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  //   {
  //     name: "Mô tả",
  //     className:
  //       "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  //   },
  {
    name: "Số lần miễn phí",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Môn học",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Giá",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Ngân hàng đề",
    className: "px-6 py-4 font-medium  whitespace-nowrap  rounded-e-lg",
  },
];

const ExamManager = () => {
  const [exam, setExam] = useState<ITest[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { setLoading } = useLoading();
  const [filter, setFilter] = useState({ searchTerm: "" });
  const [create, setCreate] = useState(false);
  const fetchExam = async () => {
    try {
      setLoading(true);
      const res = await getExamList(currentPage, pageSize, filter);
      if (res) {
        setExam(res.data.items);
        setTotalItems(res.data.totalItemsCount);
        setTotalPages(res.data.totalPagesCount);
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = useCallback(
    _.debounce((value) => {
      setFilter((prev) => ({ ...prev, searchTerm: value }));
    }, 1000),
    []
  );
  useEffect(() => {
    fetchExam();
  }, [currentPage, pageSize, filter]);
  return (
    <div className="relative overflow-x-auto">
      <div className="flex justify-between  items-center  flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        <div
          className="bg-[#ffc022] rounded-lg px-3 py-2 cursor-pointer"
          onClick={() => setCreate(true)}
        >
          Tạo kì thi
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search-users"
            className="block p-2 ps-10 text-sm focus:ring-0 focus:outline-none text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
            placeholder="Tìm kiếm"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
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
          {exam &&
            exam.map((a, idx) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={idx}
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div className="text-base font-semibold">{a.examName}</div>
                </th>
                {/* <td className="px-6 py-4">{a.description}</td> */}
                <td
                  className={`p-2 text-sm leading-normal text-center align-middle shadow-transparent `}
                >
                  <p className="text-xs">{a.freeAttempts} lần</p>
                </td>
                <td className="px-6 py-4">{a.subjectName}</td>
                <td className="px-6 py-4">
                  {a.price.toLocaleString("vi-VN")}đ
                </td>
                <td className="px-6 py-4 flex flex-col items-center">
                  <p>{a.testBankName}</p>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Paging
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ExamManager;
