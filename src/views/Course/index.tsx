"use client";
import { Subject } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getSubject } from "@/services";
import { useEffect, useState } from "react";

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

  const fetchCourse = async () => {
    try {
      setLoading(true);

      const response = await getSubject();
      if (response) setCourses(response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCourse();
  }, []);

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
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {courses.subjectName}
                </th>
                <td className="px-6 py-4">{courses.subjectDescription}</td>
                <td className="flex items-center px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
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
    </div>
  );
};

export default Course;
