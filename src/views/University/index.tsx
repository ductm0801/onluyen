"use client";
import ModalCreateUniversity from "@/components/ModalCreateUniversity";
import ModalUpdateUniversity from "@/components/ModalUpdateUniversity";
import Paging from "@/components/Paging";
import { IMAGES } from "@/constants/images";
import { useLoading } from "@/providers/loadingProvider";
import { deleteUniversity, getUniversityPaging } from "@/services";
import { Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const cols = [
  {
    name: "Tên trường",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
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

const University = () => {
  const [pageSize, setPageSize] = useState(10);
  const [university, setUniversity] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [create, setCreate] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [edit, setEdit] = useState(false);
  const [universityId, setUniversityId] = useState("");
  const { setLoading } = useLoading();
  const detail = useRef<any | null>(null);
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getUniversityPaging(currentPage, pageSize);
      if (res) {
        setUniversity(res.data.items);
        setTotalItems(res.data.totalItemsCount);
        setTotalPages(res.data.totalPageCount);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage]);
  const handleOpenConfirm = (id: string) => {
    setConfirm(true);
    setUniversityId(id);
  };
  const handleCloseConfirm = () => {
    setConfirm(false);
    setUniversityId("");
  };
  const handleOpenEdit = (item: any) => {
    setEdit(true);
    detail.current = item;
  };
  const handleCloseEdit = () => {
    setEdit(false);
    detail.current = null;
  };
  const handleDeleteUniversity = async () => {
    try {
      setLoading(true);
      await deleteUniversity(universityId);
      setConfirm(false);
      setUniversityId("");
      fetchData();
      toast.success("Xóa trường thành công!");
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      setConfirm(false);
      setUniversityId("");
    }
  };

  return (
    <div className="relative overflow-x-auto">
      <div className="flex justify-between  items-center  flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        <div
          className="bg-[#ffc022] rounded-lg px-3 py-2 cursor-pointer"
          onClick={() => setCreate(true)}
        >
          Tạo trường mới
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
            // onChange={(e) => handleSearch(e.target.value)}
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
          {university &&
            university.map((a, idx) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={a.userId}
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    className="w-10 h-10"
                    src={a.imageUrl || IMAGES.universityIcon}
                    alt="avatar"
                  />
                  <div className="ps-3">
                    <div className="text-base font-semibold">
                      {a.universityName}
                    </div>
                    <div className="font-normal text-gray-500 line-clamp-1">
                      {a.universityDescription}
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  {a.isDeleted ? (
                    <div className="flex items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>{" "}
                      Tạm ngưng
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>{" "}
                      Đang hoạt động
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="font-medium text-blue-600 whitespace-nowrap dark:text-blue-500 hover:underline cursor-pointer"
                      onClick={() => handleOpenEdit(a)}
                    >
                      Sửa
                    </div>
                    <div
                      className="font-medium text-red-600 whitespace-nowrap dark:text-blue-500 hover:underline cursor-pointer"
                      onClick={() => handleOpenConfirm(a.id)}
                    >
                      Xóa
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
      {confirm && (
        <Modal
          title="Xác nhận xóa"
          open={confirm}
          onOk={handleDeleteUniversity}
          onCancel={handleCloseConfirm}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          Bạn có chắc muốn xóa trường này?
        </Modal>
      )}
      {create && (
        <ModalCreateUniversity
          onClose={() => setCreate(false)}
          fetchData={fetchData}
        />
      )}
      {edit && (
        <ModalUpdateUniversity
          onClose={handleCloseEdit}
          fetchData={fetchData}
          data={detail.current}
        />
      )}
    </div>
  );
};

export default University;
