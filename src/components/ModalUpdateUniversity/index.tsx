import { useLoading } from "@/providers/loadingProvider";
import { createUniversity, updateUniversity, uploadImg } from "@/services";
import { Button, Form, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type props = {
  onClose: () => void;
  fetchData: () => Promise<void>;
  data: any;
};

const ModalUpdateUniversity: React.FC<props> = ({
  onClose,
  fetchData,
  data,
}) => {
  const { setLoading } = useLoading();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<any>({});

  const handleUpdateUniversity = async (values: any) => {
    try {
      setLoading(true);
      await updateUniversity(values, data.id);
      onClose();
      fetchData();
      toast.success("Tạo trường thành công!");
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
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
    if (data) {
      const initialImg = {
        uid: `-${data.idid}`,
        name: `image${data.idid}.png`,
        status: "done" as const,
        url: data.imageUrl,
      };
      // const bannerMerge = initialBanner.at(0);
      setImageUrl(initialImg);
      form.setFieldsValue({
        imageUrl: data.imageUrl,
      });
    }
  }, []);
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
              Sửa trường
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

          <Form
            initialValues={data || {}}
            layout="vertical"
            onFinish={handleUpdateUniversity}
            autoComplete="off"
            form={form}
            className="p-4 md:p-5"
          >
            <Form.Item
              className="col-span-2"
              name="imageUrl"
              label="Hình ảnh"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ảnh",
                },
              ]}
              labelCol={{ span: 24 }}
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
              label="Tên trường"
              name="universityName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên trường",
                },
              ]}
            >
              <input
                type="text"
                className="block p-2 text-sm focus:ring-0 focus:outline-none text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
                placeholder="Tên trường"
              />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="universityDescription"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mô tả",
                },
              ]}
            >
              <textarea
                className="block p-2 text-sm focus:ring-0 focus:outline-none text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
                placeholder="Mô tả"
              />
            </Form.Item>
            <Form.Item>
              <div className="flex items-center justify-end ">
                <Button type="primary" htmlType="submit">
                  Xác nhận
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ModalUpdateUniversity;
