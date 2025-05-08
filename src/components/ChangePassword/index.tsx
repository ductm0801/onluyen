import { useLoading } from "@/providers/loadingProvider";
import { updatePassword } from "@/services";
import { Button, Form, Input, InputNumber } from "antd";

import React from "react";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const { setLoading } = useLoading();
  const validateConfirmPassword = () => {
    if (
      form.getFieldValue("newPassword") !==
      form.getFieldValue("confirmPassword")
    ) {
      return Promise.reject(new Error("Mật khẩu không khớp nhau"));
    }
    return Promise.resolve();
  };
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await updatePassword({
        currentPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
    } catch (err: any) {
      setLoading(false);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="Mật khẩu cũ"
          name="oldPassword"
          labelCol={{ span: 24 }}
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          labelCol={{ span: 24 }}
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          labelCol={{ span: 24 }}
          rules={[
            { validator: validateConfirmPassword },
            { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
          ]}
          dependencies={["newPassword"]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
