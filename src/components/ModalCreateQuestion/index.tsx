import { IMAGES } from "@/constants/images";
import { IAnswers, Subject } from "@/models";
import { useAuth } from "@/providers/authProvider";
import { useLoading } from "@/providers/loadingProvider";
import { createQuestion, getSubject, uploadImg } from "@/services";
import {
  CheckSquareOutlined,
  FormOutlined,
  FullscreenExitOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Radio, Select, Upload } from "antd";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import MathEditor from "../MathEditor";
const { TextArea } = Input;

type props = {
  onClose: () => void;
  bankId: string | string[];
  fetchQuestion: () => Promise<void>;
};

const difficultyOptions = [
  { label: "Cơ bản", value: 0 },
  { label: "Trung bình", value: 1 },
  { label: "Nâng cao", value: 2 },
  { label: "Chuyên gia", value: 3 },
  { label: "Học thuật", value: 4 },
];
const typeOptions = [
  { icon: <FullscreenExitOutlined />, label: "Chọn một", value: 0 },
  {
    icon: <CheckSquareOutlined />,
    label: "Chọn nhiều",
    value: 1,
  },
  // { icon: <FormOutlined />, label: "Tự luận", value: 2 },
];

const ModalCreateQuestion: React.FC<props> = ({
  onClose,
  bankId,
  fetchQuestion,
}) => {
  const { setLoading } = useLoading();
  const [form] = Form.useForm();
  const [type, setType] = useState({ label: "", value: -1 });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { user } = useAuth();

  const handleChangeImage = async ({ file }: { file: any }, name: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file.originFileObj);
    try {
      const res = await uploadImg(formData);
      form.setFieldValue(name, res.url);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi tải ảnh");
    } finally {
      setLoading(false);
    }
  };

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

  const handleTypeQuestion = () => {
    switch (type.value) {
      case 0:
        return (
          <Form
            form={form}
            onFinish={(values) => {
              const hasCorrectAnswer = values.answers.some(
                (answer: any) => answer.isCorrect
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
                  listType="picture-card"
                  maxCount={1}
                  onChange={(info) => handleChangeImage(info, "imageUrl")}
                >
                  Thêm hình
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
              {(fields, { add, remove }) => (
                <Radio.Group
                  className="w-full"
                  onChange={(e) => {
                    const updatedAnswers = form
                      .getFieldValue("answers")
                      .map((answer: any, index: number) => ({
                        ...answer,
                        isCorrect: index === e.target.value,
                      }));
                    form.setFieldsValue({ answers: updatedAnswers });
                  }}
                >
                  {fields.map(({ key, name }, index) => (
                    <div key={key} className="flex items-start gap-4 w-full">
                      <Radio value={index} />
                      <div className="flex flex-col items-center mb-3 w-full gap-4">
                        <Form.Item
                          name={[name, "content"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập câu trả lời",
                            },
                          ]}
                          className="w-full"
                        >
                          <MathEditor />
                        </Form.Item>
                        <Form.Item name={[name, "imageUrl"]} noStyle>
                          <Upload
                            listType="picture-card"
                            maxCount={1}
                            onChange={(info) =>
                              handleChangeImage(info, [
                                "answers",
                                name,
                                "imageUrl",
                              ])
                            }
                          >
                            Thêm hình
                          </Upload>
                        </Form.Item>
                      </div>
                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{ color: "red" }}
                        />
                      )}
                    </div>
                  ))}
                  {fields.length < 4 && (
                    <div className="flex w-fit justify-end">
                      <Button
                        type="dashed"
                        onClick={() => add({ content: "", isCorrect: false })}
                        block
                        icon={<PlusOutlined />}
                      >
                        Thêm câu trả lời
                      </Button>
                    </div>
                  )}
                </Radio.Group>
              )}
            </Form.List>

            <div className="flex justify-end mt-4">
              <Button type="primary" htmlType="submit">
                Lưu thay đổi
              </Button>
            </div>
          </Form>
        );
      case 1:
        return (
          <Form
            form={form}
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
                  listType="picture-card"
                  maxCount={1}
                  onChange={(info) => handleChangeImage(info, "imageUrl")}
                >
                  Thêm hình
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
              {(fields, { add, remove }) => (
                <Checkbox.Group
                  className="w-full"
                  onChange={(selectedValues) => {
                    const answers = form.getFieldValue("answers");
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
                        <div className="flex flex-col gap-4 items-center w-full">
                          <Form.Item name={[name, "content"]} noStyle>
                            <MathEditor />
                          </Form.Item>

                          <Form.Item name={[name, "imageUrl"]} noStyle>
                            <Upload
                              listType="picture-card"
                              maxCount={1}
                              onChange={(info) =>
                                handleChangeImage(info, [
                                  "answers",
                                  name,
                                  "imageUrl",
                                ])
                              }
                            >
                              Thêm hình
                            </Upload>
                          </Form.Item>
                        </div>

                        {fields.length > 1 && (
                          <MinusCircleOutlined
                            onClick={() => remove(name)}
                            style={{ color: "red" }}
                          />
                        )}
                      </div>
                    </Form.Item>
                  ))}
                  {fields.length < 4 && (
                    <div className="flex justify-end">
                      <Button
                        type="dashed"
                        onClick={() => add({ content: "", isCorrect: false })}
                        block
                        icon={<PlusOutlined />}
                      >
                        Thêm câu trả lời
                      </Button>
                    </div>
                  )}
                </Checkbox.Group>
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
      // case 2:
      // return (
      //   <Form
      //     className="p-4"
      //     form={form}
      //     onFinish={(values) => {
      //       const formattedValues = {
      //         ...values,
      //         answers: Array.isArray(values.answers)
      //           ? values.answers
      //           : [values.answers],
      //       };
      //       onFinish(formattedValues);
      //     }}
      //   >
      //     <div className="flex flex-col items-center w-full">
      //       {user?.Role === "ExamManager" && (
      //         <Form.Item
      //           className="w-full"
      //           name="subjectId"
      //           label="Môn học"
      //           labelCol={{ span: 24 }}
      //           rules={[
      //             {
      //               required: true,
      //               message: "Vui lòng chọn Môn học",
      //             },
      //           ]}
      //         >
      //           <Select
      //             size="large"
      //             options={subjectOptions}
      //             className=" text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
      //             placeholder="Môn học"
      //           />
      //         </Form.Item>
      //       )}
      //       <Form.Item
      //         name="title"
      //         label="Câu hỏi"
      //         labelCol={{ span: 24 }}
      //         rules={[{ required: true, message: "Vui lòng nhập câu hỏi" }]}
      //         className="w-full"
      //       >
      //         <MathEditor />
      //       </Form.Item>
      //       <Form.Item name="imageUrl">
      //         <Upload
      //           listType="picture-card"
      //           maxCount={1}
      //           onChange={(info) => handleChangeImage(info, "imageUrl")}
      //         >
      //           Thêm hình
      //         </Upload>
      //       </Form.Item>
      //     </div>
      //     <Form.Item
      //       name="difficulty"
      //       label="Độ khó"
      //       labelCol={{ span: 24 }}
      //       rules={[{ required: true, message: "Vui lòng chọn độ khó" }]}
      //     >
      //       <Select
      //         options={difficultyOptions}
      //         placeholder="Chọn độ khó"
      //         allowClear
      //       />
      //     </Form.Item>
      //     <Form.List name="answers">
      //       {(fields, { add, remove }) => (
      //         <>
      //           <Form.Item
      //             name="content"
      //             label="Câu trả lời mẫu"
      //             labelCol={{ span: 24 }}
      //             rules={[
      //               {
      //                 required: true,
      //                 message: "Vui lòng nhập câu trả lời mẫu",
      //               },
      //             ]}
      //           >
      //             <MathEditor />
      //           </Form.Item>
      //           <Form.Item name="isCorrect" initialValue={true} hidden>
      //             <Input type="hidden" />
      //           </Form.Item>
      //         </>
      //       )}
      //     </Form.List>
      //     <div className="flex justify-end">
      //       <Form.Item>
      //         <button
      //           type="submit"
      //           className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      //         >
      //           Lưu thay đổi
      //         </button>
      //       </Form.Item>
      //     </div>
      //   </Form>
      // );
      default:
        return "";
    }
  };
  const onFinish = async (values: any) => {
    try {
      const res = await createQuestion({ ...values, type: type.value }, bankId);
      if (res) {
        toast.success("Tạo câu hỏi thành công!");
        fetchQuestion();
        onClose();
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
      return;
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
      <div className="relative p-4 w-full max-w-xl max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tạo câu hỏi
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
          {type.value === -1 ? (
            <div className="bg-white rounded-xl shadow">
              <div className="flex items-center justify-between p-2 md:p-3 border-b-[1.5px] bg-gray-50 rounded-t-xl">
                <h3 className="text-xl font-bold text-center w-full text-gray-900 m-0">
                  Chọn loại câu hỏi
                </h3>
              </div>
              <div className="flex flex-row flex-wrap justify-center items-center gap-3 p-6">
                {typeOptions.map((i, ix) => (
                  <div
                    key={ix}
                    onClick={() => setType(i)}
                    role="button"
                    className="hover:bg-gray-100"
                    style={{
                      width: 170,
                      border: "1px dashed black",
                      padding: "10px 0",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >
                    <div className="cursor-pointer">{i.icon}</div>
                    <p className="mb-0 font-semibold">{i.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <img
                src={IMAGES.arrowRight}
                alt="back"
                className="rotate-180 bg-[#1244A2] rounded-full mx-4 my-2 cursor-pointer"
                onClick={() => setType({ label: "", value: -1 })}
              />
              <div className="max-h-[500px] overflow-y-auto">
                {handleTypeQuestion()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalCreateQuestion;
