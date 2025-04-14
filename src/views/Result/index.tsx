"use client";
import { IMAGES } from "@/constants/images";
import { IExam } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { examResult, getExamAIAnalyze } from "@/services";
import { Modal } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Result = () => {
  const [result, setResult] = useState<IExam>();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(60);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const { setLoading } = useLoading();
  const params = useParams();
  const router = useRouter();
  const fetchResult = async () => {
    try {
      setLoading(true);
      const res = await examResult(params.id, currentPage, pageSize);
      setResult(res.data);
    } catch (e) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchResult();
  }, []);
  const getAIRecommend = async () => {
    try {
      setLoading(true);
      const res = await getExamAIAnalyze(params.id);
      toast.success("Lấy đề xuất từ AI thành công!");
      Modal.info({
        title: "Đề xuất từ AI",
        width: "600px",
        content: (
          <div
            className="max-h-[500px] overflow-y-auto text-xl font-bold"
            dangerouslySetInnerHTML={{
              __html: res.data.replace(/\n/g, "<br/>"),
            }}
          />
        ),
      });
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  if (!result) return;

  return (
    <div className="flex flex-col items-center h-[80vh] justify-center w-full">
      <div className="flex flex-col items-center gap-4   p-8 ">
        <img
          src={IMAGES.testResult}
          alt="result"
          className="mix-blend-multiply"
        />
        <div className="-translate-y-[150px] flex flex-col items-center gap-8">
          <div className="text-[60px] font-bold ">
            {Math.round(result.studentGrade)} / {result.totalGrade}
          </div>
          <div className="flex gap-16 text-2xl text-[#A4A4A4] font-bold">
            <div className="flex flex-col items-center gap-2">
              <p>Câu hỏi </p>
              <p className="text-[#101828] text-4xl">
                {result.totalItemsCount}
              </p>{" "}
            </div>
            <div className="flex flex-col items-center gap-2">
              <p>Thời gian </p>
              <p className="text-[#101828] text-4xl">{result.length}</p>{" "}
            </div>
            <div className="flex flex-col items-center gap-2">
              <p>Câu đúng </p>
              <p className="text-[#101828] text-4xl">
                {" "}
                {result.studentCorrectAnswers}
              </p>{" "}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div
                className="text-white bg-[#1244A2] px-6 py-3 rounded-xl cursor-pointer"
                onClick={() =>
                  router.push(`/student/result-detail/${params.id}`)
                }
              >
                Xem lại bài làm
              </div>
              <div
                className="text-white bg-[#FDB022] px-6 py-3 rounded-xl cursor-pointer"
                onClick={() => getAIRecommend()}
              >
                Nhận tư vấn
              </div>
            </div>
            <div
              className="text-blue-500 cursor-pointer underline place-self-center"
              onClick={() => router.push("/student/home")}
            >
              Về trang chủ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
