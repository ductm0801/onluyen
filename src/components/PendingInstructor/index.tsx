"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Paging from "../Paging";
import { useLoading } from "@/providers/loadingProvider";
import _ from "lodash";
import { getInstructorPending, updateInstructorPending } from "@/services";
import { IMAGES } from "@/constants/images";
import { pendingExamEnum } from "@/constants/enum";
import { Image, Modal } from "antd";
import { toast } from "react-toastify";
const cols = [
  {
    name: "Tên giảng viên",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Giới tính",
    className:
      "px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap dark:text-white",
  },

  {
    name: "Môn học",
    className:
      "px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Trạng thái",
    className:
      "px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Hành dộng",
    className: "px-6 py-4 font-medium  whitespace-nowrap  rounded-e-lg",
  },
];
export const renderBgColorStatus = (status: keyof typeof pendingExamEnum) => {
  switch (status) {
    case 1:
      return "from-orange-600 to-orange-300";
    case 2:
      return "from-orange-600 to-orange-300";
    case 4:
      return "from-red-600 to-red-300";
    case 3:
      return "from-emerald-600 to-emerald-400";
    case 0:
      return "from-slate-600 to-slate-300";
    default:
      return "from-emerald-500 to-teal-400";
  }
};
const PendingInstructor = () => {
  const [pageSize, setPageSize] = useState(10);
  const [instructor, setInstructor] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState({ searchTerm: "" });
  const detailRef = useRef<any>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const handleOpenDetail = (items: any) => {
    detailRef.current = items;
    setOpenDetail(true);
  };
  const handleCloseDetail = () => {
    setOpenDetail(false);
    detailRef.current = null;
  };
  const handleSearch = useCallback(
    _.debounce((value) => {
      setFilter((prev) => ({ ...prev, searchTerm: value }));
    }, 1000),
    []
  );
  const { setLoading } = useLoading();
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getInstructorPending();
      if (res) {
        setInstructor(res.data.items);
        setTotalItems(res.data.totalItemsCount);
        setTotalPages(res.data.totalPageCount);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [filter, currentPage]);
  const handleUpdateStatus = async (status: string) => {
    setLoading(true);
    try {
      await updateInstructorPending(detailRef.current.user.id, status);
      toast.success("Cập nhật thành công");
      handleCloseDetail();
      fetchData();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
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
          {instructor &&
            instructor.map((a, idx) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={a.userId}
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={a.user.imageUrl || IMAGES.defaultMale}
                    alt="avatar"
                  />
                  <div className="ps-3">
                    <div className="text-base font-semibold">
                      {a.user.fullName}
                    </div>
                    <div className="font-normal text-gray-500">
                      {a.user.email}
                    </div>
                  </div>
                </th>
                {/* <td className="px-6 py-4">{a.description}</td> */}
                <td
                  className={`p-2 text-sm leading-normal text-center align-middle shadow-transparent `}
                >
                  <p>{a.user.gender === "Male" ? "Nam" : "Nữ"}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  {a.subject.subjectName}
                </td>

                <td
                  className={`p-2 text-sm leading-normal text-center align-middle shadow-transparent`}
                >
                  <span
                    className={`px-2 text-sm rounded-lg py-1 font-bold text-white bg-gradient-to-tl ${renderBgColorStatus(
                      a.user.status
                    )}`}
                  >
                    {pendingExamEnum[
                      a.user.status as keyof typeof pendingExamEnum
                    ] || "Unknown Status"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="font-medium text-blue-600 whitespace-nowrap dark:text-blue-500 hover:underline cursor-pointer"
                      onClick={() => handleOpenDetail(a)}
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
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      {openDetail && (
        <Modal
          open={openDetail}
          onCancel={handleCloseDetail}
          footer={null}
          title="Chi tiết giảng viên"
        >
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px]">
            <div className="flex items-center gap-4">
              <img
                className="w-10 h-10 rounded-full"
                src={detailRef.current.user.imageUrl || IMAGES.defaultMale}
                alt="avatar"
              />
              <div className="flex flex-col gap-2">
                <p className="text-lg font-semibold">
                  {detailRef.current.user.fullName}
                </p>
                <p>{detailRef.current.user.email}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold">Thông tin môn học</p>
              <p>Tên môn học: {detailRef.current.subject.subjectName}</p>
              <p>Mô tả môn học: {detailRef.current.subject.description}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold">Thông tin giảng viên</p>
              <p className="flex flex-col text-lg">
                Chứng chỉ:{" "}
                <Image
                  width={200}
                  height={300}
                  src={detailRef.current.instructor.certificate}
                />
              </p>
              <p className="text-lg">
                Số năm kinh nghiệm:{" "}
                {detailRef.current.instructor.yearOfExperience}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-end mt-4">
            <button
              onClick={() => handleUpdateStatus("Active")}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Duyệt
            </button>
            <button
              onClick={() => handleUpdateStatus("Denied")}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Từ chối
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PendingInstructor;
