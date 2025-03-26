import { IMAGES } from "@/constants/images";
import { useLoading } from "@/providers/loadingProvider";
import { getSubject, instructorRegist, uploadImg } from "@/services";
import { Form, Radio, Select, Upload } from "antd";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Subject } from "@/models";

const InstructorForm = ({
  setIsRegist,
}: {
  setIsRegist: Dispatch<SetStateAction<boolean>>;
}) => {
  const [form] = Form.useForm();

  const { setLoading } = useLoading();
  const [imageUrl, setImageUrl] = useState<string>();
  const [loadingImg, setLoadingImg] = useState(false);
  const [subject, setSubject] = useState<Subject[]>([]);
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await instructorRegist({
        ...values,
        role: "Instructor",
        gender: values.gender || "Male",
        resumeUrl: "string",
      });
      toast.success("Đăng ký thành công!");
      setIsRegist(false);
    } catch (err: any) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const options = [
    { label: "Nam", value: "Male" },
    { label: "Nữ", value: "Female" },
  ];

  const fetchSubject = async () => {
    try {
      setLoading(true);
      const res = await getSubject();
      if (res) {
        setSubject(res.data);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSubject();
  }, []);
  const subjectOptions = subject.map((item) => ({
    label: item.subjectName,
    value: item.id,
  }));
  const handleChangeImage = async ({ file }: { file: any }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file.originFileObj);
    try {
      const res = await uploadImg(formData);

      form.setFieldValue("certificate", res.url);

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loadingImg ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Thêm ảnh mới</div>
    </button>
  );
  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        rules={[{ required: true, message: "Không bỏ trống tài khoản" }]}
        name="fullName"
        label={<b className="text-white">Họ và tên</b>}
        labelCol={{ span: 24 }}
      >
        <input
          className="w-full p-[10px] rounded-[10px] bg-[#e3eaff] focus:border-[#5882c1] text-[#2b4182] focus:outline-none focus:ring-0"
          placeholder="Họ và tên"
        />
      </Form.Item>

      <div className="flex gap-2 items-center w-full">
        <Form.Item
          rules={[{ required: true, message: "Không bỏ trống chứng chỉ" }]}
          name="certificate"
          label={<b className="text-white">Chứng chỉ</b>}
          labelCol={{ span: 24 }}
          className="w-full "
        >
          <Upload
            listType="picture-card"
            onChange={handleChangeImage}
            maxCount={1}
            className="text-white"
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          name="subjectId"
          rules={[{ required: true, message: "Vui lòng chọn môn học" }]}
          className="w-full"
          label={<b className="text-white">Môn học</b>}
          labelCol={{ span: 24 }}
        >
          <Select
            options={subjectOptions}
            className="!bg-[#e3eaff] rounded-lg"
            placeholder="Chọn môn học"
            showSearch
          />
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
          rules={[
            { required: true, message: "Không bỏ trống số năm kinh nghiệm" },
          ]}
          name="yearOfExperience"
          className="w-full"
          label={<b className="text-white">Số năm kinh nghiệm</b>}
          labelCol={{ span: 24 }}
        >
          <input
            type="number"
            className="w-full p-[10px] rounded-[10px] bg-[#e3eaff] focus:border-[#5882c1] text-[#2b4182] focus:outline-none focus:ring-0"
            placeholder="Số năm kinh nghiệm"
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

export default InstructorForm;
