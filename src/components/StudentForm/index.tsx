import { IMAGES } from "@/constants/images";
import { IRegist } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { studentRegist } from "@/services";
import { Checkbox, Flex, Form, Input, Radio } from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { useForm } from "antd/es/form/Form";
import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
type props = {
  setIsRegist: Dispatch<SetStateAction<boolean>>;
};

const StudentForm: React.FC<props> = ({ setIsRegist }) => {
  const { setLoading } = useLoading();
  const [form] = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConFirmPassword, setShowConFirmPassword] = useState(false);
  const onFinish = async (values: IRegist) => {
    try {
      setLoading(true);
      const res = await studentRegist({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        gender: values.gender || "Male",
        phoneNumber: values.phoneNumber,
        username: values.username,
        role: "Student",
      });
      if (res) {
        toast.success("Đăng ký thành công");
        setIsRegist(false);
      }
    } catch (e) {
      setLoading(false);
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const validateConfirmPassword = (_: any, value: string) => {
    if (value && value !== form.getFieldValue("password")) {
      return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
    }
    return Promise.resolve();
  };

  const options = [
    { label: "Nam", value: "Male" },
    { label: "Nữ", value: "Female" },
  ];
  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        rules={[{ required: true, message: "Không bỏ trống tài khoản" }]}
        name="username"
        label={<b className="text-white">Tài khoản</b>}
        labelCol={{ span: 24 }}
      >
        <input
          className="w-full p-[10px] rounded-[10px] bg-[#e3eaff] focus:border-[#5882c1] text-[#2b4182] focus:outline-none focus:ring-0"
          placeholder="Tài khoản"
        />
      </Form.Item>

      <div className="flex gap-2 items-center w-full">
        <Form.Item
          rules={[{ required: true, message: "Không bỏ trống mật khẩu" }]}
          name="password"
          label={<b className="text-white">Mật khẩu</b>}
          labelCol={{ span: 24 }}
          className="w-full "
        >
          <div className="relative w-full">
            <input
              className="w-full p-[10px] rounded-[10px] bg-[#e3eaff] focus:border-[#5882c1] text-[#2b4182] focus:outline-none focus:ring-0"
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
            />
            <img
              src={showPassword ? IMAGES.eyeShow : IMAGES.eyeOff}
              alt="eye"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer w-[20px]"
              onClick={() => setShowPassword((prev) => !prev)}
            />
          </div>
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[
            { required: true, message: "Không bỏ trống mật khẩu" },
            { validator: validateConfirmPassword },
          ]}
          className="w-full"
          label={<b className="text-white">Xác nhận mật khẩu</b>}
          labelCol={{ span: 24 }}
        >
          <div className="relative w-full">
            <input
              className="w-full p-[10px] rounded-[10px] bg-[#e3eaff] focus:border-[#5882c1] text-[#2b4182] focus:outline-none focus:ring-0"
              type={showConFirmPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
            />
            <img
              src={showConFirmPassword ? IMAGES.eyeShow : IMAGES.eyeOff}
              alt="eye"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer w-[20px]"
              onClick={() => setShowConFirmPassword((prev) => !prev)}
            />
          </div>
        </Form.Item>
      </div>
      <div className="flex gap-2 items-center">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Không bỏ trống Email" },
            {
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Email không hợp lệ",
            },
          ]}
          className="w-full"
          label={<b className="text-white">Email</b>}
          labelCol={{ span: 24 }}
        >
          <input
            className="w-full p-[10px] rounded-[10px] bg-[#e3eaff] focus:border-[#5882c1] text-[#2b4182] focus:outline-none focus:ring-0"
            placeholder="Email@gmail.com"
          />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "Không bỏ trống tên" }]}
          name="fullName"
          className="w-full"
          label={<b className="text-white">Họ và tên</b>}
          labelCol={{ span: 24 }}
        >
          <input
            className="w-full p-[10px] rounded-[10px] bg-[#e3eaff] focus:border-[#5882c1] text-[#2b4182] focus:outline-none focus:ring-0"
            placeholder="Họ và tên"
          />
        </Form.Item>
      </div>
      <div className="flex gap-2 items-center">
        <Form.Item
          rules={[
            { required: true, message: "Không bỏ trống số điện thoại" },
            {
              pattern:
                /^(0(3[2-9]|5[2-9]|7[0|6-9]|8[1-9]|9[0-9])\d{7}|02\d{9}|02\d{8})$/,
              message: "Số điện thoại không hợp lệ",
            },
          ]}
          name="phoneNumber"
          className="w-full"
          label={<b className="text-white">Số diện thoại</b>}
          labelCol={{ span: 24 }}
        >
          <input
            className="w-full p-[10px] rounded-[10px] bg-[#e3eaff] focus:border-[#5882c1] text-[#2b4182] focus:outline-none focus:ring-0"
            placeholder="Số điện thoại"
          />
        </Form.Item>
        <Form.Item
          name="gender"
          className="w-full"
          label={<b className="text-white">Giới tính</b>}
          labelCol={{ span: 24 }}
        >
          <Radio.Group
            block
            size="large"
            options={options}
            defaultValue="Male"
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>
      </div>

      <Form.Item>
        <button
          type="submit"
          className="bg-[#ffc022] rounded-[10px] text-white w-full h-[47px] flex items-center justify-center cursor-pointer"
        >
          Đăng ký
        </button>
      </Form.Item>
    </Form>
  );
};

export default StudentForm;
