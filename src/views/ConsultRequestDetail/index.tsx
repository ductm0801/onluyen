"use client";
import { IMAGES } from "@/constants/images";
import { IConsultRequest } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getConsultRequestDetail } from "@/services";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js/auto";
import { Radar } from "react-chartjs-2";
import moment from "moment";
Chart.register(...registerables);

const ConsultRequestDetail = () => {
  const { setLoading } = useLoading();
  const [data, setData] = useState<IConsultRequest | undefined>(undefined);
  const params = useParams();
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getConsultRequestDetail(params.id);
      if (res) {
        setData(res.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [params.id]);
  console.log(data);

  const dataChart = {
    labels: Array.isArray(data?.studentInfo.subjects)
      ? data?.studentInfo.subjects.map((a) => a.subjectName)
      : [],
    datasets: [
      {
        label: "Biểu đồ năng lực học tập",
        data: Array.isArray(data?.studentInfo.subjects)
          ? data?.studentInfo.subjects.map((a) => a.averageScorePercentage)
          : [],
        backgroundColor: "rgba(75,192,192,0.4)",
      },
    ],
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  if (!data) return null;
  return (
    <div>
      <div className="flex items-center gap-4">
        <img
          src={data.studentInfo.user.imageUrl || IMAGES.defaultMale}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover mb-4 border"
        />
        <div>
          <h2 className="text-xl font-semibold">
            {data.studentInfo.user.fullName}
          </h2>
          <p className="text-gray-500">{data.studentInfo.user.email}</p>
          <p className="text-gray-500">{data.studentInfo.user.phoneNumber}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Thông tin điểm</h3>

          <div className="w-full h-[600px] mt-4">
            <Radar data={dataChart} options={options} />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Thông tin bài kiểm tra</h3>
          <p className="text-gray-500">
            Tổng điểm:{" "}
            <span className="font-bold">
              {data.testAttemptInfo.grade} điểm{" "}
            </span>{" "}
          </p>
          {data.testAttemptInfo.subjectScores.map((a, idx) => (
            <p className="text-gray-500" key={idx}>
              <p className="font-bold"> Điểm {a.subjectName}: </p>
              <p className="text-gray-500">
                Số lượng câu hỏi:{" "}
                <span className="font-bold"> {a.totalQuestions} câu</span>
              </p>
              <p className="text-gray-500">
                Số lượng câu hỏi đúng:
                <span className="font-bold">
                  {" "}
                  {a.studentCorrectAnswers} câu
                </span>
              </p>
              <p className="text-gray-500">
                Số lượng câu hỏi sai:{" "}
                <span className="font-bold">
                  {a.totalQuestions - a.studentCorrectAnswers} câu
                </span>
              </p>
            </p>
          ))}

          <p className="text-gray-500">
            Thời gian làm bài:{" "}
            <span className="font-bold">
              {moment(data.testAttemptInfo.publishedDate).diff(
                moment(data.testAttemptInfo.attemptDate),
                "seconds"
              ) >
              data.testAttemptInfo.testLength * 60
                ? `${data.testAttemptInfo.testLength} phút`
                : `${moment(data.testAttemptInfo.publishedDate).diff(
                    moment(data.testAttemptInfo.attemptDate),
                    "minutes"
                  )} phút ${
                    moment(data.testAttemptInfo.publishedDate).diff(
                      moment(data.testAttemptInfo.attemptDate),
                      "seconds"
                    ) % 60
                  } giây`}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsultRequestDetail;
