import { IExamBank, Subject } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { createTest, getExamBankAll, getSubject } from "@/services";
import { Form, Input, InputNumber, Select } from "antd";
import React, { useEffect, useState } from "react";

type props = {
  onClose: () => void;
  fetchExam: () => Promise<void>;
};

const ModalCreateTest: React.FC<props> = ({ onClose, fetchExam }) => {
  const [form] = Form.useForm();
  const { setLoading } = useLoading();
  const [examBank, setExamBank] = useState<IExamBank[]>([]);
  const [subject, setSubject] = useState<Subject[]>([]);

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
  const examBankOptions = examBank.map((subject: IExamBank) => {
    return { label: subject.testBankName, value: subject.id };
  });
  const subjectOptions = subject.map((item) => ({
    label: item.subjectName,
    value: item.id,
  }));
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await createTest(values);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      onClose();
      fetchExam();
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
              Tạo kì thi mới
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
                label="Tên kì thi"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên kì thi",
                  },
                ]}
                className="col-span-2 mb-0"
                name="examName"
              >
                <input
                  type="text"
                  className="0 border  text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Tên kì thi"
                />
              </Form.Item>

              <Form.Item
                label="Giá"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá",
                  },
                ]}
                className="col-span-2 sm:col-span-1 mb-0"
                name="length"
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
                label="Số lần miễn phí"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lần miễn phí",
                  },
                ]}
                className="col-span-2 sm:col-span-1 mb-0"
                name="freeAttempts"
              >
                <InputNumber
                  min={0}
                  formatter={(value: any) => {
                    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  }}
                  parser={(value: any) => {
                    return value.replace(/\$\s?|(,*)/g, "").replace("", "");
                  }}
                  className="rounded-md w-full bg-white"
                />
              </Form.Item>

              <Form.Item
                className="col-span-2 mb-0"
                name="testBankId"
                label="Môn học"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn Môn học",
                  },
                ]}
              >
                <Select
                  size="large"
                  options={subjectOptions}
                  className="   text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Môn học"
                />
              </Form.Item>
              <Form.Item
                className="col-span-2  mb-0"
                name="testType"
                label="Ngân hàng đề"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngân hàng đề",
                  },
                ]}
              >
                <Select
                  size="large"
                  options={examBankOptions}
                  className="   text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="ngân hàng đề"
                />
              </Form.Item>
              <Form.Item
                className="col-span-2  mb-0"
                name="description"
                label="Mô tả"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả",
                  },
                ]}
              >
                <textarea
                  className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Mô tả"
                />
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

export default ModalCreateTest;
