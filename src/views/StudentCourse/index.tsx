"use client";
import Paging from "@/components/Paging";
import { IMAGES } from "@/constants/images";
import { ICourse } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getCourseByStudent } from "@/services";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const StudentCourse = () => {
  const { setLoading } = useLoading();
  const params = useParams();
  const [course, setCourse] = useState<ICourse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
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
      <div className="grid grid-cols-4">
        {course.map((c) => (
          <div key={c.courseId} className="flex flex-col gap-6 items-start">
            <img
              src={c.imageUrl}
              alt={`img-${c.courseId}`}
              className="rounded-2xl"
            />
            <div>
              <h2 className="text-[#101828] text-[20px] font-bold">
                {c.title}
              </h2>
              <p className="text-[#2E90FA] text-lg">{c.instructorName}</p>
            </div>
          </div>
        ))}
      </div>
      <Paging
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
        totalPages={totalPages}
      />
    </div>
  );
};

export default StudentCourse;
