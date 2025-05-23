"use client";
import ModalCreateExamBank from "@/components/ModalCreateExamBank";
import Paging from "@/components/Paging";
import { IExamBank } from "@/models";
import { useAuth } from "@/providers/authProvider";
import { useLoading } from "@/providers/loadingProvider";
import {
  deleteExamBank,
  getExamBank,
  getSubject,
  getUniversity,
} from "@/services";
import { Modal, Select } from "antd";
import _ from "lodash";
import { useRouter } from "next/navigation";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
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
    name: "Tổng số đề",
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
  const router = useRouter();
  const [uni, setUni] = useState<any[]>([]);
  const [subject, setSubject] = useState<any[]>([]);
  const { user } = useAuth();
  const [filter, setFilter] = useState({
    universityId: "",
    subjectId: "",
    searchTerm: "",
  });

  const [confirm, setConfirm] = useState(false);
  const [examBankId, setExamBankId] = useState("");
  const handleDeleteExamBank = async () => {
    try {
      setLoading(true);
      await deleteExamBank(examBankId);
      setConfirm(false);
      setExamBankId("");
      toast.success("Xóa ngân hàng đề thành công!");
      fetchExamBank();
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message);
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
      const res = await getExamBank(currentPage, pageSize, filter);
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
  }, [currentPage, filter]);
  const fetchUniversity = async () => {
    try {
      setLoading(true);
      const res = await getUniversity();
      setUni(res.data);
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchSubject = async () => {
    try {
      setLoading(true);
      const res = await getSubject();
      setSubject(res.data);
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUniversity();
    fetchSubject();
  }, []);
  useEffect(() => {
    setCurrentPage(0);
  }, [filter]);

  if (!uni || !subject) return null;
  const uniOptionss = uni.map((a) => ({
    label: a.universityName,
    value: a.id,
  }));
  const subjectOptions = subject.map((a) => ({
    label: a.subjectName,
    value: a.id,
  }));
  const handleSearch = useCallback(
    _.debounce((value) => {
      setFilter((prev) => ({ ...prev, searchTerm: value }));
    }, 1000),
    []
  );

  return (
    <div className="relative overflow-x-auto">
      <div className="flex justify-between  items-center  flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        <div
          className="bg-[#ffc022] rounded-lg px-3 py-2 cursor-pointer"
          onClick={() => setCreate(true)}
        >
          Tạo ngân hàng đề mới
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 w-full mb-4">
        <Select
          options={uniOptionss}
          placeholder="Lọc theo trường đại học"
          onChange={(value) =>
            setFilter((prev) => ({ ...prev, universityId: value }))
          }
          allowClear
          size="large"
        />
        <Select
          options={subjectOptions}
          placeholder="Lọc theo môn học"
          onChange={(value) =>
            setFilter((prev) => ({ ...prev, subjectId: value }))
          }
          allowClear
          size="large"
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
                  <td className="px-6 py-4">{a.numberOfTests} đề</td>
                  <td className="px-6 py-4">{a.subjectName}</td>

                  <td className="px-6 py-4 flex items-center">
                    <div
                      className="font-medium whitespace-nowrap text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                      onClick={() =>
                        router.push(`/exammanager/bank-test/${a.id}`)
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
          Bạn có chắc muốn xóa bộ câu hỏi này?
        </Modal>
      )}
    </div>
  );
};

export default TestBank;
