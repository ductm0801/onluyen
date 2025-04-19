"use client";
import { courseStatusEnum, courseTypeEnum } from "@/constants/enum";
import { ICourse } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getCoursePending } from "@/services";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Paging from "../Paging";
import { IMAGES } from "@/constants/images";

const cols = [
  {
    name: "Tên khóa học",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Người tạo",
    className:
      "px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap dark:text-white",
  },

  {
    name: "Môn học",
    className:
      "px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Loại khóa học",
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
export const renderBgColorStatus = (status: keyof typeof courseStatusEnum) => {
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

const PendingCourse = () => {
  const [pageSize, setPageSize] = useState(10);
  const [course, setCourse] = useState<ICourse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();
  const { setLoading } = useLoading();
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getCoursePending(currentPage, pageSize);
      if (res) {
        setCourse(res.data.items);
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
  }, [currentPage]);
  return (
    <div className="relative overflow-x-auto">
      <div className="flex justify-between  items-center  flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        {/* <div className="relative">
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
</div> */}
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
                key={a.courseId}
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    className="w-16 aspect-square rounded-lg"
                    src={a.imageUrl || IMAGES.instructorDefault}
                    alt="avatar"
                  />
                  <div className="ps-3">
                    <div className="text-base font-semibold">{a.title}</div>
                  </div>
                </th>
                <td className="px-6 py-4 text-center">{a.instructorName}</td>
                <td className="px-6 py-4 text-center">{a.subjectName}</td>
                <td className="px-6 py-4 text-center">
                  {courseTypeEnum[a.courseType as keyof typeof courseTypeEnum]}
                </td>
                <td
                  className={`p-2 text-sm leading-normal text-center align-middle shadow-transparent`}
                >
                  <span
                    className={`px-2 text-sm rounded-lg py-1 font-bold text-white bg-gradient-to-tl ${renderBgColorStatus(
                      a.courseStatus
                    )}`}
                  >
                    {courseStatusEnum[
                      a.courseStatus as keyof typeof courseStatusEnum
                    ] || "Unknown Status"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="font-medium text-blue-600 whitespace-nowrap dark:text-blue-500 hover:underline cursor-pointer"
                      onClick={() =>
                        router.push(`/admin/pending-course/${a.courseId}`)
                      }
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
    </div>
  );
};

export default PendingCourse;
