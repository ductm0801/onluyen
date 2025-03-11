"use client";
import ModalCreateCourse from "@/components/ModalCreateCourse";
import ModalUpdateCourse from "@/components/ModalUpdateCourse";
import Paging from "@/components/Paging";
import { IMAGES } from "@/constants/images";
import { ICourse } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getCourse } from "@/services";
import { Image } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const cols = [
  {
    name: "Tên khoá học",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Mô tả",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Giá bán",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Trạng thái",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  //   {
  //     name: "Ngày tạo",
  //     className:
  //       "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  //   },
  {
    name: "Hành động",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-e-lg",
  },
];

const InstructorCourse = () => {
  const [course, setCourse] = useState<ICourse[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [create, setCreate] = useState(false);
  const { setLoading } = useLoading();
  const [update, setUpdate] = useState(false);
  const detail = useRef<ICourse | null>(null);
  const router = useRouter();

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await getCourse(currentPage, pageSize);
      if (res) {
        setCourse(res.data.items);
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
    fetchCourse();
  }, [currentPage]);

  const handleOpenUpdate = (item: ICourse) => {
    setUpdate(true);
    detail.current = item;
  };
  const handleCloseUpdate = () => {
    setUpdate(false);
    detail.current = null;
  };
  return (
    <>
      <div className="relative overflow-x-auto">
        <div className="flex justify-between  items-center  flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
          <div
            className="bg-[#ffc022] rounded-lg px-3 py-2 cursor-pointer"
            onClick={() => setCreate(true)}
          >
            Tạo khoá học
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
            {course &&
              course.map((a, idx) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  key={idx}
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <Image
                      width={100}
                      height={100}
                      src={a.imageUrl || IMAGES.defaultMale}
                      alt="avatar"
                    />
                    <div className="ps-3">
                      <div
                        className="text-base font-semibold hover:text-green-500 cursor-pointer"
                        onClick={() =>
                          router.push(`/instructor/course/${a.courseId}`)
                        }
                      >
                        {a.title}
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{a.description}</td>
                  <td className="px-6 py-4">
                    {a.coursePrice.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="px-6 py-4">{a.courseStatus}</td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                        onClick={() => handleOpenUpdate(a)}
                      >
                        Sửa
                      </div>
                      <div
                        className="font-medium whitespace-nowrap text-red-600 dark:text-red-500 hover:underline cursor-pointer ms-3"
                        // onClick={() => openConfirm(a.id)}
                      >
                        Ẩn khóa học
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
      </div>
      {create && (
        <ModalCreateCourse
          onClose={() => setCreate(false)}
          fetchCourse={fetchCourse}
        />
      )}
      {update && (
        <ModalUpdateCourse
          onClose={() => handleCloseUpdate()}
          fetchCourse={fetchCourse}
          data={detail.current}
        />
      )}
    </>
  );
};

export default InstructorCourse;
