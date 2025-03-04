"use client";
import ModalCreateExamBank from "@/components/ModalCreateExamBank";
import Paging from "@/components/Paging";
import { IExamBank } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { deleteExamBank, getExamBank } from "@/services";
import { Modal } from "antd";
import React, { useEffect, useState } from "react";
const cols = [
  {
    name: "Tên",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Miêu tả",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Môn học",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Hành động",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-e-lg",
  },
];

const TestBank = () => {
  const [examBank, setExamBank] = useState<IExamBank[]>([]);
  const [pageSize, setPageSize] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [create, setCreate] = useState(false);
  const { setLoading } = useLoading();

  const [confirm, setConfirm] = useState(false);
  const [examBankId, setExamBankId] = useState("");
  const handleDeleteExamBank = async () => {
    try {
      setLoading(true);
      await deleteExamBank(examBankId);
      setConfirm(false);
      setExamBankId("");
      fetchExamBank();
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirm = (id: string) => {
    setConfirm(true);
    setExamBankId(id);
  };
  const handleCloseConfirm = () => {
    setConfirm(false);
    setExamBankId("");
  };

  const fetchExamBank = async () => {
    try {
      setLoading(true);
      const res = await getExamBank(currentPage, pageSize);
      if (res) setExamBank(res.data.items);
      setPageSize(res.data.pageSize);
      setTotalItems(res.data.totalItemsCount);
      setTotalPages(res.data.totalPageCount);
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExamBank();
  }, [currentPage]);
  return (
    <div className="relative overflow-x-auto">
      <div className="flex justify-between  items-center  flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        <div
          className="bg-[#ffc022] rounded-lg px-3 py-2 cursor-pointer"
          onClick={() => setCreate(true)}
        >
          Tạo ngân hàng đề mới
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
          {examBank &&
            examBank
              .filter((a) => !a.isDeleted)
              .map((a, idx) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  key={idx}
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {/* <img
                    className="w-10 h-10 rounded-full"
                    src={a.imageUrl || IMAGES.defaultMale}
                    alt="avatar"
                  /> */}

                    <div className="text-base font-semibold">
                      {a.testBankName}
                    </div>
                  </th>
                  <td className="px-6 py-4">{a.description}</td>
                  {/* <td className="px-6 py-4">{a.phoneNumber}</td> */}
                  <td className="px-6 py-4">{a.subjectName}</td>

                  <td className="px-6 py-4">
                    {/* <div className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
                Sửa
              </div> */}
                    <div
                      className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer ms-3"
                      onClick={() => handleOpenConfirm(a.id)}
                    >
                      Xóa
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
      {create && (
        <ModalCreateExamBank
          onClose={() => setCreate(false)}
          fetchExamBank={fetchExamBank}
        />
      )}
      {confirm && (
        <Modal
          title="Xóa câu hỏi"
          open={confirm}
          onOk={handleDeleteExamBank}
          onCancel={handleCloseConfirm}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          Bạn có chắc muốn xóa câu hỏi này?
        </Modal>
      )}
    </div>
  );
};

export default TestBank;
