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

const lessons = [
  {
    title: "Giới thiệu về Tiếng Anh",
    description:
      "Bài học nhập môn giúp bạn làm quen với Tiếng Anh và cách học hiệu quả.",
    videoUrl: "https://example.com/video1.mp4",
    content:
      "Tiếng Anh là ngôn ngữ quốc tế, quan trọng trong giao tiếp và công việc.",
    imageUrl: "https://example.com/image1.jpg",
    courseId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    instructorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  },
  {
    title: "Bảng chữ cái Tiếng Anh",
    description: "Học cách phát âm và viết bảng chữ cái Tiếng Anh.",
    videoUrl: "https://example.com/video2.mp4",
    content:
      "Bảng chữ cái Tiếng Anh gồm 26 chữ cái, mỗi chữ có cách phát âm riêng.",
    imageUrl: "https://example.com/image2.jpg",
    courseId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    instructorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  },
  {
    title: "Cách phát âm các nguyên âm và phụ âm",
    description:
      "Hướng dẫn cách phát âm chính xác các nguyên âm và phụ âm trong Tiếng Anh.",
    videoUrl: "https://example.com/video3.mp4",
    content:
      "Tiếng Anh có 5 nguyên âm chính và nhiều phụ âm quan trọng cần luyện tập.",
    imageUrl: "https://example.com/image3.jpg",
    courseId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    instructorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  },
  {
    title: "Chào hỏi và giới thiệu bản thân",
    description:
      "Học các mẫu câu chào hỏi và cách giới thiệu bản thân bằng Tiếng Anh.",
    videoUrl: "https://example.com/video4.mp4",
    content: "Ví dụ: 'Hello, my name is John. Nice to meet you!'",
    imageUrl: "https://example.com/image4.jpg",
    courseId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    instructorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  },
  {
    title: "Số đếm và cách sử dụng",
    description:
      "Hướng dẫn cách đọc và sử dụng số đếm trong các tình huống hàng ngày.",
    videoUrl: "https://example.com/video5.mp4",
    content: "Học cách đếm từ 1 đến 100 và cách sử dụng số trong câu.",
    imageUrl: "https://example.com/image5.jpg",
    courseId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    instructorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  },
];

const CourseDetail = () => {
  const [detail, setDetail] = useState<ICourse>();
  const { setLoading } = useLoading();
  const params = useParams();
  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const res = await getCourseDetail(params.id);
      setDetail(res.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCourseDetail();
  }, [params.id]);
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
