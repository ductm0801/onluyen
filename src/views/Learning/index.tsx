"use client";
import { IMAGES } from "@/constants/images";
import { ICourse, ILesson } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getCourseDetail, getCourseLearning } from "@/services";
import "plyr-react/plyr.css";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Paging from "@/components/Paging";
const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), {
  ssr: false,
});

const Learning = () => {
  const [course, setCourse] = useState<ICourse>();
  const params = useParams();
  const [isSaveProgress, setIsSaveProgress] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const videoPlayerRef = useRef<any>(null);
  const [activeLesson, setActiveLesson] = useState<ILesson | undefined>(
    undefined
  );

  const { setLoading } = useLoading();
  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const res = await getCourseLearning(params.id, currentPage, pageSize);
      setTotalItems(res.data.lessons.totalItemsCount);
      setTotalPages(res.data.lessons.totalPageCount);
      if (res) {
        setCourse(res.data);
        setActiveLesson(
          res.data.lessons.items[res.data.highestCompletedLessonOrder]
        );
      }
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetail();
  }, [params.id, currentPage, isSaveProgress]);

  if (!course) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-[30px]">
      <div
        className="xl:col-start-1 xl:col-span-4 aos-init aos-animate"
        data-aos="fade-up"
      >
        <ul>
          <li className="accordion mb-[25px] overflow-hidden">
            <div className=" border  rounded-t-md">
              <button className=" flex justify-between items-center text-xl  font-bold w-full px-5 py-[18px] leading-[20px]">
                <span>
                  {course?.title}{" "}
                  {course?.participationType === 0 ? "(Học thử)" : ""}
                </span>
              </button>

              <div>
                <ul>
                  {course?.lessons.items.map((item, index) => (
                    <li
                      className={`py-4 flex items-center justify-between flex-wrap p-[10px] md:px-[30px] cursor-pointer ${
                        course?.lessons.items.length - 1 === index
                          ? ""
                          : "border-b"
                      } ${
                        activeLesson?.lessonId === item.lessonId
                          ? "bg-blue-50/50 text-blue-600 hover:text-blue600"
                          : ""
                      }`}
                      key={item.lessonId}
                      onClick={() => setActiveLesson(item)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <h4 className=" flex items-center gap-4 leading-1 ">
                          <img src={IMAGES.learningIcon} alt="icon" />
                          {/* <p className="font-medium">{item.title}</p> */}
                          Bài học {item.order}
                        </h4>
                        {item?.progress?.isCompleted && (
                          <div className=" flex items-center gap-2 bg-[#ABEFC6] rounded-full text-[#067647] px-2 py-0.5">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7.99984 6C7.4694 6 6.9607 6.21071 6.58562 6.58579C6.21055 6.96086 5.99984 7.46957 5.99984 8C5.99984 8.53043 6.21055 9.03914 6.58562 9.41421C6.9607 9.78929 7.4694 10 7.99984 10C8.53027 10 9.03898 9.78929 9.41405 9.41421C9.78912 9.03914 9.99984 8.53043 9.99984 8C9.99984 7.46957 9.78912 6.96086 9.41405 6.58579C9.03898 6.21071 8.53027 6 7.99984 6ZM7.99984 11.3333C7.11578 11.3333 6.26794 10.9821 5.64281 10.357C5.01769 9.7319 4.6665 8.88406 4.6665 8C4.6665 7.11595 5.01769 6.2681 5.64281 5.64298C6.26794 5.01786 7.11578 4.66667 7.99984 4.66667C8.88389 4.66667 9.73174 5.01786 10.3569 5.64298C10.982 6.2681 11.3332 7.11595 11.3332 8C11.3332 8.88406 10.982 9.7319 10.3569 10.357C9.73174 10.9821 8.88389 11.3333 7.99984 11.3333ZM7.99984 3C4.6665 3 1.81984 5.07333 0.666504 8C1.81984 10.9267 4.6665 13 7.99984 13C11.3332 13 14.1798 10.9267 15.3332 8C14.1798 5.07333 11.3332 3 7.99984 3Z"
                                fill="#067647"
                              />
                            </svg>
                            Đã học
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
          <ul className="flex justify-end items-center  text-sm h-8">
            <li>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg 
    ${
      currentPage === 0
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-gray-100 hover:text-gray-700"
    } dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                Trang trước
              </button>
            </li>

            <li>
              <div
                className={`flex items-center justify-center px-3 h-8 leading-tight border 
     
           !text-blue-600 !border-blue-300 !bg-blue-50
     
       dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                {currentPage + 1}
              </div>
            </li>

            <li>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                disabled={currentPage >= totalPages - 1}
                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg 
    ${
      currentPage >= totalPages - 1
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-gray-100 hover:text-gray-700"
    } dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                Trang sau
              </button>
            </li>
          </ul>
        </ul>
      </div>

      <div
        className="xl:col-start-5 xl:col-span-8 relative aos-init aos-animate"
        data-aos="fade-up"
      >
        <div>
          <div className=" w-full  flex justify-between items-center px-5 py-[10px] text-[#2E90FA] text-[30px] font-bold">
            <h3 className="sm:text-size-22 text-center font-bold">
              {activeLesson?.title}
            </h3>
          </div>
          <div className="aspect-video rounded-xl overflow-hidden border-none ring-0">
            <VideoPlayer
              setIsSaveProgress={setIsSaveProgress}
              videoSrc={activeLesson?.videoUrl || ""}
              progressId={activeLesson?.progress?.id}
              // videoRef={videoPlayerRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
