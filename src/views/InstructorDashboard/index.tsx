"use client";
import { useAuth } from "@/providers/authProvider";
import { useLoading } from "@/providers/loadingProvider";
import { getInstructorDashboard } from "@/services";
import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
Chart.register(...registerables);

const InstructorDashboard = () => {
  const { user } = useAuth();
  const { setLoading } = useLoading();
  const [filterType, setFilterType] = useState("month");
  const [analyzeData, setAnalyzeData] = useState<any[]>([]);
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getInstructorDashboard(filterType);
      if (res) setAnalyzeData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [filterType]);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "THỐNG KÊ LỢI NHUẬN",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10000,
        },
      },
    },
  };
  const data = {
    labels: analyzeData?.map((a: any) => a.yearMonth),
    datasets: [
      {
        label: "Tổng Lợi nhuận",
        data: analyzeData?.map((a: any) => a.totalRevenue),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Khóa học",
        data: analyzeData?.map((a: any) => a.courseRevenue),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Bài kiểm tra",
        data: analyzeData?.map((a: any) => a.examCodeRevenue),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };
  return (
    <div>
      <div className="flex gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            Tổng số dư{" "}
            {user?.instructor?.availableBalance.toLocaleString("vi-VN")}đ
          </h4>
          {/* <div className="flex items-end justify-between mt-4 sm:mt-5">
            <div>
              <p className="text-gray-700 text-theme-sm dark:text-gray-400">
                Tăng
              </p>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
                20%
              </span>
              <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                so với tháng trươcs
              </span>
            </div>
          </div> */}
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            Chờ xác nhận{" "}
            {user?.instructor?.pendingBalance.toLocaleString("vi-VN")}đ
          </h4>
          {/* <div className="flex items-end justify-between mt-4 sm:mt-5">
            <div>
              <p className="text-gray-700 text-theme-sm dark:text-gray-400">
                Tăng
              </p>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
                20%
              </span>
              <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                so với tháng trươcs
              </span>
            </div>
          </div> */}
        </div>
      </div>
      <div className="flex gap-4 mt-4 justify-end ">
        <button
          onClick={() => setFilterType("month")}
          className={`rounded-lg border px-4 py-2 text-sm font-medium ${
            filterType === "month" ? "bg-blue-500/50 text-white" : "bg-white"
          }`}
        >
          Theo tháng
        </button>
        <button
          onClick={() => setFilterType("day")}
          className={`rounded-lg border px-4 py-2 text-sm font-medium ${
            filterType === "day" ? "bg-blue-500/50 text-white" : "bg-white"
          }`}
        >
          Theo ngày
        </button>
      </div>
      <Bar options={options} data={data} />
    </div>
  );
};

export default InstructorDashboard;
