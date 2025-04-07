"use client";
import CircularProgess from "@/components/CircularProgress";
import { examEnum, questionEnum } from "@/constants/enum";
import { IExam } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getTest, saveExam, submitExam } from "@/services";
import { Image, Modal } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const TakeExam = () => {
  const { setLoading } = useLoading();
  const params = useParams();
  const [exam, setExam] = useState<IExam | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, { ids: string[]; text: string }>
  >({});
  const router = useRouter();
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

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const res = await getTest(params.id, 0, 200);
        setExam(res.data);

        const storedAnswers = localStorage.getItem(`exam-${params.id}`);
        const savedTime = localStorage.getItem(`timeLeft_${params.id}`);
        setTimeLeft(savedTime ? parseInt(savedTime) : res.data.length * 60);
        if (storedAnswers) {
          setSelectedAnswers(JSON.parse(storedAnswers));
        }
      } catch (error: any) {
        if (error.response.data.message === "Bài làm đã xong.")
          router.push(`/student/exam/result/${params.id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [params.id, setLoading]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = (prev ?? 0) - 1;
          localStorage.setItem(`timeLeft_${params.id}`, newTime.toString());
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft !== null && timeLeft <= 0) {
      submitExamHandler();
    }
  }, [timeLeft]);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      autoSaveExam();
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [selectedAnswers]);

  const autoSaveExam = async () => {
    const formattedAnswers = Object.entries(selectedAnswers).map(
      ([questionId, answer]) => ({
        questionId,
        answerIds: answer.ids || [],
        answerText: answer.text || "",
      })
    );

    try {
      await saveExam({ studentAnswers: formattedAnswers }, params.id);
      console.log("Bài làm đã được lưu tự động.");
    } catch (err: any) {
      toast.error("Lỗi khi lưu bài làm tự động.");
    }
  };

  const handleSelectAnswer = (
    questionId: string,
    type: number,
    answerId: string,
    answerText?: string
  ) => {
    setSelectedAnswers((prev) => {
      let updatedAnswers = { ...prev };

      if (type === 0) {
        updatedAnswers[questionId] = { ids: [answerId], text: "" };
      } else if (type === 1) {
        const prevAnswers = updatedAnswers[questionId]?.ids || [];
        const newAnswers = prevAnswers.includes(answerId)
          ? prevAnswers.filter((id) => id !== answerId)
          : [...prevAnswers, answerId];

        updatedAnswers[questionId] = { ids: newAnswers, text: "" };
      } else if (type === 2) {
        updatedAnswers[questionId] = { ids: [], text: answerText || "" };
      }

      localStorage.setItem(`exam-${params.id}`, JSON.stringify(updatedAnswers));
      return updatedAnswers;
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };
  const onSubmit = async () => {
    const totalQuestions = exam?.questions.length ?? 0;
    const answeredQuestions = Object.keys(selectedAnswers).length;

    if (answeredQuestions < totalQuestions) {
      Modal.confirm({
        title: "Xác nhận nộp bài",
        content: `Bạn mới làm ${answeredQuestions}/${totalQuestions} câu. Bạn có chắc chắn muốn nộp bài không?`,
        okText: "Nộp bài",
        cancelText: "Hủy",
        onOk: async () => {
          await submitExamHandler();
        },
      });
      return;
    }
    await submitExamHandler();
  };

  const submitExamHandler = async () => {
    const formattedAnswers = Object.entries(selectedAnswers).map(
      ([questionId, answer]) => ({
        questionId,
        answerIds: answer.ids || [],
        answerText: answer.text || "",
      })
    );

    try {
      setLoading(true);
      const res = await saveExam(
        { studentAnswers: formattedAnswers },
        params.id
      );
      if (res) await submitExam(params.id);
      localStorage.removeItem(`exam-${params.id}`);
      localStorage.removeItem(`timeLeft_${params.id}`);
      toast.success("Bạn đã nộp bài thành công!");
      router.push(`/student/exam/result/${params.id}`);
    } catch (err: any) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Lỗi khi nộp bài");
    } finally {
      setLoading(false);
    }
  };

  if (!exam) return <></>;

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="bg-white min-h-[50rem] w-full rounded-[10px] shadow-[0px_0px_5px_rgba(0, 0, 0, 0.1)]">
      <div className="flex justify-between items-center pb-16">
        <div className="flex items-center gap-4">
          <i className="fa-regular fa-clock"></i>
          <div className="flex flex-col font-bold">
            <span className="text-base text-[#333333a1]">Thời gian</span>
            <p className="tracking-[3px]">
              {timeLeft !== null ? formatTime(timeLeft) : "0:00"}
            </p>
          </div>
        </div>
        <button
          className="bg-[#1244A2] px-3 py-2 rounded-xl text-white"
          onClick={() => onSubmit()}
        >
          Nộp bài
        </button>
      </div>

      <div className="flex gap-16">
        <div className="flex-1 flex flex-col gap-4">
          <h5>
            Câu hỏi {currentQuestionIndex + 1} trên {exam.questions.length}
          </h5>
          <p
            className="text-2xl font-bold"
            dangerouslySetInnerHTML={{
              __html: currentQuestion.title.replace(/\n/g, "<br/>"),
            }}
          />

          {currentQuestion.imageUrl && (
            <Image
              width={400}
              height={200}
              src={currentQuestion.imageUrl}
              alt="img"
              className="object-cover"
            />
          )}
          <span>{questionEnum[currentQuestion.type]}</span>
          <ul className="grid grid-cols-2 gap-8 mt-4">
            {currentQuestion.answers.map((answer, index) => (
              <li
                key={answer.id}
                onClick={() =>
                  handleSelectAnswer(
                    currentQuestion.id,
                    currentQuestion.type,
                    answer.id
                  )
                }
                className={`w-full py-4 px-8 shadow-[0px_0px_3px_rgba(0,0,0,0.3)] rounded-xl cursor-pointer  flex items-center justify-between 
        ${
          selectedAnswers[currentQuestion.id]?.ids?.includes(answer.id)
            ? "bg-blue-300"
            : ""
        }`}
              >
                <p className="flex items-start">
                  <span>{String.fromCharCode(65 + index)}.</span>
                  <span
                    className="ml-4"
                    dangerouslySetInnerHTML={{
                      __html: answer.content.replace(/\n/g, "<br/>"),
                    }}
                  />
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
            ))}
          </ul>
          {currentQuestion.type === 2 && (
            <textarea
              className="w-[80%] p-4 border rounded-md"
              placeholder="Nhập câu trả lời của bạn..."
              value={selectedAnswers[currentQuestion.id]?.text || ""}
              onChange={(e) =>
                handleSelectAnswer(currentQuestion.id, 2, "", e.target.value)
              }
            />
          )}
        </div>
        <div className="relative mt-12">
          <CircularProgess
            className="flex-shrink-0 w-[120px] aspect-square"
            gaugePrimaryColor="#FDB022"
            gaugeSecondaryColor="#1244A2"
            max={exam.questions.length}
            min={0}
            value={Object.keys(selectedAnswers).length}
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
                ${
                  index === currentQuestionIndex
                    ? "border-2 border-[#273d30]"
                    : ""
                }
                ${
                  selectedAnswers[q.id]
                    ? "bg-[#1244A2] text-white"
                    : "bg-white text-black"
                }`}
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

export default TakeExam;
