"use client";
import InstructorForm from "@/components/InstructorForm";
import StudentForm from "@/components/StudentForm";
import { IMAGES } from "@/constants/images";
import { Form } from "antd";
import { useState } from "react";
const items = [
  { label: "Học sinh", value: "Student" },
  { label: "Giáo viên", value: "Instructor" },
];

const Regist = () => {
  const [form] = Form.useForm();
  const handleSubmit = (values: any) => {
    console.log("Received values of form:", values);
  };
  const [role, setRole] = useState({ label: "Học sinh", value: "Student" });
  const [open, setOpen] = useState(false);
  const renderContent = () => {
    switch (role.value) {
      case "Student":
        return <StudentForm />;
      case "Instructor":
        return <InstructorForm />;
      default:
        return <StudentForm />;
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex flex-col gap-2">
        Chọn loại tài khoản
        <div
          className="bg-white border text-black border-gray-400 rounded-xl px-3 py-2 flex justify-between items-center"
          onClick={() => setOpen((prev) => !prev)}
        >
          {role.label}
          <img src={IMAGES.arrowDown} alt="down" className="w-4" />
          <div
            className={`absolute top-16 left-0 w-full  ${
              open ? "max-h-[150px]" : "max-h-0"
            } transition-all duration-700 ease-in-out overflow-hidden rounded-lg `}
          >
            {items.map((item) => (
              <div
                key={item.value}
                className={`bg-white border px-3 py-2 flex items-center justify-between cursor-pointer ${
                  role.value === item.value ? "text-blue-500" : "text-black"
                }`}
                onClick={() => {
                  setRole(item);
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default Regist;
