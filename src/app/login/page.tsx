"use client";
import { IMAGES } from "@/constants/images";
import { menus } from "@/constants/menu";
import { ILoginRequest, User } from "@/models";
import { useAuth } from "@/providers/authProvider";
import { useLoading } from "@/providers/loadingProvider";
import { login, resetPassword } from "@/services";
import Regist from "@/views/Regist";
import { Form, Input } from "antd";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { setUser } = useAuth();
  const [isRegist, setIsRegist] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setLoading } = useLoading();
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleSubmit = async (values: ILoginRequest) => {
    try {
      setLoading(true);
      const res = await login(values);
      if (res) {
        toast.success("Đăng nhập thành công!");
        localStorage.setItem("token", res.data);

        window.dispatchEvent(new Event("storage"));
        const decoded: User = jwtDecode(res.data);
        setUser(decoded);
        const role = decoded.Role as keyof typeof menus;
        const firstMenuItem = menus[role]?.[0]?.path || "/";

        router.push(firstMenuItem);
      }
    } catch (e: any) {
      toast.error(e.response?.data.message);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const handleForgot = async (value: any) => {
    try {
      setLoading(true);
      await resetPassword(value);
      toast.success(
        "Mật khẩu mới đã được gửi đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư đến (bao gồm cả thư rác nếu cần) và sử dụng mật khẩu mới để đăng nhập."
      );
    } catch (e: any) {
      setLoading(false);
      toast.error(e.response?.data.message);
    } finally {
      setLoading(false);
      setIsForgotPassword(false);
    }
  };

  return (
    <div className="bg-[#2b4182] h-screen w-screen flex items-center justify-center relative overflow-x-hidden">
      <div
        className={`bg-[#5882c14d] ${
          isRegist ? "w-[600px] " : "w-[390px]"
        } rounded-[20px] relative flex flex-col gap-8 px-[45px] py-[15px]`}
      >
        {(isRegist || isForgotPassword) && (
          <img
            src={IMAGES.backIcon}
            alt="back"
            className="absolute top-8 left-10 cursor-pointer w-[40px]  filter brightness-0 invert"
            onClick={() => {
              setIsRegist(false);
              setIsForgotPassword(false);
            }}
          />
        )}
        <div className="flex items-center justify-center gap-4">
          <img src={IMAGES.logo} alt="logo" className="w-12" />
          <div className="font-bold text-[30px] leading-[38px] text-white">
            Ôn luyện
          </div>
        </div>
        {isRegist ? (
          <Regist setIsRegist={setIsRegist} />
        ) : isForgotPassword ? (
          <Form form={form} onFinish={handleForgot}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                {
                  type: "email",
                  message: "Email không hợp lệ",
                },
              ]}
            >
              <input
                className="w-full p-[10px] rounded-[10px] bg-[#e3eaff] focus:border-[#5882c1] text-[#2b4182] focus:outline-none focus:ring-0"
                type="text"
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item>
              <button
                type="submit"
                className="bg-[#ffc022] rounded-[10px] text-white w-full h-[47px] flex items-center justify-center cursor-pointer"
              >
                Xác nhận
              </button>
            </Form.Item>
          </Form>
        ) : (
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
            <div
              className="text-[#ffc022] font-bold cursor-pointer w-fit  pb-3 justify-self-end"
              onClick={() => setIsForgotPassword(true)}
            >
              Quên mật khẩu
            </div>
            <Form.Item>
              <button
                type="submit"
                className="bg-[#ffc022] rounded-[10px] text-white w-full h-[47px] flex items-center justify-center cursor-pointer"
              >
                Đăng nhập
              </button>
            </Form.Item>
            <div className="text-white flex gap-2 justify-center pb-3 items-center">
              Chưa có tài khoản?{" "}
              <span
                className="text-[#ffc022] font-bold cursor-pointer"
                onClick={() => setIsRegist(true)}
              >
                {" "}
                Đăng ký ngay{" "}
              </span>
            </div>
          </Form>
        )}
      </div>
      <svg
        viewBox="0 0 1320 250"
        className="waveLogin fixed bottom-0 left-0 right-0 pointer-events-none"
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
