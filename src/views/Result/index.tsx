"use client";
import { IMAGES } from "@/constants/images";
import { IExam } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { examResult, getExamAIAnalyze, postConsultRequest } from "@/services";
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
    } catch (e: any) {
      setLoading(false);
      toast.error(e.response.data.message);
      if (e.response.data.message === "Không tìm thấy bàì làm với ID.") {
        router.replace(`/404`);
        return;
      }
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
        icon: null,
        footer: (
          <div className="flex border-t mt-8 pt-8 items-center gap-4 justify-end">
            <button
              className="bg-[#FDB022] text-white w-[128px] flex flex-col gap-0 items-center py-3  rounded-xl"
              onClick={() => handlePostConsultRequest(res.data)}
            >
              <span className="leading-none font-bold"> Nhận tư vấn</span>
              <span className="text-xs leading-none">(Đặt lịch chat)</span>
            </button>
            <button
              className="bg-[#1244A2] font-bold text-white w-[128px] text-center py-3 rounded-xl"
              onClick={() => Modal.destroyAll()}
            >
              OK
            </button>
          </div>
        ),
        title: (
          <div className="flex items-center gap-4 ">
            {" "}
            <img
              src={IMAGES.robotImg}
              className="w-12 aspect-square"
              alt="robot"
            />
            <p className="text-4xl font-bold"> Đề xuất từ AI</p>
          </div>
        ),
        width: "600px",
        content: (
          <div
            className="max-h-[500px] pt-8 overflow-y-auto"
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
  const handlePostConsultRequest = async (message: string) => {
    try {
      setLoading(true);
      await postConsultRequest(message, params.id);
      toast.success("Tạo yêu cầu tư vấn thành công!");
      Modal.destroyAll();
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
