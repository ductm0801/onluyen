"use client";
import { IMAGES } from "@/constants/images";
import { ICourse, ILesson } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getCourseDetail } from "@/services";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const videoPlayerRef = useRef<any>(null);
  const [activeLesson, setActiveLesson] = useState<ILesson | undefined>(
    undefined
  );
  const handlePlay = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.playVideo();
    }
  };

  const { setLoading } = useLoading();
  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const res = await getCourseDetail(params.id, currentPage, pageSize);
      setTotalItems(res.data.lessons.totalItemsCount);
      setTotalPages(res.data.lessons.totalPageCount);
      if (res) {
        setCourse(res.data);
        setActiveLesson(res.data.lessons.items[0]);
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
                <span>{course?.title}</span>
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
                      key={item.courseId}
                      onClick={() => setActiveLesson(item)}
                    >
                      <div>
                        <h4 className=" flex items-center gap-4 leading-1 ">
                          <img src={IMAGES.lessonIcon} alt="icon" />
                          <p className="font-medium">{item.title}</p>
                        </h4>
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
          <div className="absolute top-0 left-0 w-full z-10 flex justify-between items-center px-5 py-[10px] bg-blue-500 leading-1.2 text-white">
            <h3 className="sm:text-size-22 text-center font-bold">
              {activeLesson?.title}
            </h3>
          </div>
          <div className="aspect-video">
            <VideoPlayer
              setIsPlaying={setIsPlaying}
              videoSrc={activeLesson?.videoUrl || ""}
              videoRef={videoPlayerRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
