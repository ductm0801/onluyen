import { IExam, IExamBank } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getExamBankAll, updateExam } from "@/services";
import { Button, Form, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
const { TextArea } = Input;

export const examOptions = [
  { value: 0, label: "Trắc nghiệm" },
  { value: 1, label: "Tự luận" },
  { value: 2, label: "Tổng hợp" },
];
const testStatus = [
  { label: "Bản Nháp", value: 0 },
  { label: "Chờ duyệt", value: 1 },
];

const FormUpdateInfo = ({
  exam,
  id,
}: {
  exam: IExam | undefined;
  id: string | string[];
}) => {
  const [form] = Form.useForm();
  const { setLoading } = useLoading();
  const [examBank, setExamBank] = useState<IExamBank[]>([]);
  const onFinish = async (values: IExam) => {
    try {
      setLoading(true);
      await updateExam(id, values);
      toast.success("Cập nhật thành công");
    } catch (err: any) {
      setLoading(false);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!exam) return;
    form.setFieldsValue(exam);
  }, [exam]);

  if (!examBank) return <></>;
  const examBankOptions = examBank.map((subject: IExamBank) => {
    return { label: subject.testBankName, value: subject.id };
  });

  const fetchExamBank = async () => {
    try {
      setLoading(true);
      const res = await getExamBankAll();
      if (res) setExamBank(res.data);
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExamBank();
  }, []);
  return (
    <Form form={form} onFinish={onFinish} initialValues={exam}>
      <div className="grid gap-4 mb-4 grid-cols-2">
        <Form.Item
          name="testName"
          label="Tên Đề"
          labelCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Tên đề",
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          className="col-span-2 sm:col-span-1"
          name="length"
          label="Thời lượng"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập thời lượng",
            },
          ]}
          labelCol={{ span: 24 }}
        >
          <Input min={0} size="large" type="number" addonAfter="Phút" />
        </Form.Item>
        <Form.Item
          className="col-span-2 sm:col-span-1"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Điểm",
            },
          ]}
          name="totalGrade"
          label="Tổng điểm"
          labelCol={{ span: 24 }}
        >
          <Input size="large" min={10} type="number" addonAfter="Điểm" />
        </Form.Item>
        <Form.Item
          name="testType"
          label="Dạng đề"
          labelCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: "Vui lòng chọn dạng đề",
            },
          ]}
        >
          <Select size="large" options={examOptions} />
        </Form.Item>
        <Form.Item
          name="testBankId"
          label="Ngân hàng đề"
          labelCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: "Vui lòng chọn dạng đề",
            },
          ]}
        >
          <Select size="large" options={examBankOptions} />
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

export default FormUpdateInfo;
