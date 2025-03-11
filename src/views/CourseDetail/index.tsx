import { IMAGES } from "@/constants/images";
import { Image, Tooltip } from "antd";
import React from "react";

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
  return (
    <div>
      <div className="flex items-center justify-between border-b border-[#1244A2] pb-2">
        <p className="text-3xl font-semibold">Chi tiết khóa học</p>
        <div className="bg-[#1244A2] text-white px-3 py-2 rounded-xl font-bold">
          Tạo bài học mới
        </div>
      </div>
      <div className=" px-3 py-2 rounded-xl font-bold mt-2">
        Danh sách bài học
      </div>
      <div className="flex flex-col gap-4">
        {lessons.map((lesson, index) => (
          <div
            key={index}
            className="border-b border-[#1244A2] pb-2 flex justify-between items-center"
          >
            <div className="flex items-center gap-4 ">
              <Image
                width={100}
                height={100}
                src={IMAGES.about1}
                alt={lesson.title}
                className="object-cover"
              />
              <div>
                <p className="text-lg font-semibold">{lesson.title}</p>
                <p className="text-[#333333a1] text-sm">{lesson.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip title="Chỉnh sửa bài học" className="cursor-pointer">
                <div className="p-2 rounded-lg bg-blue-500">
                  <img src={IMAGES.editIcon} alt="edit" className="w-4  r" />
                </div>
              </Tooltip>
              <Tooltip title="Xóa bài học" className="cursor-pointer">
                <div className="p-2 rounded-lg bg-red-500 cursor-pointer">
                  <img src={IMAGES.trashIcon} alt="edit" className="w-4   " />
                </div>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;
