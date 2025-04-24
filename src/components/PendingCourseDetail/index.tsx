"use client";
import { ICourse } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import {
  adminUpdatePendingCourse,
  getCoursePendingDetail,
  getSchedule,
} from "@/services";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Paging from "../Paging";
import { Image, Modal, Tooltip } from "antd";
import { IMAGES } from "@/constants/images";
import { courseStatusEnum } from "@/constants/enum";
import Schedule from "../Schedule";

export const renderBgColorStatus = (status: keyof typeof courseStatusEnum) => {
  switch (status) {
    case 1:
      return "from-orange-600 to-orange-300";
    case 2:
      return "from-emerald-600 to-emerald-400";
    case 4:
      return "from-red-600 to-red-300";
    case 3:
      return "from-red-600 to-red-400";
    case 0:
      return "from-slate-600 to-slate-300";
    default:
      return "from-emerald-500 to-teal-400";
  }
};

const PendingCourseDetail = () => {
  const [data, setData] = useState<ICourse | undefined>(undefined);
  const { setLoading } = useLoading();
  const [scheduleData, setScheduleData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState("");
  const params = useParams();
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getCoursePendingDetail(
        params.id,
        currentPage,
        pageSize
      );
      setData(res.data);
      setTotalItems(res.data.lessons.totalItemsCount);
      setTotalPages(res.data.lessons.totalPageCount);
    } catch (e: any) {
      setLoading(false);
      toast.error(e.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage]);
  const handleConfirm = (status: number) => {
    if (status === 2) {
      Modal.confirm({
        title: "Xác nhận duyệt khóa học",
        content: `Bạn có chắc muốn duyệt khóa học không?`,
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: async () => {
          await handlePublishCourse(status);
        },
      });
      return;
    }
    if (status === 3) {
      Modal.confirm({
        title: "Xác nhận từ chối khóa học",
        content: `Bạn có chắc muốn từ chối khóa học không?`,
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: async () => {
          await handlePublishCourse(status);
        },
      });
    }
    return;
  };
  const fetchDataSchedule = async () => {
    setLoading(true);
    try {
      const res = await getSchedule(currentPage, 100, params.id);
      if (res) {
        setScheduleData(res.data.items);
        // setTotalItems(res.data.totalItemsCount);
        // setTotalPages(res.data.totalPageCount);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDataSchedule();
  }, [currentPage, params.id]);

  const handlePublishCourse = async (status: number) => {
    try {
      setLoading(true);
      await adminUpdatePendingCourse(params.id, status);
      fetchData();
      toast.success("Thay đổi trạng thái khóa học thành công!");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const handleRenderCourseType = (type: number) => {
    switch (type) {
      case 0:
        return (
          <div className="flex flex-col gap-4">
            {data?.lessons.items.map((lesson, index) => (
              <div
                key={lesson.lessonId}
                className=" flex flex-col gap-4 bg-white rounded-lg shadow-sm px-4 py-2 cursor-pointer"
                onClick={() => setOpen(lesson.lessonId)}
              >
                <div className="flex justify-between items-center border-b border-[#1244A2] pb-2 ">
                  <div className="flex items-center gap-4">
                    <Image
                      width={160}
                      height={90}
                      src={lesson.imageUrl}
                      alt={lesson.title}
                      className="object-cover aspect-video"
                    />
                    <div>
                      <p className="text-lg font-semibold">{lesson.title}</p>
                      <p className="text-[#333333a1] text-sm">
                        {lesson.description}
                      </p>
                    </div>
                  </div>

                  <img
                    src={IMAGES.arrowDown}
                    alt="down"
                    className={`w-6 cursor-pointer transition-all duration-300 ease-in-out  ${
                      open === lesson.lessonId ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>

                <div
                  className={`flex flex-col gap-4 mt-2  overflow-hidden transition-all duration-300 ease-in-out        ${
                    open === lesson.lessonId ? "max-h-screen" : "max-h-0"
                  }`}
                >
                  <div className="flex items-center gap-4 px-8">
                    <p className="text-lg font-semibold">Video bài học</p>
                    <video
                      controls
                      className="w-[300px] aspect-video"
                      src={lesson.videoUrl}
                    />
                  </div>
                  {lesson.content && (
                    <>
                      <p className="text-lg font-semibold">Nội dung bài học</p>
                      <p>{lesson.content}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
            <Paging
              currentPage={currentPage}
              pageSize={pageSize}
              setCurrentPage={setCurrentPage}
              totalItems={totalItems}
              totalPages={totalPages}
            />
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-center">📅 Lịch dạy</h2>
            <Schedule
              data={scheduleData}
              duration={data?.timeSlotDuration || ""}
            />
          </div>
        );
      default:
        return "Khóa học tự học";
    }
  };
  if (!data) return null;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-3xl font-bold uppercase">Khóa học {data.title}</p>
      <div className="flex items-center gap-4">
        {" "}
        <p> Trạng thái </p>
        <span
          className={`px-2 text-sm rounded-lg py-1 font-bold text-white bg-gradient-to-tl ${renderBgColorStatus(
            data.courseStatus
          )}`}
        >
          {courseStatusEnum[data?.courseStatus]}
        </span>
        {data.courseStatus === 1 && (
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => handleConfirm(2)}
              className="text-white bg-blue-500 px-3 py-2 rounded-xl"
            >
              Duyệt
            </button>
            <button
              onClick={() => handleConfirm(3)}
              className="text-white bg-red-600 px-3 py-2 rounded-xl"
            >
              {" "}
              Từ Chối
            </button>
          </div>
        )}
      </div>
      {handleRenderCourseType(data.courseType)}
    </div>
  );
};

export default PendingCourseDetail;
