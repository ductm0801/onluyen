"use client";
import Paging from "@/components/Paging";
import { IPayment } from "@/models";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useLoading } from "@/providers/loadingProvider";
import { toast } from "react-toastify";
import { getTransactionHistory } from "@/services";
import { statusEnum } from "@/constants/enum";
import { renderBgColorStatus, renderColorStatus } from "@/constants/utils";

const cols = [
  {
    name: "Mã giao dịch",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Sẩn phẩm",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "thanh toán qua",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Tổng tiền",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Ngày giao dịch ",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Trạng thái",
    className: "px-6 py-4 font-medium  whitespace-nowrap  rounded-e-lg",
  },
];

const TranSactionHistory = () => {
  const [transaction, setTransaction] = useState<IPayment[]>([]);
  const { setLoading } = useLoading();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getTransactionHistory();
      if (res) {
        setTransaction(res.data);
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHistory();
  }, []);

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
          {transaction &&
            transaction.map((a, idx) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={idx}
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div className="text-base font-semibold">{a.description}</div>
                </th>
                <td className="px-6 py-4">
                  {a.paymentType === "Exam" ? "Mã kiểm tra" : ""}
                </td>
                <td className="px-6 py-4">{a.method}</td>
                <td className="px-6 py-4">
                  {a.transactionAmount.toLocaleString("vi-VN")}đ
                </td>
                <td className="px-6 py-4 flex flex-col items-center">
                  <p>{dayjs(a.creationDate).format("DD/MM/YYYY")}</p>
                  <p className="text-xs">
                    {dayjs(a.creationDate).format("HH:mm:ss")}
                  </p>
                </td>
                <td
                  className={`p-2 text-sm leading-normal text-center align-middle shadow-transparent ${renderColorStatus(
                    a.status
                  )}`}
                >
                  <span
                    className={`px-2 text-sm rounded-lg py-1 font-bold text-white bg-gradient-to-tl ${renderBgColorStatus(
                      a.status
                    )}`}
                  >
                    {statusEnum[a.status]}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* <Paging
    pageSize={pageSize}
    currentPage={currentPage}
    totalItems={totalItems}
    totalPages={totalPages}
    setCurrentPage={setCurrentPage}
  /> */}
    </div>
  );
};

export default TranSactionHistory;
