"use client";
import { questionEnum } from "@/constants/enum";
import { IAnswers, IQuestion, Subject } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import {
  getQuestionDetail,
  getSubject,
  updateQuestion,
  uploadImg,
} from "@/services";
import { Button, Checkbox, Form, Input, Radio, Select, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import MathEditor from "@/components/MathEditor";
import { useAuth } from "@/providers/authProvider";
const { TextArea } = Input;
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
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { user } = useAuth();
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
      setLoading(true);
      const res = await updateQuestion(values, question.id);
      if (res) {
        toast.success("Sửa câu hỏi thành công!");
        fetchQuestion();
        handleClose();
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err.response.data.message);
      return;
    } finally {
      setLoading(false);
    }
  };
  const handleChangeImage = async (
    { file }: { file: any },
    name: any,
    key: string | number
  ) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file.originFileObj);

    try {
      const res = await uploadImg(formData);

      if (name === "imageUrl") {
        const newImage = {
          uid: `-${Date.now()}`,
          name: file.name,
          status: "done" as const,
          url: res.url,
        };

        setImageUrl(newImage);
        form.setFieldValue(name, res.url);
      } else if (name[0] === "answers" && key) {
        setAnswersImage((prev) => ({
          ...prev,
          [key]: [
            {
              uid: `-${Date.now()}`,
              name: file.name,
              status: "done" as const,
              url: res.url,
            },
          ],
        }));

        const currentAnswers = form.getFieldValue("answers") || [];
        form.setFieldsValue({
          answers: currentAnswers.map((answer: any, i: number) => {
            const answerKey = answer.id || `temp-${i}`;
            return answerKey === key
              ? { ...answer, imageUrl: res.url }
              : answer;
          }),
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi tải ảnh");
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    if (data?.imageUrl) {
      const initialImg = {
        uid: `-${data.id}`,
        name: `image${data.id}.png`,
        status: "done" as const,
        url: data.imageUrl,
      };
      form.setFieldValue(name, data.imageUrl);
      setImageUrl(initialImg);
    }
  }, []);

  const [answersImage, setAnswersImage] = useState<
    Record<
      string | number,
      {
        uid: string;
        name: string;
        status: "uploading" | "done" | "error" | "removed";
        url: string;
      }[]
    >
  >({});

  useEffect(() => {
    if (question?.answers) {
      const formattedAnswers = question.answers.reduce((acc, answer, index) => {
        const key = answer.id || `temp-${index}`;
        acc[key] = answer.imageUrl
          ? [
              {
                uid: `-${answer.id || index}`,
                name: `image-${answer.id || index}.png`,
                status: "done" as const,
                url: answer.imageUrl,
              },
            ]
          : [];
        return acc;
      }, {} as Record<string | number, any[]>);

      setAnswersImage(formattedAnswers);

      // Cập nhật form values
      form.setFieldsValue({
        answers: question.answers.map((answer, index) => ({
          ...answer,
          id: answer.id || `temp-${index}`,
          content: answer.content,
          imageUrl: answer.imageUrl || null,
        })),
      });
    }
  }, [question]);
  const fetchSubject = async () => {
    try {
      setLoading(true);
      const res = await getSubject();
      if (res) {
        setSubjects(res.data);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSubject();
  }, []);

  if (!subjects) return <></>;
  const subjectOptions = subjects.map((subject: Subject) => {
    return { label: subject.subjectName, value: subject.id };
  });

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
            <div className="flex flex-col items-center w-full">
              {user?.Role === "ExamManager" && (
                <Form.Item
                  className="w-full"
                  name="subjectId"
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
                    className=" text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Môn học"
                  />
                </Form.Item>
              )}
              <Form.Item
                name="title"
                label="Câu hỏi"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: "Vui lòng nhập câu hỏi" }]}
                className="w-full"
              >
                <MathEditor />
              </Form.Item>
              <Form.Item name="imageUrl">
                <Upload
                  onChange={(info) =>
                    handleChangeImage(
                      info,
                      "imageUrl",
                      form.getFieldValue(["answers", name, "id"]) ||
                        `temp-${name}`
                    )
                  }
                  listType="picture-card"
                  maxCount={1}
                  fileList={imageUrl ? [imageUrl] : []}
                >
                  {form.getFieldValue("imageUrl")?.length >= 1
                    ? "Đổi hình"
                    : "thêm hình"}
                </Upload>
              </Form.Item>
            </div>

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
                    {fields.map(({ key, name }, index) => {
                      return (
                        <Form.Item key={key} className="w-full">
                          <div className="flex w-full items-start gap-8">
                            <Radio value={index} />
                            <div className="flex flex-col items-center w-full gap-4">
                              <Form.Item name={[name, "content"]} noStyle>
                                <MathEditor />
                              </Form.Item>
                              <Form.Item name={[name, "imageUrl"]} noStyle>
                                <Upload
                                  listType="picture-card"
                                  onChange={(info) =>
                                    handleChangeImage(
                                      info,
                                      ["answers", name, "imageUrl"],
                                      form.getFieldValue([
                                        "answers",
                                        name,
                                        "id",
                                      ]) || `temp-${name}`
                                    )
                                  }
                                  maxCount={1}
                                  fileList={
                                    answersImage[
                                      form.getFieldValue([
                                        "answers",
                                        name,
                                        "id",
                                      ]) || `temp-${name}`
                                    ] || []
                                  }
                                >
                                  {form.getFieldValue([
                                    "answers",
                                    index,
                                    "imageUrl",
                                  ])?.length >= 1
                                    ? "Đổi hình"
                                    : "Thêm hình"}
                                </Upload>
                              </Form.Item>
                            </div>
                            <div
                              style={{ cursor: "pointer", color: "red" }}
                              onClick={() => remove(name)}
                            >
                              Xoá
                            </div>
                          </div>
                        </Form.Item>
                      );
                    })}
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
            <div className="flex flex-col items-center w-full">
              {user?.Role === "ExamManager" && (
                <Form.Item
                  className="w-full"
                  name="subjectId"
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
                    className=" text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Môn học"
                  />
                </Form.Item>
              )}
              <Form.Item
                name="title"
                label="Câu hỏi"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: "Vui lòng nhập câu hỏi" }]}
                className="w-full"
              >
                <MathEditor />
              </Form.Item>
              <Form.Item name="imageUrl">
                <Upload
                  onChange={(info) =>
                    handleChangeImage(
                      info,
                      "imageUrl",
                      form.getFieldValue(["answers", name, "id"]) ||
                        `temp-${name}`
                    )
                  }
                  listType="picture-card"
                  maxCount={1}
                  fileList={imageUrl ? [imageUrl] : []}
                >
                  {form.getFieldValue("imageUrl")?.length >= 1
                    ? "Đổi hình"
                    : "thêm hình"}
                </Upload>
              </Form.Item>
            </div>
            <Form.Item name="type" initialValue={1} hidden>
              <Input type="hidden" />
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
                        <div className="flex w-full items-start gap-8">
                          <Checkbox value={index} />
                          <div className="flex flex-col w-full gap-4 items-center">
                            <Form.Item name={[name, "content"]} noStyle>
                              <MathEditor />
                            </Form.Item>
                            <Form.Item name={[name, "imageUrl"]} noStyle>
                              <Upload
                                listType="picture-card"
                                onChange={(info) =>
                                  handleChangeImage(
                                    info,
                                    ["answers", name, "imageUrl"],
                                    form.getFieldValue([
                                      "answers",
                                      name,
                                      "id",
                                    ]) || `temp-${name}`
                                  )
                                }
                                maxCount={1}
                                fileList={
                                  answersImage[
                                    form.getFieldValue([
                                      "answers",
                                      name,
                                      "id",
                                    ]) || `temp-${name}`
                                  ] || []
                                }
                              >
                                {form.getFieldValue([
                                  "answers",
                                  index,
                                  "imageUrl",
                                ])?.length >= 1
                                  ? "Đổi hình"
                                  : "Thêm hình"}
                              </Upload>
                            </Form.Item>
                          </div>
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
            <div className="flex flex-col items-center w-full">
              {user?.Role === "ExamManager" && (
                <Form.Item
                  className="w-full"
                  name="subjectId"
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
                    className=" text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Môn học"
                  />
                </Form.Item>
              )}
              <Form.Item
                name="title"
                label="Câu hỏi"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: "Vui lòng nhập câu hỏi" }]}
                className="w-full"
              >
                <MathEditor />
              </Form.Item>
              <Form.Item name="imageUrl">
                <Upload
                  onChange={(info) =>
                    handleChangeImage(
                      info,
                      "imageUrl",
                      form.getFieldValue(["answers", name, "id"]) ||
                        `temp-${name}`
                    )
                  }
                  listType="picture-card"
                  maxCount={1}
                  fileList={imageUrl ? [imageUrl] : []}
                >
                  {form.getFieldValue("imageUrl")?.length >= 1
                    ? "Đổi hình"
                    : "thêm hình"}
                </Upload>
              </Form.Item>
            </div>
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
            <Form.Item name="type" initialValue={2} hidden>
              <Input type="hidden" />
            </Form.Item>
            <Form.List name="answers">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="flex gap-2 items-center w-full">
                      <Form.Item
                        {...restField}
                        className="w-full"
                        name={[name, "content"]}
                        label="Câu trả lời"
                        labelCol={{ span: 24 }}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập câu trả lời",
                          },
                        ]}
                      >
                        <MathEditor />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "isCorrect"]}
                        // initialValue={false}
                        valuePropName="checked"
                        hidden
                      >
                        <Input type="hidden" />
                      </Form.Item>
                    </div>
                  ))}
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
      <div className="relative p-4 w-full max-w-xl max-h-full">
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
          <div className="p-4 flex flex-col gap-2 max-h-[600px] overflow-y-auto">
            {handleTypeQuestion()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
