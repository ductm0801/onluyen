"use client";
import { ICourse } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { adminUpdatePendingCourse, getCoursePendingDetail } from "@/services";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Paging from "../Paging";
import { Image, Modal, Tooltip } from "antd";
import { IMAGES } from "@/constants/images";
import { courseStatusEnum } from "@/constants/enum";

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

const PendingCourseDetail = () => {
  const [data, setData] = useState<ICourse | undefined>(undefined);
  const { setLoading } = useLoading();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
  const handleConfirm = (status: string) => {
    if (status === "DaDuyet") {
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
    if (status === "TuChoi") {
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

  const handlePublishCourse = async (status: string) => {
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
  if (!data) return null;
  return (
    <div className="flex flex-col gap-4">
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
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => handleConfirm("DaDuyet")}
            className="text-white bg-blue-500 px-3 py-2 rounded-xl"
          >
            Duyệt
          </button>
          <button
            onClick={() => handleConfirm("TuChoi")}
            className="text-white bg-red-600 px-3 py-2 rounded-xl"
          >
            {" "}
            Từ Chối
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {data?.lessons.items.map((lesson, index) => (
          <div
            key={index}
            className="border-b border-[#1244A2] pb-2 flex justify-between items-center"
          >
            <div className="flex items-center gap-4 ">
              <Image
                width={160}
                height={90}
                src={lesson.imageUrl}
                alt={lesson.title}
                className="object-cover aspect-video"
              />
              <div>
                <p className="text-lg font-semibold">{lesson.title}</p>
                <p className="text-[#333333a1] text-sm">{lesson.description}</p>
              </div>
            </div>

            <img
              src={IMAGES.arrowDown}
              alt="down"
              className="w-6 cursor-pointer"
            />
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
    </div>
  );
};

export default PendingCourseDetail;
