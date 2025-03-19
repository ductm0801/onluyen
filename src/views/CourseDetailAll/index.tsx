"use client";
import Paging from "@/components/Paging";
import { IMAGES } from "@/constants/images";
import { ICourse } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getCourseDetail } from "@/services";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CourseDetail = () => {
  const [course, setCourse] = useState<ICourse>();
  const params = useParams();
  const { setLoading } = useLoading();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [active, setActive] = useState(0);
  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const res = await getCourseDetail(params.id);
      if (res) {
        setCourse(res.data);
        setTotalItems(res.data.lessons.totalItemsCount);
        setTotalPages(res.data.lessons.totalPageCount);
      }
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCourseDetail();
  }, [params.id]);
  console.log(course);
  return (
    <div className="grid grid-cols-3 gap-x-8">
      <div className="flex flex-col gap-4 col-span-2">
        <h1 className="text-4xl font-bold">{course?.title}</h1>
        <p className="text-base text-[#344054]">{course?.description}</p>
        <div className="flex items-center gap-2 text-[#667085]">
          <img src={IMAGES.lessonIcon} alt="lesson" />
          Tổng số
          <span className="text-[#101828] font-bold">
            {course?.lessons.items.length}
          </span>{" "}
          bài học
        </div>
        <div className="flex flex-col gap-2 text-[#667085]">
          {course?.lessons.items.map((item, index) => (
            <div
              key={item.lessonId}
              className="flex items-center justify-between gap-2 rounded-2xl border p-6 cursor-pointer"
              onClick={() => setActive(index)}
            >
              <div className="flex flex-col">
                <p className="text-[#101828] font-bold">{item.title}</p>
                <p
                  className={`${
                    active === index ? "max-h-[500px]" : "max-h-0"
                  } overflow-hidden transition-all duration-300 `}
                >
                  {item.description}
                </p>
              </div>
              <img
                src={active === index ? IMAGES.minusIcon : IMAGES.plusIcon}
                alt="icon"
              />
            </div>
          ))}
        </div>
        <Paging
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          totalPages={totalPages}
        />
      </div>
      <div className="flex flex-col gap-3">
        <img
          src={course?.imageUrl}
          alt="images"
          className="aspect-[3/2] object-cover rounded-lg"
        />
        <div className="bg-[#1244A2] text-white rounded-lg text-center py-3 cursor-pointer flex items-center gap-3 justify-center">
          Vào học <img src={IMAGES.arrowRight} alt="right" />
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
