"use client";
import { IMAGES } from "@/constants/images";
import { ILoginRequest } from "@/models";
import { login } from "@/services";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Login = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const handleSubmit = async (values: ILoginRequest) => {
    try {
      const res = await login(values);
      if (res.status === 200) {
        router.push("/");
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="bg-[#2b4182] h-screen w-screen flex items-center justify-center relative overflow-x-hidden">
      <div className="bg-[#5882c14d] w-[390px] rounded-[20px] flex flex-col gap-8 px-[45px] py-[15px]">
        <div className="flex items-center justify-center gap-4">
          <img src={IMAGES.logo} alt="logo" className="w-12" />
          <div className="font-bold text-[30px] leading-[38px] text-white">
            Ôn luyện
          </div>
        </div>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            className="flex flex-col gap-3"
            name="username"
            label={<b className="text-white">Tài khoản</b>}
            labelCol={{ span: 24 }}
          >
            <input
              className="w-full p-[10px] rounded-[10px] bg-[#e3eaff] focus:border-[#5882c1] text-[#2b4182] focus:outline-none focus:ring-0"
              type="text"
              placeholder="Tài Khoản"
            />
          </Form.Item>
          <Form.Item
            name="password"
            className="flex flex-col gap-3"
            label={<b className="text-white">Mật khẩu</b>}
            labelCol={{ span: 24 }}
          >
            <input
              className="w-full p-[10px] rounded-[10px] bg-[#e3eaff] focus:border-[#5882c1] text-[#2b4182] focus:outline-none focus:ring-0"
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Item>
          <Form.Item>
            <button
              type="submit"
              className="bg-[#ffc022] rounded-[10px] text-white w-full h-[47px] flex items-center justify-center cursor-pointer"
            >
              Đăng nhập
            </button>
          </Form.Item>
        </Form>
      </div>
      <svg
        viewBox="0 0 1320 250"
        className="fixed bottom-0 left-0 right-0 pointer-events-none"
      >
        <path fill="rgba(255,255,255,0.7)" fill-opacity="0.1" />
        <path fill="rgba(255,255,255,0.7)" fill-opacity="0.1" />
        <path fill="rgba(255,255,255,0.7)" fill-opacity="0.1" />
        <path fill="rgba(255,255,255,0.7)" fill-opacity="0.1" />
      </svg>
    </div>
  );
};

export default Login;
