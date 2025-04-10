"use client";
import Paging from "@/components/Paging";
import { IMAGES } from "@/constants/images";
import { ICourse } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getCourseByStudent } from "@/services";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const StudentCourse = () => {
  const { setLoading } = useLoading();
  const params = useParams();
  const [course, setCourse] = useState<ICourse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();
  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await getCourseByStudent(currentPage, pageSize, params.id);
      setCourse(res.data.items);
      setTotalItems(res.data.totalItemsCount);
      setTotalPages(res.data.totalPageCount);
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCourse();
  }, [currentPage]);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl text-[#1244A2] font-bold text-center">
        Danh sách khóa học {course[0]?.subjectName}
      </h1>
      {course.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {course.map((c) => (
            <div
              key={c.courseId}
              className="flex flex-col overflow-hidden    group gap-6 items-start cursor-pointer"
              onClick={() => router.push(`/course/${c.courseId}`)}
            >
              <div className="w-full h-full relative  rounded-2xl overflow-hidden">
                <img
                  src={c.imageUrl}
                  alt={`img-${c.courseId}`}
                  className="rounded-2xl  group-hover:scale-110 transition-all duration-300 w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-[#101828] group-hover:text-blue-500 transition-all duration-300 text-[20px] font-bold line-clamp-1">
                  {c.title}
                </h2>
                <p className="text-[#2E90FA] group-hover:text-red-500 transition-all duration-300 text-lg">
                  {c.instructorName}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center justify-center h-full w-full py-4">
          <img src={IMAGES.courseEmpty} alt="empty" className="w-40" />
          <div className="flex flex-col gap-2 items-center">
            <p className="font-bold text-xl text-gray-500">
              Chưa có khoá học nào
            </p>
            <p className="text-sm">Môn học này đang cập nhật thêm khoá học</p>
          </div>
        </div>
      )}
      {course.length > 0 && (
        <Paging
          currentPage={currentPage}
          pageSize={pageSize}
          setCurrentPage={setCurrentPage}
          totalItems={totalItems}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export default StudentCourse;
