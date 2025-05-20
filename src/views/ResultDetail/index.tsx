"use client";
import CircularProgess from "@/components/CircularProgress";
import { questionEnum } from "@/constants/enum";
import { IMAGES } from "@/constants/images";
import { IExam } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { examResult } from "@/services";
import _ from "lodash";
import "katex/contrib/mhchem";
import "katex/dist/katex.min.css";
import { useParams, useRouter } from "next/navigation";
import React, { use, useEffect, useRef, useState } from "react";
import { renderMathContent } from "@/constants/utils";
import { Image } from "antd";

const ResultDetail = () => {
  const [exam, setExam] = useState<IExam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { setLoading } = useLoading();
  const params = useParams();
  const router = useRouter();
  const [activeSubjcet, setActiveSubject] = useState<string | null>(null);

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const subRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (itemRefs.current[currentQuestionIndex]) {
      itemRefs.current[currentQuestionIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentQuestionIndex]);
  useEffect(() => {
    const subjectIndex = activeSubjcet
      ? subjectNames.indexOf(activeSubjcet)
      : -1;
    if (subjectIndex !== -1 && subRefs.current[subjectIndex]) {
      subRefs.current[subjectIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeSubjcet]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const res = await examResult(params.id, 0, 100);
      setExam(res.data);
    } catch (e: any) {
      setLoading(false);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchResult();
  }, []);

  if (!exam) return;
  const groupedQuestions = _.groupBy(exam.questions, "subjectName");
  const subjectNames = Object.keys(groupedQuestions);
  const filteredQuestions = activeSubjcet
    ? exam.questions.filter((q) => q.subjectName === activeSubjcet)
    : exam.questions;

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const selectedQuestionIds = exam.questions
    .filter((q) => q.answers.some((a) => a.isSelected))
    .map((q) => q.id);
  return (
    <div className="bg-white h-[80vh] flex flex-col w-full rounded-[10px] shadow-[0px_0px_5px_rgba(0, 0, 0, 0.1)]">
      <div className="flex justify-between items-center pb-16">
        <div className="flex items-center gap-4"></div>
      </div>

      <div className="flex">
        <div className="flex-1 flex flex-col gap-4">
          <h5>
            Câu hỏi {currentQuestionIndex + 1} trên {filteredQuestions.length}
          </h5>
          <div className="font-bold flex items-start  gap-2 text-lg">
            <div
              className={`${
                !activeSubjcet && "bg-[#F0F4FF] text-[#1E40AF]"
              } border whitespace-nowrap cursor-pointer px-2 py-1 rounded-md`}
              onClick={() => setActiveSubject(null)}
            >
              Tất cả
            </div>
            <div className="flex items-center gap-4 max-w-[700px] pr-4 overflow-x-auto">
              {subjectNames.map((name, index) => (
                <div
                  ref={(el) => {
                    subRefs.current[index] = el;
                  }}
                  className={`${
                    activeSubjcet === name && "bg-[#F0F4FF]   text-[#1E40AF]"
                  } border whitespace-nowrap cursor-pointer px-2 py-1 rounded-md`}
                  onClick={() => {
                    setActiveSubject(name);
                    setCurrentQuestionIndex(0);
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
          <p
            className="text-2xl font-bold"
            dangerouslySetInnerHTML={{
              __html: renderMathContent(
                currentQuestion.title.replace(/\n/g, "<br/>")
              ),
            }}
          ></p>{" "}
          <span>{questionEnum[currentQuestion.type]}</span>
          <ul className="flex flex-wrap gap-8 mt-4">
            {currentQuestion.answers.map((answer, index) => {
              const { isSelected, isCorrect, content, id } = answer;
              const isWrongSelected = isSelected && !isCorrect;
              const isRightSelected =
                (isSelected && isCorrect) || currentQuestion.type === 2;
              const isNotSelected =
                !isSelected && isCorrect && currentQuestion.type !== 2;

              return (
                <li
                  key={id}
                  className={`w-[40%] py-4 px-8 shadow-[0px_0px_3px_rgba(0,0,0,0.3)] rounded-xl cursor-pointer flex items-center border
        ${
          isRightSelected
            ? "bg-[#DBFAE6] text-green-500 border-green-500"
            : isWrongSelected
            ? "bg-red-100 text-red-500 border-red-500"
            : isNotSelected
            ? "bg-[#DBFAE6] text-green-500 border-green-500"
            : "bg-gray-100 text-gray-500 border-gray-300"
        }`}
                >
                  {isRightSelected ? (
                    <img src={IMAGES.correct} alt="correct" />
                  ) : isWrongSelected ? (
                    <img src={IMAGES.notCorrect} alt="correct" />
                  ) : isNotSelected ? null : null}
                  <p className="flex items-start">
                    {currentQuestion.type !== 2 && (
                      <span className="ml-2">
                        {String.fromCharCode(65 + index)}.
                      </span>
                    )}
                    <span
                      className="ml-4"
                      dangerouslySetInnerHTML={{
                        __html: renderMathContent(
                          answer.content.replace(/\n/g, "<br/>")
                        ),
                      }}
                    ></span>
                  </p>
                  {answer.imageUrl && (
                    <Image
                      width={100}
                      height={100}
                      src={answer.imageUrl}
                      alt="img"
                      className="object-cover"
                    />
                  )}
                </li>
              );
            })}
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
            className="flex-shrink-0 w-[200px] aspect-square"
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
          {filteredQuestions.map((q, index) => (
            <li
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              key={q.id}
              className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg text-center shadow-[0px_0px_3px_rgba(0,0,0,0.3)] cursor-pointer 
            ${
              index === currentQuestionIndex ? "border-2 border-[#273d30]" : ""
            } ${
                selectedQuestionIds.includes(q.id)
                  ? "bg-[#1244A2] text-white"
                  : "bg-white text-black"
              }
           `}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </li>
          ))}
        </ul>
        <button
          className="py-1 px-4 flex-shrink-0 text-sm border border-[#273d30] text-[#273d30] rounded-xl"
          disabled={currentQuestionIndex === filteredQuestions.length - 1}
          onClick={() =>
            setCurrentQuestionIndex((prev) =>
              Math.min(prev + 1, filteredQuestions.length - 1)
            )
          }
        >
          Câu sau
        </button>
      </div>
      <div className="flex gap-4 mt-auto items-center mb-8">
        <div className="flex items-center gap-[6px]">
          <div className="w-6 aspect-square bg-[#DBFAE6] border border-[#D0D5DD] rounded-[4px]" />
          Đáp án đúng
        </div>
        <div className="flex items-center gap-[6px]">
          <div className="w-6 aspect-square bg-[#FEE4E2] border border-[#D0D5DD] rounded-[4px]" />
          Đáp án sai
        </div>
      </div>
    </div>
  );
};

export default ResultDetail;
