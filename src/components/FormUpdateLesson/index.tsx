import { IMAGES } from "@/constants/images";
import { Image, Tooltip } from "antd";
import React, { useRef, useState } from "react";
import ModalCreateLesson from "../ModalCreateLesson";
import { ICourse, ILesson } from "@/models";
import ModalUpdateLesson from "../ModalUpdateLesson";
type props = {
  lessons: any[];
  fetchCourseDetail: () => Promise<void>;
};

const FormUpdateLesson: React.FC<props> = ({ lessons, fetchCourseDetail }) => {
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const detail = useRef<ILesson | null>();
  const handleOpen = (item: ILesson) => {
    setUpdate(true);
    detail.current = item;
  };
  const handleClose = () => {
    setUpdate(false);
    detail.current = null;
  };
  return (
    <div className="flex flex-col gap-4">
      {" "}
      <div
        className="bg-[#1244A2] w-fit text-white px-3 py-2 rounded-xl font-bold cursor-pointer"
        onClick={() => setCreate(true)}
      >
        Tạo bài học mới
      </div>
      <div className="flex flex-col gap-4">
        {lessons.map((lesson, index) => (
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
            <div className="flex items-center gap-2">
              <Tooltip title="Chỉnh sửa bài học" className="cursor-pointer">
                <div
                  className="p-2 rounded-lg bg-blue-500"
                  onClick={() => handleOpen(lesson)}
                >
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
      {create && (
        <ModalCreateLesson
          onClose={() => setCreate(false)}
          fetchCourseDetail={fetchCourseDetail}
        />
      )}
      {update && (
        <ModalUpdateLesson
          lesson={detail.current}
          onClose={handleClose}
          fetchCourseDetail={fetchCourseDetail}
        />
      )}
    </div>
  );
};

export default FormUpdateLesson;
