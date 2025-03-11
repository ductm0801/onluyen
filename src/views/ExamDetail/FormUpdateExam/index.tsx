import Paging from "@/components/Paging";
import { IMAGES } from "@/constants/images";
import { IExam, IQuestion, IQuestionBank } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import {
  getQuestionBank,
  getQuestionByBank,
  updateExamQuestion,
} from "@/services";
import QuestionDetail from "@/views/Question/Detail";
import { Button, Select } from "antd";
import _ from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  exam: IExam | undefined;
  id: string | string[];
};
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

const FormUpdateExam: React.FC<Props> = ({ exam, id }) => {
  const [dataQuestion, setDataQuestion] = useState<IQuestion[]>([]);
  const [questionBank, setQuestionBank] = useState<IQuestionBank[]>([]);
  const [activeQuestionBank, setActiveQuestionBank] = useState({
    label: "",
    value: "",
  });
  const { setLoading } = useLoading();
  const [detail, setDetail] = useState(false);

  const qDetail = useRef<IQuestion | null>(null);
  const [examQuestions, setExamQuestions] = useState<IQuestion[]>(
    exam?.questions || []
  );
  const [isDraggingOverExam, setIsDraggingOverExam] = useState(false);
  const [isDraggingOverBank, setIsDraggingOverBank] = useState(false);
  const [filter, setFilter] = useState({
    type: "",
    difficulty: "",
    search: "",
  });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchQuestionBank = async () => {
    try {
      setLoading(true);
      const res = await getQuestionBank();
      if (res) {
        setQuestionBank(res.data);
        setActiveQuestionBank({
          label: res.data[0].questionBankName,
          value: res.data[0].id,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQuestionBank();
  }, []);
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const response = await getQuestionByBank(
          activeQuestionBank.value,
          currentPage,
          pageSize,
          filter
        );
        if (response) {
          setDataQuestion(response.data.items);
          setTotalItems(response.data.totalItemsCount);
          setTotalPages(response.data.totalPageCount);
        }
        if (response) {
          setDataQuestion(response.data.items);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [activeQuestionBank, filter, currentPage]);
  if (!exam) return null;

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    question: IQuestion
  ) => {
    e.dataTransfer.setData("questionId", question.id);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    target: "exam" | "bank"
  ) => {
    e.preventDefault();
    const questionId = e.dataTransfer.getData("questionId");
    const question =
      dataQuestion.find((q) => q.id === questionId) ||
      examQuestions.find((q) => q.id === questionId);

    if (!question) return;

    if (target === "exam") {
      if (!examQuestions.some((q) => q.id === question.id)) {
        setExamQuestions([...examQuestions, question]);
        setDataQuestion(dataQuestion.filter((q) => q.id !== question.id));
      }
    } else {
      if (!dataQuestion.some((q) => q.id === question.id)) {
        setDataQuestion([...dataQuestion, question]);
      }
      setExamQuestions(examQuestions.filter((q) => q.id !== question.id));
    }
  };

  const handleUpdateExam = async () => {
    try {
      const dataQuestionId = examQuestions.map((q) => q.id);
      setLoading(true);
      await updateExamQuestion(id, dataQuestionId);
      toast.success("Cập nhật thành công!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (item: IQuestion) => {
    setDetail(true);
    qDetail.current = item;
  };
  const handleCloseDetail = () => {
    setDetail(false);
    qDetail.current = null;
  };
  const bankOptions = questionBank.map((item) => ({
    label: item.questionBankName,
    value: item.id,
  }));

  const handleSearch = useCallback(
    _.debounce((value) => {
      setFilter((prev) => ({ ...prev, search: value }));
    }, 1000),
    []
  );
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-center">
        Quản lí câu hỏi trong đề
      </h1>
      <div className="flex items-stretch justify-between gap-4">
        <div className="w-full flex flex-col gap-2">
          <p className="text-xl font-bold">Câu hỏi</p>
          <Select options={bankOptions} value={activeQuestionBank} />
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
          <div
            className={`border h-full  overflow-auto  min-h-[500px] rounded-xl p-4 flex flex-col gap-2 transition-all duration-300 ${
              isDraggingOverBank ? "bg-blue-100 border-blue-400" : "bg-white"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingOverBank(true);
            }}
            onDragLeave={() => setIsDraggingOverBank(false)}
            onDrop={(e) => {
              handleDrop(e, "bank");
              setIsDraggingOverBank(false);
            }}
          >
            {dataQuestion
              .filter(
                (question) =>
                  !examQuestions.some((selected) => selected.id === question.id)
              )
              .map((question) => (
                <div
                  key={question.id}
                  className="bg-gray-400 p-2 flex items-center justify-between gap-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-500 dragging:opacity-70"
                  draggable
                  onDragStart={(e) => handleDragStart(e, question)}
                >
                  <p dangerouslySetInnerHTML={{ __html: question.title }} />{" "}
                  <img
                    src={IMAGES.editIcon}
                    alt="icon"
                    className="w-4"
                    onClick={() => handleOpenDetail(question)}
                  />
                </div>
              ))}
            <Paging
              pageSize={pageSize}
              currentPage={currentPage}
              totalItems={totalItems}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold">Câu hỏi trong đề</p>
            <p>
              tổng <b>{examQuestions.length}</b> câu hỏi
            </p>
          </div>
          <div
            className={`w-full h-full overflow-auto  flex flex-col gap-2 border min-h-[500px] rounded-xl p-4 transition-all duration-300 ${
              isDraggingOverExam ? "bg-green-100 border-green-400" : "bg-white"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingOverExam(true);
            }}
            onDragLeave={() => setIsDraggingOverExam(false)}
            onDrop={(e) => {
              handleDrop(e, "exam");
              setIsDraggingOverExam(false);
            }}
          >
            {examQuestions.map((question) => (
              <div
                key={question.id}
                className="bg-gray-400 p-2 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-500 dragging:opacity-70"
                draggable
                onDragStart={(e) => handleDragStart(e, question)}
              >
                <p dangerouslySetInnerHTML={{ __html: question.title }} />
                <img
                  src={IMAGES.editIcon}
                  alt="icon"
                  className="w-4"
                  onClick={() => handleOpenDetail(question)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => handleUpdateExam()} type="primary" size="large">
          Cập nhật
        </Button>
      </div>
      {detail && (
        <QuestionDetail
          data={qDetail.current}
          open={detail}
          handleClose={handleCloseDetail}
          fetchQuestion={fetchQuestionBank}
        />
      )}
    </div>
  );
};

export default FormUpdateExam;
