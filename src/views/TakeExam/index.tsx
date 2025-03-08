"use client";
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
  return <div>TakeExam</div>;
};

export default TakeExam;
