"use client";
import Paging from "@/components/Paging";
import { statusEnum } from "@/constants/enum";
import { IMAGES } from "@/constants/images";
import { useLoading } from "@/providers/loadingProvider";
import { getExamCode } from "@/services";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const cols = [
  {
    name: "Mã thi",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Tên bài thi",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center",
  },
  {
    name: "Lượt sử dụng",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center",
  },
  {
    name: "Ngày hết hạn ",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center",
  },
];

const ExamCode = () => {
  const [examCode, setExamCode] = useState<any[]>([]);
  const { setLoading } = useLoading();
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchExamCode = async () => {
    try {
      setLoading(true);
      const res = await getExamCode(currentPage, pageSize);
      setExamCode(res.data.items);
      setTotalItems(res.data.totalItemsCount);
      setTotalPages(res.data.totalPageCount);
    } catch (error) {
      console.error("Error fetching exam code:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExamCode();
  }, [currentPage]);
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Đã sao chép mã thi");
  };
  return (
    <div className="relative overflow-x-auto">
      <div className="flex justify-between  items-center  flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
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
          {examCode &&
            examCode.map((a, idx) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={idx}
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div className="text-base font-semibold flex items-start gap-3">
                    {a.code}
                    <img
                      src={IMAGES.copyIcon}
                      className="w-4 cursor-pointer"
                      alt="copy"
                      onClick={() => handleCopy(a.code)}
                    />
                  </div>
                </th>
                <td className="px-6 py-4 text-center">{a.examName}</td>
                <td className="px-6 py-4 text-center">{a.maxUsage} lần</td>
                <td className="px-6 py-4 flex flex-col items-center">
                  <p>{dayjs(a.creationDate).format("DD/MM/YYYY")}</p>
                  <p className="text-xs">
                    {dayjs(a.creationDate).format("HH:mm:ss")}
                  </p>
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

export default ExamCode;
