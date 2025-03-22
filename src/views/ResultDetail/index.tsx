"use client";
import CircularProgess from "@/components/CircularProgress";
import { questionEnum } from "@/constants/enum";
import { IExam } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { examResult } from "@/services";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const ResultDetail = () => {
  const [exam, setExam] = useState<IExam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { setLoading } = useLoading();
  const params = useParams();

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (itemRefs.current[currentQuestionIndex]) {
      itemRefs.current[currentQuestionIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentQuestionIndex]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const res = await examResult(params.id, 0, 100);
      setExam(res.data);
    } catch (e) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchResult();
  }, []);
  if (!exam) return;
  const currentQuestion = exam.questions[currentQuestionIndex];
  return (
    <div className="bg-white min-h-[50rem] w-full rounded-[10px] shadow-[0px_0px_5px_rgba(0, 0, 0, 0.1)]">
      <div className="flex justify-between items-center pb-16">
        <div className="flex items-center gap-4"></div>
      </div>

      <div className="flex">
        <div className="flex-1 flex flex-col gap-4">
          <h5>
            Câu hỏi {currentQuestionIndex + 1} trên {exam.questions.length}
          </h5>
          <p
            className="text-2xl font-bold"
            dangerouslySetInnerHTML={{ __html: currentQuestion.title }}
          ></p>{" "}
          <span>{questionEnum[currentQuestion.type]}</span>
          <ul className="flex flex-wrap gap-8 mt-4">
            {currentQuestion.answers.map((answer, index) => {
              const isSelected = answer.isSelected;
              const isCorrect = answer.isCorrect;
              const isWrongSelected = isSelected && !isCorrect;

              return (
                <li
                  key={answer.id}
                  className={`w-[40%] py-4 px-8 shadow-[0px_0px_3px_rgba(0,0,0,0.3)] rounded-xl cursor-pointer flex items-center
          ${
            isCorrect
              ? "bg-green-100 text-green-500 border-green-500"
              : isWrongSelected
              ? "bg-red-100 text-red-500 border-red-500"
              : "bg-gray-100 text-gray-500 border-gray-300"
          }`}
                >
                  <span>{String.fromCharCode(65 + index)}.</span>
                  <span
                    className="ml-4"
                    dangerouslySetInnerHTML={{ __html: answer.content }}
                  ></span>
                </li>
              );
            })}
            {!currentQuestion.answers.some((answer) => answer.isSelected) && (
              <p className="w-full text-center text-red-500 font-semibold mt-4">
                Bạn chưa chọn đáp án nào!
              </p>
            )}
          </ul>
          {currentQuestion.type === 2 && (
            <textarea
              className="w-[80%] p-4 border rounded-md"
              placeholder="Nhập câu trả lời của bạn..."
              value={currentQuestion?.answerText || ""}
            />
          )}
        </div>
        <div className="relative mt-12">
          <CircularProgess
            className="flex-shrink-0 w-[120px] aspect-square"
            gaugePrimaryColor="#FDB022"
            gaugeSecondaryColor="#1244A2"
            max={exam.totalGrade}
            min={0}
            value={Math.round(exam.studentGrade)}
            isPercent={false}
          />
        </div>
      </div>

      <div className="flex gap-6 mt-20">
        <button
          className="py-1 px-4 text-sm flex-shrink-0 border border-[#273d30] text-[#273d30] rounded-xl"
          disabled={currentQuestionIndex === 0}
          onClick={() =>
            setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
          }
        >
          Câu trước
        </button>
        <ul
          ref={listRef}
          className="flex items-center gap-6 w-[75%] overflow-x-auto p-[1px]"
        >
          {exam.questions.map((q, index) => (
            <li
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              key={q.id}
              className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg text-center shadow-[0px_0px_3px_rgba(0,0,0,0.3)] cursor-pointer 
            ${index === currentQuestionIndex ? "border-2 border-[#273d30]" : ""}
           `}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </li>
          ))}
        </ul>
        <button
          className="py-1 px-4 flex-shrink-0 text-sm border border-[#273d30] text-[#273d30] rounded-xl"
          disabled={currentQuestionIndex === exam.questions.length - 1}
          onClick={() =>
            setCurrentQuestionIndex((prev) =>
              Math.min(prev + 1, exam.questions.length - 1)
            )
          }
        >
          Câu sau
        </button>
      </div>
    </div>
  );
};

export default ResultDetail;
