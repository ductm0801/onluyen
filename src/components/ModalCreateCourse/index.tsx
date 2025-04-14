import { Form, InputNumber, Select, Upload } from "antd";
import React, { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useLoading } from "@/providers/loadingProvider";
import { createCourse, uploadImg } from "@/services";

import { toast } from "react-toastify";
const typeOptions = [
  { label: "Tự học", value: 0 },
  { label: "Dạy kèm", value: 1 },
];

const ModalCreateCourse = ({
  onClose,
  fetchCourse,
}: {
  onClose: () => void;
  fetchCourse: () => Promise<void>;
}) => {
  const [form] = Form.useForm();
  const [loadingImg, setLoadingImg] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const { setLoading } = useLoading();
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await createCourse(values);
      onClose();
      fetchCourse();
      toast.success("Tạo khóa học thành công!");
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
      onClose();
    }
  };
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loadingImg ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Thêm ảnh mới</div>
    </button>
  );
  const handleChangeImage = async ({ file }: { file: any }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file.originFileObj);
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
  console.log(imageUrl);

  return (
    <div
      id="crud-modal"
      tabIndex={-1}
      aria-hidden="true"
      className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black/70"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tạo khoá học mới
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="crud-modal"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <Form className="p-4 md:p-5" form={form} onFinish={onFinish}>
            <div className="grid gap-4 mb-4 grid-cols-2">
              <Form.Item
                className="col-span-2 mb-0"
                name="imageUrl"
                label="Hình ảnh"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ảnh",
                  },
                ]}
              >
                <Upload listType="picture-card" onChange={handleChangeImage}>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
              <Form.Item
                className="col-span-2 mb-0"
                name="title"
                label="Tên khoá học"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên khoá học",
                  },
                ]}
              >
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Tên khoá học"
                />
              </Form.Item>
              <Form.Item
                className="col-span-1 mb-0"
                name="courseType"
                label="Dạng khoá học"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn dạng khoá học",
                  },
                ]}
              >
                <Select options={typeOptions} placeholder="Dạng khoá học" />
              </Form.Item>
              <Form.Item
                className="col-span-1 mb-0"
                name="coursePrice"
                label="Giá khoá học"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá khoá học",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  formatter={(value: any) => {
                    return `${value}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  }}
                  parser={(value: any) => {
                    return value.replace(/\$\s?|(,*)/g, "").replace("đ", "");
                  }}
                  className="rounded-md w-full bg-white"
                />
              </Form.Item>
              <Form.Item
                className="col-span-2 mb-0"
                name="description"
                label="Mô tả khoá học"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả khoá học",
                  },
                ]}
              >
                <textarea
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Mô tả khoá học"
                ></textarea>
              </Form.Item>
            </div>
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="me-1 -ms-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Tạo mới
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateCourse;
