import React, { useEffect, useState } from "react";
import { IMAGES } from "@/constants/images";
import { IExam, IQuestion, IQuestionBank } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import {
  getQuestionBank,
  getQuestionByBank,
  updateExamQuestion,
} from "@/services";
import { Button } from "antd";
import { toast } from "react-toastify";

type Props = {
  exam: IExam | undefined;
  id: string | string[];
};

const FormUpdateExam: React.FC<Props> = ({ exam, id }) => {
  const [dataQuestion, setDataQuestion] = useState<IQuestion[]>([]);
  const [questionBank, setQuestionBank] = useState<IQuestionBank[]>([]);
  const [activeQuestionBank, setActiveQuestionBank] = useState<IQuestionBank>();
  const { setLoading } = useLoading();
  const [examQuestions, setExamQuestions] = useState<IQuestion[]>(
    exam?.questions || []
  );
  const [isDraggingOverExam, setIsDraggingOverExam] = useState(false);
  const [isDraggingOverBank, setIsDraggingOverBank] = useState(false);

  useEffect(() => {
    const fetchQuestionBank = async () => {
      try {
        setLoading(true);
        const res = await getQuestionBank();
        if (res) {
          setQuestionBank(res.data);
          setActiveQuestionBank(res.data[0]);

          const response = await getQuestionByBank(res.data[0].id, 0, 10);
          if (response) {
            setDataQuestion(response.data.items);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionBank();
  }, []);

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
      // Kiểm tra nếu câu hỏi đã có trong danh sách `dataQuestion` thì không thêm lại nữa
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

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-center">
        Quản lí câu hỏi trong đề
      </h1>
      <div className="flex items-center justify-between gap-4">
        <div className="w-full flex flex-col gap-2">
          <p className="text-xl font-bold">Câu hỏi</p>
          <div
            className={`border min-h-[500px] rounded-xl p-4 flex flex-col gap-2 transition-all duration-300 ${
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
                  className="bg-gray-400 p-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-500 dragging:opacity-70"
                  draggable
                  onDragStart={(e) => handleDragStart(e, question)}
                >
                  {question.title}
                </div>
              ))}
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
            className={`w-full flex flex-col gap-2 border min-h-[500px] rounded-xl p-4 transition-all duration-300 ${
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
                className="bg-gray-400 p-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-500 dragging:opacity-70"
                draggable
                onDragStart={(e) => handleDragStart(e, question)}
              >
                {question.title}
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
    </div>
  );
};

export default FormUpdateExam;
