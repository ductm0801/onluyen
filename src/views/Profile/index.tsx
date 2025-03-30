"use client";
import { IUSer } from "@/models";
import { useAuth } from "@/providers/authProvider";
import { useLoading } from "@/providers/loadingProvider";
import { getUserProfile, updateUserProfile, uploadImg } from "@/services";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Radio, Upload } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Chart, registerables } from "chart.js/auto";
import { Radar } from "react-chartjs-2";
Chart.register(...registerables);

const genderOptions = [
  { label: "Nam", value: "Male" },
  { label: "Nữ", value: "Female" },
];

const Profile = () => {
  const [user, setUser] = useState<IUSer>();
  const { isLoading, setLoading } = useLoading();
  const { setUpdate } = useAuth();
  const [form] = Form.useForm();

  const data = {
    labels: Array.isArray(user?.subjects)
      ? user.subjects.map((a) => a.subjectName)
      : [],
    datasets: [
      {
        label: "Bảng điểm trung bình các môn",
        data: Array.isArray(user?.subjects)
          ? user.subjects.map((a) => a.averageScorePercentage)
          : [],
        backgroundColor: "rgba(75,192,192,0.4)",
      },
    ],
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  const [imageUrl, setImageUrl] = useState<
    | {
        uid: string;
        name: string;
        status: "uploading" | "done" | "error" | "removed";
        url: string;
      }
    | undefined
  >();
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await getUserProfile();
      setUser(res.data);
      form.setFieldsValue({
        ...res.data.user,
        dateOfBirth: res.data.user.dateOfBirth
          ? dayjs(res.data.user.dateOfBirth)
          : null,
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleChangeImage = async ({ file }: { file: any }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file.originFileObj);
    setImageUrl(file);
    try {
      const res = await uploadImg(formData);

      form.setFieldValue("imageUrl", res.url);

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user && user.user.imageUrl) {
      const initialImg = {
        uid: `-${user.user.id}`,
        name: `image${user.user.id}.png`,
        status: "done" as const,
        url: user.user.imageUrl,
      };

      setImageUrl(initialImg);
    }
  }, [user]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await updateUserProfile({
        ...values,
        id: user?.user.id ?? "",
        dateOfBirth: dayjs(values.dateOfBirth, "DD-MM-YYYY").format(
          "YYYY-MM-DDTHH:mm:ss.SSS"
        ),
      });
      toast.success("Cập nhật thông tin thành công!");
      setUpdate((prev) => !prev);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-start">
      <Form
        form={form}
        initialValues={user?.user || undefined}
        onFinish={onFinish}
        className="max-w-screen-sm"
      >
        <div className="grid grid-cols-2 gap-x-8 ">
          <Form.Item
            label="Hình ảnh"
            name="imageUrl"
            labelCol={{ span: 24 }}
            className="col-span-2"
          >
            <Upload
              listType="picture-card"
              onChange={handleChangeImage}
              maxCount={1}
              fileList={imageUrl ? [imageUrl] : []}
            >
              {typeof form.getFieldValue(["imageUrl"]) === "string"
                ? "Đổi hình"
                : "Thêm hình"}
            </Upload>
          </Form.Item>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item name="gender" label="Giới tính" labelCol={{ span: 24 }}>
            <Radio.Group
              block
              size="large"
              options={genderOptions}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>
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
            label="Email"
            labelCol={{ span: 24 }}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="dateOfBirth"
            rules={[{ required: true, message: "Không bỏ trống ngày sinh" }]}
            className="w-full"
            label="Ngày sinh"
            labelCol={{ span: 24 }}
          >
            <DatePicker size="large" format={"DD-MM-YYYY"} className="w-full" />
          </Form.Item>
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
            label="Số điện thoại"
            labelCol={{ span: 24 }}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Không bỏ trống địa chỉ" }]}
            name="address"
            label="Địa chỉ"
            labelCol={{ span: 24 }}
          >
            <Input size="large" />
          </Form.Item>
        </div>

        <Form.Item className="flex justify-end">
          <Button type="primary" htmlType="submit" size="large">
            {isLoading ? <LoadingOutlined /> : "Cập nhật"}
          </Button>
        </Form.Item>
      </Form>
      {user?.student && (
        <div className="w-1/2">
          <Radar data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default Profile;
