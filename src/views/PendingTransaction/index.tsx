"use client";
import Paging from "@/components/Paging";
import { statusEnum } from "@/constants/enum";
import { useLoading } from "@/providers/loadingProvider";
import { adminUpdatePendingTransaction, getTransactionList } from "@/services";
import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const cols = [
  {
    name: "Người yêu cầu",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Số tiền",
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
export const renderBgColorStatus = (status: any) => {
  switch (status) {
    case 1:
      return "from-orange-600 to-orange-300";
    case 2:
      return "from-emerald-600 to-emerald-400";
    case 4:
      return "from-red-600 to-red-300";
    case 3:
      return "from-emerald-600 to-teal-400";
    case 0:
      return "from-slate-600 to-slate-300";
    default:
      return "from-emerald-500 to-teal-400";
  }
};
const PendingTransaction = () => {
  const [transaction, setTransaction] = useState([]);
  const { setLoading } = useLoading();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const res = await getTransactionList(currentPage, pageSize);
      setTransaction(res.data.items);
      setTotalItems(res.data.totalItemsCount);
      setTotalPages(res.data.totalPageCount);
    } catch (err) {
      setLoading(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTransaction();
  }, [currentPage]);

  const handleUpdateTransactionStatus = (
    status: number,
    id: string,
    amount: number
  ) => {
    Modal.confirm({
      title: "Xác nhận duyệt giao dịch?",
      content: "Bạn có chắc chắn muốn cập nhật trạng thái giao dịch này không?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setLoading(true);
          await adminUpdatePendingTransaction(id, status, amount);
          toast.success("Cập nhật trạng thái thành công");
        } catch (e: any) {
          toast.error(e.response.data.message);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className="relative overflow-x-auto">
      <div className="flex justify-between items-center  flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
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
            transaction.map((a: any, idx) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={idx}
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div className="text-base font-semibold">{a?.fullName}</div>
                </th>
                <td className="px-6 py-4">
                  {a.amount.toLocaleString("vi-VN")}đ
                </td>
                <td className="px-6 py-4">
                  {statusEnum[a.status as keyof typeof statusEnum] ||
                    "Unknown Status"}
                </td>

                <td className="px-6 py-4 flex items-center">
                  <div
                    className="font-medium whitespace-nowrap text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                    onClick={() =>
                      handleUpdateTransactionStatus(3, a?.id, a.amount)
                    }
                  >
                    Duyệt
                  </div>
                  <div
                    className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer ms-3"
                    onClick={() =>
                      handleUpdateTransactionStatus(4, a?.id, a.amount)
                    }
                  >
                    Từ chối
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
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      {/* {create && (
    <ModalCreateExam
      onClose={() => setCreate(false)}
      fetchExam={fetchExam}
    />
  )} */}
      {/* {confirm && (
        <Modal
          title="Xóa đề"
          open={confirm}
          onOk={handleDeleteExam}
          onCancel={handleCloseConfirm}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          Bạn có chắc muốn xóa đề này?
        </Modal>
      )} */}
    </div>
  );
};

export default PendingTransaction;
