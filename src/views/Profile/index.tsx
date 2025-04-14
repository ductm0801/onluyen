"use client";
import { IUSer } from "@/models";
import { useAuth } from "@/providers/authProvider";
import { useLoading } from "@/providers/loadingProvider";
import {
  getAIRecommendation,
  getUserProfile,
  updateBankAccount,
  updateUserProfile,
  uploadImg,
} from "@/services";
import { LoadingOutlined } from "@ant-design/icons";
import {
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Tabs,
  Upload,
} from "antd";
import { Chart, registerables } from "chart.js/auto";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import CustomButton from "@/components/CustomButton";
import banks from "@/constants/data/bank.json";
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
  const [form2] = Form.useForm();
  const data = {
    labels: Array.isArray(user?.subjects)
      ? user.subjects.map((a) => a.subjectName)
      : [],
    datasets: [
      {
        label: "Biểu đồ năng lực học tập",
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
        ...(res.data.user || res.data),
        dateOfBirth: res.data.user.dateOfBirth
          ? dayjs(res.data.user.dateOfBirth)
          : dayjs(res.data.dateOfBirth) || null,
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
    if ((user && user.user?.imageUrl) || user?.imageUrl) {
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
  const getAIRecommend = async () => {
    try {
      setLoading(true);
      const res = await getAIRecommendation();
      toast.success("Lấy đề xuất từ AI thành công!");
      Modal.info({
        title: "Đề xuất từ AI",
        width: "600px",
        content: (
          <div
            className="max-h-[500px] overflow-y-auto text-xl font-bold"
            dangerouslySetInnerHTML={{
              __html: res.data.replace(/\n/g, "<br/>"),
            }}
          />
        ),
      });
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const onUpdateBankAccount = async (values: any) => {
    try {
      console.log(values);
      setLoading(true);
      await updateBankAccount(values);
      toast.success("Cập nhật thông tin thành công!");
      setUpdate((prev) => !prev);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const formatForSelectBank = banks.map((i) => ({
    value: i.shortName,
    label: (
      <div className="flex items-center gap-4">
        <div className="min-w-[200px] flex flex-row items-center gap-1">
          <Image
            width={100}
            height={36}
            className="border-1 border-white"
            src={i?.logo}
            preview={false}
          />
          <div className="flex flex-col justify-start">
            <span className="font-semibold mb-0 text-base leading-button">
              {i.shortName}
            </span>
            <span className="font-normal mb-0 text-sm text-gray-600 leading-button">
              {i.name}
            </span>
          </div>
        </div>
      </div>
    ),
  }));
  const tab = [
    {
      value: 0,
      label: "Thông tin chung",
      children: (
        <div className="flex flex-col items-start">
          <Form
            form={form}
            initialValues={user?.user || undefined}
            onFinish={onFinish}
            className="w-full"
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
              <Form.Item
                name="gender"
                label="Giới tính"
                labelCol={{ span: 24 }}
              >
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
                rules={[
                  { required: true, message: "Không bỏ trống ngày sinh" },
                ]}
                className="w-full"
                label="Ngày sinh"
                labelCol={{ span: 24 }}
              >
                <DatePicker
                  size="large"
                  format={"DD-MM-YYYY"}
                  className="w-full"
                />
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
              <button
                type="submit"
                className="bg-blue-500 rounded-lg w-[240px] py-3 text-white font-bold"
              >
                {" "}
                {isLoading ? <LoadingOutlined /> : "Cập nhật"}
              </button>
            </Form.Item>
          </Form>
          {user?.student && (
            <div className="w-full flex flex-col items-center gap-4">
              <div className="w-1/2">
                <Radar data={data} options={options} />
              </div>
              <div className="self-end">
                <CustomButton
                  text="Nhận phân tích từ AI"
                  textHover="Đừng ngại"
                  onClick={() => getAIRecommend()}
                />
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];
  if (user?.instructor) {
    tab.push({
      value: 1,
      label: "Thông tin ngân hàng",
      children: (
        <Form
          form={form2}
          onFinish={onUpdateBankAccount}
          initialValues={user?.instructor}
        >
          <Form.Item
            label="Ngân hàng thụ hưởng"
            name="bankName"
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: "Vui lòng chọn ngân hàng" }]}
          >
            <Select
              options={formatForSelectBank}
              showSearch
              placeholder="Chọn ngân hàng"
              className="w-full h-[100px]"
            />
          </Form.Item>

          <Form.Item
            label="Tên tài khoản"
            name="accountName"
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: "Vui lòng nhập tên tài khoản" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số tài khoản"
            name="accountNumber"
            labelCol={{ span: 24 }}
            rules={[
              { required: true, message: "Vui lòng nhập số tài khoản" },
              {
                validator: (_, value) => {
                  const strValue = String(value || "");
                  if (!/^\d+$/.test(strValue)) {
                    return Promise.reject("Số tài khoản chỉ được chứa chữ số");
                  }
                  if (strValue.length < 10) {
                    return Promise.reject(
                      "Số tài khoản phải có ít nhất 10 chữ số"
                    );
                  }
                  if (strValue.length > 20) {
                    return Promise.reject(
                      "Số tài khoản không được vượt quá 20 chữ số"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input className="w-full" />
          </Form.Item>
          <Form.Item className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 rounded-lg w-[240px] py-3 text-white font-bold"
            >
              {" "}
              {isLoading ? <LoadingOutlined /> : "Cập nhật"}
            </button>
          </Form.Item>
        </Form>
      ),
    });
  }
  return (
    <Tabs
      defaultActiveKey={tab[0].value.toString()}
      items={tab.map((item) => ({
        key: item.value.toString(),
        label: item.label,
        children: item.children,
      }))}
    />
  );
};

export default Profile;
