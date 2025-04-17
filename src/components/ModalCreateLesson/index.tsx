import { getVideoDuration } from "@/constants/utils";
import { ICourse } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { createLesson, updateCourse, uploadImg, uploadVideo } from "@/services";
import { Form, Input, InputNumber, Upload } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalCreateLesson = ({
  onClose,
  fetchCourseDetail,
}: {
  onClose: () => void;
  fetchCourseDetail: () => Promise<void>;
}) => {
  const [form] = Form.useForm();
  const [loadingImg, setLoadingImg] = useState(false);
  const params = useParams();
  const [videoLength, setVideoLength] = useState(0);
  const [imageUrl, setImageUrl] = useState<
    | {
        uid: string;
        name: string;
        status: "uploading" | "done" | "error" | "removed";
        url: string;
      }
    | undefined
  >();
  const { setLoading } = useLoading();
  const onFinish = async (values: ICourse) => {
    try {
      setLoading(true);
      await createLesson({
        ...values,
        courseId: params.id,
        videoLength: Math.ceil(videoLength),
      });
      onClose();
      fetchCourseDetail();
      toast.success("Tạo bài học thành công!");
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
      onClose();
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
  const handleChangeVideo = async ({ file }: { file: any }) => {
    setLoading(true);
    const formData = new FormData();
    const rawFile = file.originFileObj;

    const videoDuration = await getVideoDuration(rawFile);
    setVideoLength(videoDuration);
    formData.append("file", file.originFileObj);
    // setImageUrl(file);
    try {
      const res = await uploadVideo(formData);

      form.setFieldValue("videoUrl", res.videoUrl);

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      // console.log(error);
      // if (error.response.status === 413) {
      //   toast.error("Video quá lớn, vui lòng chọn video khác!");
      //   return;
      // }
      toast.error(error?.response?.data.message);
    } finally {
      setLoading(false);
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
              Tạo bài học
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
                className="col-span-2 mb-0"
                name="title"
                label="Tên bài học"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên bài học",
                  },
                ]}
              >
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Tên bài học"
                />
              </Form.Item>

              <Form.Item
                className="col-span-2 mb-0"
                name="videoUrl"
                label="Video bài học"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn video",
                  },
                ]}
              >
                <Upload
                  listType="picture-card"
                  onChange={handleChangeVideo}
                  accept="video/*"
                  maxCount={1}
                  // fileList={imageUrl ? [imageUrl] : []}
                >
                  {typeof form.getFieldValue(["videoUrl"]) === "string"
                    ? "Đổi video"
                    : "Thêm video"}
                </Upload>
              </Form.Item>
              <Form.Item
                className="col-span-2 mb-0"
                name="description"
                label="Mô tả khoá học"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả bài học",
                  },
                ]}
              >
                <textarea
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Mô tả bài học"
                ></textarea>
              </Form.Item>
            </div>
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Xác nhận
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateLesson;
