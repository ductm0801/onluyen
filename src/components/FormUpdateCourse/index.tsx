import { ICourse } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { updateCourse, uploadImg } from "@/services";
import { Button, Form, Input, InputNumber, Select, Upload } from "antd";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
const { TextArea } = Input;
type props = {
  course: ICourse;
};

const FormUpdateCourse: React.FC<props> = ({ course }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<any>({});
  const { setLoading } = useLoading();
  const params = useParams();
  const onFinish = async (values: ICourse) => {
    if (!course) return;

    try {
      setLoading(true);
      await updateCourse(values, params.id);
      toast.success("Cập nhật khóa học thành công!");
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (course) {
      const initialImg = {
        uid: `-${course.courseId}`,
        name: `image${course.courseId}.png`,
        status: "done" as const,
        url: course.imageUrl,
      };
      // const bannerMerge = initialBanner.at(0);
      setImageUrl(initialImg);
      //   setImageUrl(data.imageUrl);
    }
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
  return (
    <Form form={form} onFinish={onFinish} initialValues={course}>
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
          name="title"
          label="Tên khóa học"
          labelCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Tên khóa học",
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          className="col-span-2 sm:col-span-1"
          name="coursePrice"
          label="Giá"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập giá",
            },
          ]}
          labelCol={{ span: 24 }}
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
          className="col-span-2 "
          name="description"
          label="Mô tả"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mô tả",
            },
          ]}
          labelCol={{ span: 24 }}
        >
          <TextArea size="large" rows={4} />
        </Form.Item>
        <Form.Item className="justify-self-end col-span-2">
          <Button size="large" type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default FormUpdateCourse;
