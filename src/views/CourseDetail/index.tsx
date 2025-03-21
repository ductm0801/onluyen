"use client";
import FormUpdateCourse from "@/components/FormUpdateCourse";
import FormUpdateLesson from "@/components/FormUpdateLesson";
import { IMAGES } from "@/constants/images";
import { ICourse } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getCourseDetail, publishCourse } from "@/services";
import { Image, Modal, Tabs, Tooltip } from "antd";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CourseDetail = () => {
  const [detail, setDetail] = useState<ICourse>();
  const { setLoading } = useLoading();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const params = useParams();
  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const res = await getCourseDetail(params.id, currentPage, pageSize);
      setDetail(res.data);
      setTotalItems(res.data.lessons.totalItemsCount);
      setTotalPages(res.data.lessons.totalPageCount);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCourseDetail();
  }, [params.id, currentPage]);
  if (!detail) return;
  const tab = [
    {
      value: 0,
      label: "Thông tin chung",
      children: <FormUpdateCourse course={detail} />,
    },
    {
      value: 1,
      label: "Danh sách bài học",
      children: (
        <FormUpdateLesson
          lessons={detail.lessons.items}
          fetchCourseDetail={fetchCourseDetail}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      ),
    },
  ];
  const handleConfirm = () => {
    Modal.confirm({
      title: "Xác nhận công khai khóa học",
      content: `Bạn có chắc muốn công khai khóa học không? Sau khi công khai sẽ không được sửa khóa học.`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        await handlePublishCourse();
      },
    });
    return;
  };

  const handlePublishCourse = async () => {
    try {
      setLoading(true);
      await publishCourse(params.id);
      toast.success("Công khai khóa học thành công!");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between border-b border-[#1244A2] pb-2">
        <p className="text-3xl font-semibold">Chi tiết khóa học</p>
        {detail.courseStatus === 0 && (
          <div
            className="bg-blue-600 text-white text-sm px-3 py-2 rounded-lg font-bold cursor-pointer"
            onClick={() => handleConfirm()}
          >
            Công khai khóa học
          </div>
        )}
      </div>
      <Tabs
        defaultActiveKey={tab[0].value.toString()}
        items={tab.map((item) => ({
          key: item.value.toString(),
          label: item.label,
          children: item.children,
        }))}
      />
    </div>
  );
};

export default CourseDetail;
