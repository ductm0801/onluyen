"use client";
import ModalCreateExam from "@/components/ModalCreateExam";
import Paging from "@/components/Paging";
import { examEnum, pendingExamEnum } from "@/constants/enum";
import { IMAGES } from "@/constants/images";
import { IAccount, IExam } from "@/models";
import { useAuth } from "@/providers/authProvider";
import { useLoading } from "@/providers/loadingProvider";
import { deleteExam, getExam } from "@/services";
import { Modal, Select } from "antd";
import _ from "lodash";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
const cols = [
  {
    name: "Tiêu đề",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Thời lượng",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },

  {
    name: "Mô tả",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Trạng thái",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Tổng Điểm",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },

  {
    name: "Hành động",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-e-lg",
  },
];

export const renderBgColorStatus = (status: keyof typeof pendingExamEnum) => {
  switch (status) {
    case 1:
      return "from-orange-600 to-orange-300";
    case 2:
      return "from-emerald-600 to-emerald-400";
    case 4:
      return "from-red-600 to-red-300";
    case 3:
      return "from-red-600 to-red-400";
    case 0:
      return "from-slate-600 to-slate-300";
    default:
      return "from-emerald-500 to-teal-400";
  }
};
const statusOptions = [
  { label: pendingExamEnum[0], value: 0 },
  { label: pendingExamEnum[1], value: 1 },
  { label: pendingExamEnum[2], value: 2 },
  { label: pendingExamEnum[3], value: 3 },
  { label: pendingExamEnum[4], value: 4 },
];

const Exam = () => {
  const [exam, setExam] = useState<IExam[]>([]);
  const { setLoading } = useLoading();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [create, setCreate] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const [confirm, setConfirm] = useState(false);
  const [examId, setExamId] = useState("");
  const [filter, setFilter] = useState({
    status: "",
    search: "",
  });
  const handleDeleteExam = async () => {
    try {
      setLoading(true);
      await deleteExam(examId);
      setConfirm(false);
      setExamId("");
      fetchExam();
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirm = (id: string) => {
    setConfirm(true);
    setExamId(id);
  };
  const handleCloseConfirm = () => {
    setConfirm(false);
    setExamId("");
  };
  const fetchExam = async () => {
    try {
      setLoading(true);
      const res = await getExam(currentPage, pageSize, filter);
      if (res) setExam(res.data.items);
      setTotalItems(res.data.totalItemsCount);
      setTotalPages(res.data.totalPageCount);
    } catch (err: any) {
      setLoading(false);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = useCallback(
    _.debounce((value) => {
      setFilter((prev) => ({ ...prev, search: value }));
    }, 1000),
    []
  );
  useEffect(() => {
    fetchExam();
  }, [currentPage, filter]);
  return (
    <div className="relative overflow-x-auto">
      <div className="flex justify-between items-center  flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        <div
          className="bg-[#ffc022] rounded-lg px-3 py-2 cursor-pointer"
          onClick={() => setCreate(true)}
        >
          Tạo đề mới
        </div>
        <div className="flex gap-2 items-center">
          <Select
            placeholder="Trạng thái"
            options={statusOptions}
            allowClear
            onChange={(value) =>
              setFilter({
                ...filter,
                status: value,
              })
            }
          />
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
            exam
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
                    <div className="text-base font-semibold">{a.testName}</div>
                  </th>
                  <td className="px-6 py-4">{a.length} phút</td>
                  {/* <td className="px-6 py-4">{examEnum[a.testType]}</td> */}
                  <td className="px-6 line-clamp-1">{a.description}</td>
                  <td className="px-6 py-4">
                    <p
                      className={`bg-gradient-to-br whitespace-nowrap text-center rounded-lg text-white py-0.5 px-2 ${renderBgColorStatus(
                        a.testApprovalStatus
                      )}`}
                    >
                      {
                        pendingExamEnum[
                          a.testApprovalStatus as keyof typeof pendingExamEnum
                        ]
                      }
                    </p>
                  </td>
                  <td className="px-6 py-4">{a.totalGrade}</td>
                  <td className="px-6 py-4 flex items-center">
                    <div
                      className="font-medium whitespace-nowrap text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                      onClick={() =>
                        router.push(
                          user?.Role === "Instructor"
                            ? `/instructor/exam/${a.id}`
                            : `/exammanager/test/${a.id}`
                        )
                      }
                    >
                      Chi tiết
                    </div>
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
        <ModalCreateExam
          onClose={() => setCreate(false)}
          fetchExam={fetchExam}
        />
      )}
      {confirm && (
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
      )}
    </div>
  );
};

export default Exam;
