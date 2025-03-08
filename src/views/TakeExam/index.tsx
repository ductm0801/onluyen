"use client";
import CircularProgess from "@/components/CircularProgress";
import { useLoading } from "@/providers/loadingProvider";
import { takeExam } from "@/services";
import { useParams } from "next/navigation";
import React from "react";

const TakeExam = () => {
  const { setLoading } = useLoading();
  const params = useParams();
  console.log(params);

  // const handleTakeExam = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await takeExam(params.id, 10, 0, examCode);
  //     if (res) {
  //       toast.success("Bạn đã đăng ký thành công!");
  //       router.push(
  //         `/student/exam/${examDetail.current.id}?id=${res.data.testAttemptId}`
  //       );
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  return (
    <div className="bg-white min-h-[50rem] w-full rounded-[10px] shadow-[0px_0px_5px_rgba(0, 0, 0, 0.1)]">
      <div className="flex justify-between items-center pb-16">
        <div className="flex items-center gap-4">
          <i className="fa-regular fa-clock"></i>
          <div className="flex flex-col font-bold">
            <span className="text-base text-[#333333a1]">Thời gian</span>
            <p className="tracking-[3px]">14:00:00</p>
          </div>
        </div>
        <button id="quiz_submit">Nộp bài</button>
      </div>
      <div className="flex">
        <div className="flex-1 flex flex-col gap-4">
          <h5>Câu hỏi 1 trên 10</h5>
          <p className="text-2xl font-bold">He _ to school every day</p>
          <ul className="flex flex-wrap gap-8 mt-4">
            <li className="w-[40%] py-4 px-8 shadow-[0px_0px_3px_rgba(0,0,0,0.3)] rounded-xl">
              <span>A.</span>
              <span className="ml-4">go</span>
            </li>
            <li className="w-[40%] py-4 px-8 shadow-[0px_0px_3px_rgba(0,0,0,0.3)] rounded-xl">
              <span>B.</span>
              <span className="ml-4">goes</span>
            </li>
            <li className="w-[40%] py-4 px-8 shadow-[0px_0px_3px_rgba(0,0,0,0.3)] rounded-xl">
              <span>C.</span>
              <span className="ml-4">went</span>
            </li>
            <li className="w-[40%] py-4 px-8 shadow-[0px_0px_3px_rgba(0,0,0,0.3)] rounded-xl">
              <span>D.</span>
              <span className="ml-4">geos</span>
            </li>
          </ul>
        </div>
        <div className="relative mt-12">
          <CircularProgess
            className="flex-shrink-0 w-[120px] aspect-square"
            gaugePrimaryColor="#FDB022"
            gaugeSecondaryColor="#1244A2"
            max={60}
            min={0}
            value={10}
            isPercent={false}
          />
        </div>
      </div>
      <div className="flex gap-6 mt-20">
        <button className="py-1 px-4 text-sm flex-shrink-0  border border-[#273d30] text-[#273d30] rounded-xl">
          Câu trước
        </button>
        <ul className="flex items-center gap-6 w-[75%] overflow-x-auto p-[1px]">
          <li className="border-2 border-[#273d30] w-4  py-1 text-sm px-4 flex items-center justify-center  rounded-lg aspect-square text-center shadow-[0px_0px_3px_rgba(0,0,0,0.3)]  cursor-pointer">
            1
          </li>
          <li className=" w-4  py-1 px-4 flex items-center justify-center  rounded-lg aspect-square text-center shadow-[0px_0px_3px_rgba(0,0,0,0.3)]  cursor-pointer">
            2
          </li>
          <li className=" w-4  py-1 text-sm px-4 flex items-center justify-center rounded-lg aspect-square text-center shadow-[0px_0px_3px_rgba(0,0,0,0.3)]  cursor-pointer">
            3
          </li>
          <li className=" w-4  py-1 text-sm px-4 flex items-center justify-center rounded-lg aspect-square text-center shadow-[0px_0px_3px_rgba(0,0,0,0.3)]  cursor-pointer">
            4
          </li>
          <li className=" w-4  py-1 text-sm px-4 flex items-center justify-center rounded-lg aspect-square text-center shadow-[0px_0px_3px_rgba(0,0,0,0.3)]  cursor-pointer">
            5
          </li>
          <li className=" w-4  py-1 text-sm px-4 flex items-center justify-center  rounded-lg aspect-square text-center shadow-[0px_0px_3px_rgba(0,0,0,0.3)]  cursor-pointer">
            6
          </li>
          <li className=" w-4  py-1 text-sm px-4 flex items-center justify-center rounded-lg aspect-square text-center shadow-[0px_0px_3px_rgba(0,0,0,0.3)]  cursor-pointer">
            7
          </li>
          <li className=" w-4  py-1 text-sm px-4 flex items-center justify-center rounded-lg aspect-square text-center shadow-[0px_0px_3px_rgba(0,0,0,0.3)]  cursor-pointer">
            8
          </li>
          <li className=" w-4  py-1 text-sm px-4 flex items-center justify-center rounded-lg aspect-square text-center shadow-[0px_0px_3px_rgba(0,0,0,0.3)]  cursor-pointer">
            9
          </li>
          <li className=" w-4  py-1 text-sm px-4 flex items-center justify-center rounded-lg aspect-square text-center shadow-[0px_0px_3px_rgba(0,0,0,0.3)]  cursor-pointer">
            10
          </li>
          <li className=" w-4  py-1 text-sm px-4 flex items-center justify-center rounded-lg aspect-square text-center shadow-[0px_0px_3px_rgba(0,0,0,0.3)]  cursor-pointer">
            9
          </li>
          <li className=" w-4  py-1 text-sm px-4 flex items-center justify-center rounded-lg aspect-square text-center shadow-[0px_0px_3px_rgba(0,0,0,0.3)]  cursor-pointer">
            9
          </li>
          <li className=" w-4  py-1 text-sm px-4 flex items-center justify-center rounded-lg aspect-square text-center shadow-[0px_0px_3px_rgba(0,0,0,0.3)]  cursor-pointer">
            9
          </li>
          <li className=" w-4  py-1 text-sm px-4 flex items-center justify-center rounded-lg aspect-square text-center shadow-[0px_0px_3px_rgba(0,0,0,0.3)]  cursor-pointer">
            9
          </li>
        </ul>
        <button className="py-1 px-4 flex-shrink-0 text-sm border border-[#273d30] text-[#273d30] rounded-xl">
          Câu sau
        </button>
      </div>
    </div>
  );
};

export default TakeExam;
