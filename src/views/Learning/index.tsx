"use client";
import { IMAGES } from "@/constants/images";
import { ICourse, ILesson } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getCourseDetail } from "@/services";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Learning = () => {
  const [course, setCourse] = useState<ICourse>();
  const params = useParams();
  const [activeLesson, setActiveLesson] = useState<ILesson | undefined>(
    undefined
  );

  const { setLoading } = useLoading();
  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const res = await getCourseDetail(params.id, 0, 100);
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
        <ul className="accordion-container curriculum">
          <li className="accordion mb-[25px] overflow-hidden">
            <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-t-md">
              <div>
                <button className="accordion-controller flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-[18px] dark:text-headingColor-dark font-hind leading-[20px]">
                  <span>{course?.title}</span>
                  <svg
                    className="transition-all duration-500 rotate-0"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="#212529"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                    ></path>
                  </svg>
                </button>
              </div>

              <div className="accordion-content transition-all duration-500">
                <ul>
                  {course?.lessons.items.map((item, index) => (
                    <li
                      className={`py-4 flex items-center justify-between flex-wrap p-[10px] md:px-[30px] ${
                        course?.lessons.items.length - 1 === index
                          ? ""
                          : "border-b"
                      } ${
                        activeLesson?.lessonId === item.lessonId
                          ? "bg-blue-50/50 text-blue-600 hover:text-blue600"
                          : ""
                      }`}
                      key={item.courseId}
                    >
                      <div>
                        <h4 className="text-blackColor flex items-center gap-4 dark:text-blackColor-dark leading-1 font-light">
                          <img src={IMAGES.lessonIcon} alt="icon" />
                          <p className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor">
                            {item.title}
                          </p>
                        </h4>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div
        className="xl:col-start-5 xl:col-span-8 relative aos-init aos-animate"
        data-aos="fade-up"
      >
        <div>
          <div className="absolute top-0 left-0 w-full flex justify-between items-center px-5 py-[10px] bg-primaryColor leading-1.2 text-whiteColor">
            <h3 className="sm:text-size-22 font-bold">
              Video Content lesson 01
            </h3>
            <a href="course-details.html" className="">
              Close
            </a>
          </div>
          <div className="aspect-video">
            <iframe
              src={activeLesson?.videoUrl}
              allowFullScreen
              allow="autoplay"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
