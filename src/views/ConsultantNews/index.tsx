"use client";
import Paging from "@/components/Paging";
import { useLoading } from "@/providers/loadingProvider";
import {
  createNews,
  getNewsPaging,
  hideNews,
  updateNews,
  uploadImg,
} from "@/services";
import { Button, Form, Input, Modal, Upload } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

const cols = [
  {
    name: "Tiêu đề",
    className:
      "px-6 py-4 font-medium min-w-[300px] text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Nội dung",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Trạng thái",
    className:
      "px-6 py-4 font-medium  text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Ngày tạo",
    className:
      "px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Hành động",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-e-lg",
  },
];

export const quillFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "align",
  "link",
  "image",
  "video",
  "color",
  "background",
];
export const quillModules = {
  toolbar: {
    container: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [
        {
          size: [
            false,
            "10px",
            "12px",
            "13px",
            "14px",
            "15px",
            "16px",
            "18px",
            "20px",
            "22px",
            "24px",
            "32px",
            "48px",
          ],
        },
      ],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { align: ["center", "right", "justify", false] },
      ],
      [
        {
          color: [
            "#ffffff",
            "#000000",
            "#e60000",
            "#ff9900",
            "#ffff00",
            "#008a00",
            "#0066cc",
            "#9933ff",
            "transparent",
            "#F3CE70",
          ],
        },
        { background: [] },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    // handlers: {
    //   link: linkHandler,
    //   image: imageHandler,
    // },
  },
  clipboard: {
    matchVisual: false,
  },
};

const ConsultantNews = () => {
  const [news, setNews] = useState([]);
  const { setLoading } = useLoading();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [create, setCreate] = useState(false);
  const [imageUrl, setImageUrl] = useState<any>({});
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [edit, setEdit] = useState(false);
  const detail = useRef<any | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getNewsPaging(currentPage, pageSize);
      if (res) setNews(res.data.items);
      setTotalItems(res.data.totalItemsCount);
      setTotalPageCount(res.data.totalPageCount);
    } catch (e: any) {
      setLoading(false);
      toast.error(e.response?.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await createNews(values);
      toast.success("Tạo tin tức mới thành công!");
      setCreate(false);
      fetchData();
    } catch (e: any) {
      setLoading(false);
      toast.error(e.response?.data.message);
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
      form.setFieldValue("videoUrl", res.url);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (item: any) => {
    setEdit(true);
    detail.current = item;
    form2.setFieldsValue(item);
  };
  const handleCloseEdit = () => {
    setEdit(false);
    detail.current = null;
    form2.resetFields();
  };
  useEffect(() => {
    if (detail.current) {
      const initialImg = {
        uid: `-${detail.current.id}`,
        name: `image${detail.current.id}.png`,
        status: "done" as const,
        url: detail.current.videoUrl,
      };
      // const bannerMerge = initialBanner.at(0);
      setImageUrl(initialImg);
      //   setImageUrl(data.imageUrl);
    }
  }, [detail.current, edit]);
  const editNews = async (values: any) => {
    try {
      setLoading(true);
      await updateNews(detail.current.id, values);

      toast.success("Cập nhật tin tức thành công!");

      setEdit(false);
      fetchData();
    } catch (e: any) {
      setLoading(false);
      toast.error(e.response?.data.message);
    } finally {
      setLoading(false);
      form2.resetFields();
      detail.current = null;
    }
  };
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await hideNews(id);
      toast.success("Ẩn bài đăng thành công!");
      fetchData();
    } catch (e: any) {
      setLoading(false);
      toast.error(e.response?.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative overflow-x-auto">
      <div className="flex justify-between  items-center  flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        <div
          className="bg-[#ffc022] rounded-lg px-3 py-2 cursor-pointer"
          onClick={() => setCreate(true)}
        >
          Tạo tin tức mới
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search-users"
            className="block p-2 ps-10 text-sm focus:ring-0 focus:outline-none text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
            placeholder="Tìm kiếm"
          />
        </div>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {cols.map((col, idx) => (
              <th scope="col" className={col.className} key={idx}>
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {news &&
            news.map((a: any, idx) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={idx}
              >
                <th
                  scope="row"
                  className="flex group cursor-pointer items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    className="w-20 aspect-[3/2] object-contain"
                    src={a.videoUrl || ""}
                    alt="avatar"
                  />
                  <div className="ps-3">
                    <div className="text-base max-w-[200px] truncate  font-semibold">
                      {a.title}
                    </div>
                  </div>
                </th>

                <td className="px-6 py-4">
                  {" "}
                  <div
                    className="font-normal text-gray-500 line-clamp-1"
                    dangerouslySetInnerHTML={{ __html: a.content }}
                  />
                </td>
                <td className="px-6 py-4">
                  {a.isDeleted ? "Tạm ngưng" : " Đang hoạt động"}
                </td>
                <td className="px-6 py-4 ">
                  <div className="flex flex-col items-center">
                    <p>{moment(a.creationDate).format("DD/MM/YYYY")}</p>
                    <p className="text-xs">
                      {moment(a.creationDate).format("HH:mm:ss")}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                      onClick={() => handleEdit(a)}
                    >
                      Sửa
                    </div>

                    <div
                      className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer ms-3 whitespace-nowrap"
                      onClick={() => handleDelete(a.id)}
                    >
                      Ẩn bài đăng
                    </div>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Paging
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        totalPages={totalPageCount}
        setCurrentPage={setCurrentPage}
      />
      {create && (
        <Modal
          open={create}
          onCancel={() => (setCreate(false), form.resetFields())}
          footer={null}
          width={1000}
        >
          <Form
            form={form}
            onFinish={onFinish}
            className="w-full max-h-[800px] overflow-auto"
          >
            <Form.Item
              name="videoUrl"
              label="Hình ảnh"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Vui lòng nhập hình ảnh" }]}
            >
              <Upload
                listType="picture-card"
                onChange={handleChangeImage}
                maxCount={1}
                // fileList={imageUrl ? [imageUrl] : []}
              >
                {typeof form.getFieldValue(["videoUrl"]) === "string"
                  ? "Đổi hình"
                  : "Thêm hình"}
              </Upload>
            </Form.Item>
            <Form.Item
              name="title"
              label="Tiêu đề"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input className="w-full" placeholder="Tiêu đề" />
            </Form.Item>
            <Form.Item
              name="content"
              label="Nội dung"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
            >
              <ReactQuill
                theme="snow"
                placeholder="Nội dung..."
                modules={quillModules}
                formats={quillFormats}
                className="h-60"
              />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end mt-16">
                <Button type="primary" htmlType="submit">
                  Xác nhận
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      )}
      {edit && (
        <Modal
          open={edit}
          onCancel={() => handleCloseEdit()}
          footer={null}
          width={1000}
        >
          <Form
            form={form2}
            onFinish={editNews}
            initialValues={detail.current || null}
            className="w-full max-h-[800px] overflow-auto"
          >
            <Form.Item
              name="videoUrl"
              label="Hình ảnh"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Vui lòng nhập hình ảnh" }]}
            >
              <Upload
                listType="picture-card"
                onChange={handleChangeImage}
                maxCount={1}
                fileList={imageUrl ? [imageUrl] : []}
              >
                {typeof form.getFieldValue(["videoUrl"]) === "string"
                  ? "Đổi hình"
                  : "Thêm hình"}
              </Upload>
            </Form.Item>
            <Form.Item
              name="title"
              label="Tiêu đề"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input className="w-full" placeholder="Tiêu đề" />
            </Form.Item>
            <Form.Item
              name="content"
              label="Nội dung"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
            >
              <ReactQuill
                theme="snow"
                placeholder="Nội dung..."
                modules={quillModules}
                formats={quillFormats}
                className="h-60"
              />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end mt-16">
                <Button type="primary" htmlType="submit">
                  Xác nhận
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default ConsultantNews;
