"use client";
import Paging from "@/components/Paging";
import { difficultyEnum, questionEnum } from "@/constants/enum";
import { IQuestion, IQuestionBank, Subject } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import {
  createBulkQuestion,
  deleteQuestion,
  downloadExcelTemplate,
  getQuestionBank,
  getQuestionByBank,
  getSubject,
  previewExcelTemplate,
} from "@/services";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import QuestionDetail from "../Question/Detail";
import ModalCreateQuestion from "@/components/ModalCreateQuestion";
import { Button, Form, Modal, Select, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import _ from "lodash";
import { toast } from "react-toastify";
import { renderMathContent } from "@/constants/utils";
import { useAuth } from "@/providers/authProvider";

const cols = [
  {
    name: "Câu hỏi",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg ",
  },
  //   {
  //     name: "Mô tả",
  //     className:
  //       "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  //   },
  {
    name: "Độ khó",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Loại",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Môn học",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Hành động",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-e-lg",
  },
];
const type = [
  { label: "Chọn một", value: 0 },
  { label: "Chọn nhiều", value: 1 },
  { label: "Tự luận", value: 2 },
];
const difficulty = [
  { label: "Cơ bản", value: 0 },
  { label: "Trung bình", value: 1 },
  { label: "Nâng cao", value: 2 },
  { label: "chuyên gia", value: 3 },
  { label: "Học thuật", value: 4 },
];

const BankDetail = () => {
  const [question, setQuestion] = useState<IQuestion[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { setLoading } = useLoading();
  const params = useParams();
  const router = useRouter();
  const [detail, setDetail] = useState(false);
  const [create, setCreate] = useState(false);
  const qDetail = useRef<IQuestion | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [questionId, setQuestionId] = useState("");
  const [createBulk, setCreateBulk] = useState(false);
  const [subject, setSubject] = useState<Subject[]>([]);
  const [validQuestion, setValidQuestion] = useState<any[]>([]);
  const [invalidQuestion, setInvalidQuestion] = useState<any[]>([]);
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState({
    type: "",
    difficulty: "",
    search: "",
    subjectId: "",
  });

  const handleDeleteQuestion = async () => {
    try {
      setLoading(true);
      await deleteQuestion(questionId);
      setConfirm(false);
      setQuestionId("");
      fetchQuestion();
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirm = (id: string) => {
    setConfirm(true);
    setQuestionId(id);
  };
  const handleCloseConfirm = () => {
    setConfirm(false);
    setQuestionId("");
  };

  const handleOpenDetail = (item: IQuestion) => {
    setDetail(true);
    qDetail.current = item;
  };
  const handleCloseDetail = () => {
    setDetail(false);
    qDetail.current = null;
  };
  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const res = await getQuestionByBank(
        params.id,
        currentPage,
        pageSize,
        filter
      );
      if (res) {
        setQuestion(res.data.items);
        setTotalItems(res.data.totalItemsCount);
        setTotalPages(res.data.totalPageCount);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQuestion();
  }, [currentPage, filter]);

  const handleSearch = useCallback(
    _.debounce((value) => {
      setFilter((prev) => ({ ...prev, search: value }));
    }, 1000),
    []
  );
  const handleDownload = async () => {
    try {
      setLoading(true);
      const res = await downloadExcelTemplate();
      if (res) {
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "question_template.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error downloading file:", error);
    } finally {
      setLoading(false);
    }
  };
  const handlePreview = async (values: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", values.file.file.originFileObj);
      const res = await previewExcelTemplate(formData);
      setValidQuestion(res.questions.validQuestions);
      setInvalidQuestion(res.questions.errors);
    } catch (error) {
      setLoading(false);
      console.error("Error downloading file:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleConfirm = () => {
    if (invalidQuestion.length > 0) {
      Modal.confirm({
        title: "Xác nhận tạo câu hỏi",
        content: `Bạn đang có ${invalidQuestion.length} câu hỏi không hợp lệ. Bạn có chắc chắn muốn tạo câu hỏi không?`,
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: async () => {
          await handleCreateBulkQuestion();
        },
      });
      return;
    }
    handleCreateBulkQuestion();
  };
  const handleCreateBulkQuestion = async () => {
    try {
      setLoading(true);
      await createBulkQuestion(validQuestion, params.id);
      toast.success("Tạo câu hỏi thành công");
      handleCloseCreateBulk();
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      handleCloseCreateBulk();
      fetchQuestion();
    }
  };
  const handleCloseCreateBulk = () => {
    setCreateBulk(false);
    setValidQuestion([]);
    setInvalidQuestion([]);
  };

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

  return (
    <>
      <div className="relative overflow-x-auto">
        <div className="flex justify-between  items-center  flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
          <div className="flex w-full flex-shrink-0 pb-2 gap-4">
            <div
              className="bg-[#ffc022] rounded-lg px-3 py-2 cursor-pointer"
              onClick={() => setCreate(true)}
            >
              Tạo câu hỏi mới
            </div>
            <div
              className="bg-blue-600 ml-auto text-white rounded-lg px-3 py-2 cursor-pointer"
              onClick={() => setCreateBulk(true)}
            >
              Tạo câu hỏi từ excel
            </div>
            <div
              className="bg-blue-600 text-white rounded-lg px-3 py-2 cursor-pointer"
              onClick={() => handleDownload()}
            >
              Tải excel mẫu
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              placeholder="Độ khó"
              options={difficulty}
              allowClear
              onChange={(value) =>
                setFilter({
                  ...filter,
                  difficulty: value,
                })
              }
            />
            <Select
              placeholder="Dạng câu hỏi"
              options={type}
              allowClear
              onChange={(value) =>
                setFilter({
                  ...filter,
                  type: value,
                })
              }
            />
            {user?.Role === "ExamManager" && (
              <Select
                options={subject.map((item) => ({
                  label: item.subjectName,
                  value: item.id,
                }))}
                allowClear
                placeholder="Chọn môn học"
                onChange={(value) =>
                  setFilter({
                    ...filter,
                    subjectId: value,
                  })
                }
                showSearch
              />
            )}
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
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
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
            {question &&
              question
                .filter((a) => !a.isDeleted)
                .map((a, idx) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={idx}
                  >
                    <th
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white max-w-[300px]"
                    >
                      <div
                        className="text-base font-semibold truncate"
                        dangerouslySetInnerHTML={{
                          __html: renderMathContent(a?.title),
                        }}
                      ></div>
                    </th>
                    {/* <td className="px-6 py-4">{a.testName}</td> */}
                    <td className="px-6 py-4 ">
                      {difficultyEnum[a.difficulty]}
                    </td>
                    <td className="px-6 py-4">{questionEnum[a.type]}</td>
                    <td className="px-6 py-4">{a.subjectName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer ms-3"
                          onClick={() => handleOpenDetail(a)}
                        >
                          Chi tiết
                        </div>
                        <div
                          className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer ms-3"
                          onClick={() => handleOpenConfirm(a.id)}
                        >
                          Xóa
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
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
      {detail && (
        <QuestionDetail
          data={qDetail.current}
          open={detail}
          handleClose={handleCloseDetail}
          fetchQuestion={fetchQuestion}
        />
      )}
      {create && (
        <ModalCreateQuestion
          onClose={() => setCreate(false)}
          fetchQuestion={fetchQuestion}
          bankId={params.id}
        />
      )}
      {confirm && (
        <Modal
          title="Xóa câu hỏi"
          open={confirm}
          onOk={handleDeleteQuestion}
          onCancel={handleCloseConfirm}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          Bạn có chắc muốn xóa câu hỏi này?
        </Modal>
      )}
      {createBulk && (
        <Modal
          title={
            validQuestion.length > 0 || invalidQuestion.length > 0
              ? "Xem trước câu hỏi"
              : "Tạo câu hỏi từ excel"
          }
          open={createBulk}
          onCancel={() => handleCloseCreateBulk()}
          footer={null}
        >
          <>
            {validQuestion.length > 0 || invalidQuestion.length > 0 ? (
              <div>
                <div className="flex items-center gap-4 border-b mb-4">
                  <div
                    onClick={() => setActive(0)}
                    className={`${
                      active === 0
                        ? "text-blue-600 bg-gray-300 rounded-t-lg px-3 py-2"
                        : ""
                    } cursor-pointer`}
                  >
                    Câu hỏi hợp lệ: {validQuestion.length} câu hỏi
                  </div>
                  <div
                    onClick={() => setActive(1)}
                    className={`${
                      active === 1
                        ? "text-blue-600 bg-gray-300 rounded-t-lg px-3 py-2"
                        : ""
                    } cursor-pointer`}
                  >
                    Câu hỏi không hợp lệ: {invalidQuestion.length} câu hỏi
                  </div>
                </div>
                {active === 0 ? (
                  <ul className="text-gray-700 flex flex-col gap-2">
                    {validQuestion.map((question, index) => (
                      <li key={index} className="text-sm font-bold">
                        {index + 1}. {question.title}
                        <p>
                          Dạng câu hỏi:
                          {""}{" "}
                          {
                            questionEnum[
                              question.type as keyof typeof questionEnum
                            ]
                          }
                        </p>
                        <ul
                          className={`list-inside font-normal ${
                            question.type === 2 ? "list-none" : "list-disc"
                          } `}
                        >
                          {question.answers?.map(
                            (answer: any, index: number) => (
                              <li
                                key={index}
                                className={`${
                                  answer.isCorrect
                                    ? "text-green-500"
                                    : "text-gray-600"
                                }  `}
                              >
                                {answer.content}
                              </li>
                            )
                          )}
                        </ul>
                        <p className="text-sm text-gray-600">
                          {question.answerText}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-700 flex flex-col gap-2">
                    {invalidQuestion.map((question, index) =>
                      question.errors.map((error: any, idx: number) => (
                        <li
                          key={`${index}-${idx}`}
                          className="text-sm text-red-600"
                        >
                          {idx + 1}. Dòng số {question.rowNumber} {error}
                        </li>
                      ))
                    )}
                  </div>
                )}
                <div
                  className="flex justify-end mt-4"
                  onClick={() => handleConfirm()}
                >
                  <Button type="primary">Xác nhận</Button>
                </div>
              </div>
            ) : (
              <Form form={form} onFinish={handlePreview}>
                <Form.Item name="file">
                  <Upload.Dragger>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p>Kéo thả hoặc click để tải lên</p>
                  </Upload.Dragger>
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit">Tạo câu hỏi</Button>
                </Form.Item>
              </Form>
            )}
          </>
        </Modal>
      )}
    </>
  );
};

export default BankDetail;
