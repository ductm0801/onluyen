"use client";
import { questionEnum } from "@/constants/enum";
import { IAnswers, IQuestion } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getQuestionDetail, updateQuestion } from "@/services";
import { Button, Checkbox, Form, Input, Radio, Select } from "antd";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CombinedEditor from "@/components/CombinedEditor";
import ReactQuill from "react-quill";

const difficultyOptions = [
  { label: "Cơ bản", value: 0 },
  { label: "Trung bình", value: 1 },
  { label: "Nâng cao", value: 2 },
  { label: "Chuyên gia", value: 3 },
  { label: "Học thuật", value: 4 },
];

type props = {
  data: IQuestion | null;
  open: boolean;
  handleClose: () => void;
  fetchQuestion: () => Promise<void>;
};

const QuestionDetail: React.FC<props> = ({
  data,
  open,
  handleClose,
  fetchQuestion,
}) => {
  //   const param = useParams();
  const [question, setQuestion] = useState<IQuestion | undefined>(undefined);
  const { setLoading } = useLoading();
  const [form] = Form.useForm();

  const fetchDetail = async () => {
    try {
      if (!data) return;
      setLoading(true);
      const res = await getQuestionDetail(data.id);
      setQuestion(res.data);
      form.setFieldsValue({
        ...res.data,
        correctAnswer: res.data.answers?.findIndex(
          (a: IAnswers) => a.isCorrect
        ),
      });
    } catch (e) {
      console.log("Error fetching", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  const onFinish = async (values: IQuestion) => {
    try {
      if (!question) return;
      const res = await updateQuestion(values, question.id);
      if (res) {
        toast.success("Sửa câu hỏi thành công!");
        fetchQuestion();
        handleClose();
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
      return;
    } finally {
      setLoading(false);
    }
  };

  if (!question) return <div></div>;
  const handleTypeQuestion = () => {
    switch (question.type) {
      case 0:
        return (
          <Form
            form={form}
            initialValues={question}
            onFinish={(values) => {
              const answers = values.answers || [];
              const hasCorrectAnswer = answers.some(
                (answer: IAnswers) => answer.isCorrect
              );
              if (!hasCorrectAnswer) {
                toast.error("Vui lòng chọn một câu trả lời đúng.");
                return;
              }
              onFinish(values);
            }}
            className="p-4"
          >
            <Form.Item
              name="title"
              label="Câu hỏi"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Vui lòng nhập câu hỏi" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="difficulty"
              label="Độ khó"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Vui lòng chọn độ khó" }]}
            >
              <Select
                options={difficultyOptions}
                placeholder="Chọn độ khó"
                allowClear
              />
            </Form.Item>
            <Form.List name="answers">
              {(fields, { add, remove }) => {
                const selectedValue = (
                  form.getFieldValue("answers") || []
                ).findIndex((answer: IAnswers) => answer.isCorrect);

                return (
                  <Radio.Group
                    className="w-full"
                    value={selectedValue !== -1 ? selectedValue : null}
                    onChange={(e) => {
                      const selectedIndex = e.target.value;
                      const answers = form.getFieldValue("answers") || [];

                      const updatedAnswers = answers.map(
                        (answer: IAnswers, index: number) => ({
                          ...answer,
                          isCorrect: index === selectedIndex,
                        })
                      );

                      form.setFieldsValue({ answers: updatedAnswers });
                    }}
                  >
                    {fields.map(({ key, name }, index) => (
                      <Form.Item key={key} className="w-full">
                        <div className="flex w-full items-center gap-8">
                          <Radio value={index} />
                          <Form.Item name={[name, "content"]} noStyle>
                            <Input />
                          </Form.Item>
                          <div
                            style={{ cursor: "pointer", color: "red" }}
                            onClick={() => remove(name)}
                          >
                            Xoá
                          </div>
                        </div>
                      </Form.Item>
                    ))}
                    <div className="flex justify-start">
                      <Button
                        type="dashed"
                        onClick={() => add({ content: "", isCorrect: false })}
                      >
                        Thêm câu trả lời
                      </Button>
                    </div>
                  </Radio.Group>
                );
              }}
            </Form.List>
            <div className="flex justify-end mt-4">
              <Form.Item>
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Lưu thay đổi
                </button>
              </Form.Item>
            </div>
          </Form>
        );
      case 1:
        return (
          <Form
            form={form}
            initialValues={question}
            onFinish={(values) => {
              const answers = values.answers || [];
              const hasCorrectAnswer = answers.some(
                (answer: IAnswers) => answer.isCorrect
              );
              if (!hasCorrectAnswer) {
                toast.error("Vui lòng chọn ít nhất một câu trả lời đúng.");
                return;
              }
              onFinish(values);
            }}
            className="p-4"
          >
            <Form.Item
              name="title"
              label="Câu hỏi"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Vui lòng nhập câu hỏi" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="difficulty"
              label="Độ khó"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Vui lòng chọn độ khó" }]}
            >
              <Select
                options={difficultyOptions}
                placeholder="Chọn độ khó"
                allowClear
              />
            </Form.Item>
            <Form.List name="answers">
              {(fields, { add, remove }) => {
                const selectedValues = (form.getFieldValue("answers") || [])
                  .map((answer: IAnswers, index: number) =>
                    answer.isCorrect ? index : null
                  )
                  .filter((val: any) => val !== null);

                return (
                  <Checkbox.Group
                    className="w-full"
                    value={selectedValues}
                    onChange={(selectedValues) => {
                      const answers = form.getFieldValue("answers") || [];
                      const updatedAnswers = answers.map(
                        (answer: IAnswers, index: number) => ({
                          ...answer,
                          isCorrect: selectedValues.includes(index),
                        })
                      );
                      form.setFieldsValue({ answers: updatedAnswers });
                    }}
                  >
                    {fields.map(({ key, name }, index) => (
                      <Form.Item key={key} className="w-full">
                        <div className="flex w-full items-center gap-8">
                          <Checkbox value={index} />
                          <Form.Item name={[name, "content"]} noStyle>
                            <Input />
                          </Form.Item>
                          <div
                            style={{ cursor: "pointer", color: "red" }}
                            onClick={() => remove(name)}
                          >
                            Xoá
                          </div>
                        </div>
                      </Form.Item>
                    ))}
                    <div className="flex justify-start">
                      <Button
                        type="dashed"
                        onClick={() => add({ content: "", isCorrect: false })}
                      >
                        Thêm câu trả lời
                      </Button>
                    </div>
                  </Checkbox.Group>
                );
              }}
            </Form.List>
            <div className="flex justify-end mt-4">
              <Form.Item>
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Lưu thay đổi
                </button>
              </Form.Item>
            </div>
          </Form>
        );
      case 2:
        return (
          <Form className="p-4" form={form} onFinish={onFinish}>
            <Form.Item
              name="title"
              label="Câu hỏi"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Vui lòng nhập câu hỏi" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="difficulty"
              label="Độ khó"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Vui lòng chọn độ khó" }]}
            >
              <Select
                options={difficultyOptions}
                placeholder="Chọn độ khó"
                allowClear
              />
            </Form.Item>
            <Form.List name="answers">
              {(fields, { add, remove }) => (
                <>
                  <Form.Item
                    name="content"
                    label="Câu trả lời mẫu"
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập câu trả lời mẫu",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item name="isCorrect" initialValue={true} hidden>
                    <Input type="hidden" />
                  </Form.Item>
                </>
              )}
            </Form.List>
            <div className="flex justify-end">
              <Form.Item>
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Lưu thay đổi
                </button>
              </Form.Item>
            </div>
          </Form>
        );
      default:
        return "";
    }
  };

  return (
    <div
      id="crud-modal"
      tabIndex={-1}
      aria-hidden="true"
      className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black/70"
    >
      <div className="relative p-4 w-full max-w-lg max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Câu hỏi {questionEnum[question.type]}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="crud-modal"
              onClick={handleClose}
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
          <div className="p-4 flex flex-col gap-2">{handleTypeQuestion()}</div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
