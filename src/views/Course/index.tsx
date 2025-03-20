"use client";
import ModalUpdateSubject from "@/components/ModalUpdateSubject";
import Paging from "@/components/Paging";
import { Subject } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getSubject, getSubjectPaging } from "@/services";
import { useEffect, useRef, useState } from "react";

const cols = [
  {
    name: "Môn học",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Mô tả",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Hành động",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-e-lg",
  },
];

const Course = () => {
  const [courses, setCourses] = useState<Subject[]>([]);
  const { setLoading } = useLoading();
  const [edit, setEdit] = useState(false);
  const detail = useRef<Subject | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const handleOpenEdit = (item: Subject) => {
    setEdit(true);
    detail.current = item;
  };
  const handleCloseEdit = () => {
    setEdit(false);
    detail.current = null;
  };
  const fetchCourse = async () => {
    try {
      setLoading(true);

      const response = await getSubjectPaging(currentPage, pageSize);
      if (response) setCourses(response.data.items);
      setTotalItems(response.data.totalItemsCount);
      setTotalPages(response.data.totalPageCount);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCourse();
  }, [currentPage]);

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {cols.map((col, idx) => (
              <th scope="col" className={col.className} key={idx}>
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {courses &&
            courses.map((courses, idx) => (
              <tr className="bg-white dark:bg-gray-800" key={courses.id}>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2 whitespace-nowrap dark:text-white"
                >
                  <img src={courses.imageUrl} alt="img" /> {courses.subjectName}
                </th>
                <td className="px-6 py-4">{courses.subjectDescription}</td>
                <td className="flex items-center px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={() => handleOpenEdit(courses)}
                  >
                    Sửa
                  </a>
                  <a
                    href="#"
                    className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                  >
                    Xoá
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Paging
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
        totalPages={totalPages}
      />
      {edit && (
        <ModalUpdateSubject
          data={detail.current}
          onClose={handleCloseEdit}
          fetchCourse={fetchCourse}
        />
      )}
    </div>
  );
};

export default Course;
