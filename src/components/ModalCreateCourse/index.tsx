import { Form, Upload } from "antd";
import React, { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const ModalCreateCourse = ({ onClose }: { onClose: () => void }) => {
  const [form] = Form.useForm();
  const [loadingImg, setLoadingImg] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const onFinish = async (values: any) => {
    console.log(values);
  };
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loadingImg ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Thêm ảnh mới</div>
    </button>
  );
  const handleChange = async (values: any) => {
    setLoadingImg(true);
    const { file } = values.image;
    const formData = new FormData();
    formData.append("image", file);
    try {
      //   const response = await fetch("http://localhost:3000/upload", {
      //     method: "POST",
      //     body: formData,
      //   });
      //   const data = await response.json();
      //   setImageUrl(data.url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingImg(false);
    }
  };
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
              <Form.Item className="col-span-2 mb-0" name="imageUrl">
                <Upload
                  listType="picture-card"
                  className="text-white"
                  onChange={handleChange}
                >
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
              <Form.Item className="col-span-2 mb-0" name="title">
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Tên khoá học"
                />
              </Form.Item>

              <Form.Item
                className="col-span-2 sm:col-span-1 mb-0"
                name="description"
              >
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Mô tả khoá học"
                />
              </Form.Item>
              <Form.Item
                className="col-span-2 sm:col-span-1 mb-0"
                name="coursePrice"
              >
                <input
                  type="number"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Giá khoá học"
                />
              </Form.Item>
              <Form.Item className="col-span-2 mb-0" name="description">
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
