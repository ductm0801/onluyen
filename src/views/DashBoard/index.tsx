"use client";
import { useLoading } from "@/providers/loadingProvider";
import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { getAdminRevenue, getAdminTransactionDashboard } from "@/services";
import { toast } from "react-toastify";
Chart.register(...registerables);

const DashBoard = () => {
  const { setLoading } = useLoading();
  const [filterType, setFilterType] = useState("month");
  const [analyzeData, setAnalyzeData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any>({});
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAdminTransactionDashboard(filterType);
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
  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const res = await getAdminRevenue();
      if (res) setRevenueData(res.data);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRevenue();
  }, []);

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
        backgroundColor: "rgba(75, 192, 192, 0.3)",
      },
      {
        label: "Khóa học",
        data: analyzeData?.map((a: any) => a.courseRevenue),
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.3)",
      },
      {
        label: "Bài kiểm tra",
        data: analyzeData?.map((a: any) => a.examCodeRevenue),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.3)",
      },
      {
        label: "Hoa hồng giảng viên",
        data: analyzeData?.map((a: any) => a.withdrawAmount),
        borderColor: "rgba(255, 205, 86, 1)",
        backgroundColor: "rgba(255, 205, 86, 0.3)",
      },
    ],
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            Tổng lợi nhuận{" "}
            {revenueData?.totalBalance?.toLocaleString("vi-VN") || 0}đ
          </h4>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            Số dư khả dụng{" "}
            {revenueData?.totalCurrentBalance?.toLocaleString("vi-VN") || 0}đ
          </h4>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            Khóa học {revenueData?.courseBalance?.toLocaleString("vi-VN") || 0}đ
          </h4>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            Mã kiểm tra {revenueData?.examBalance?.toLocaleString("vi-VN") || 0}
            đ
          </h4>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            Hoa hồng giảng viên{" "}
            {revenueData?.withdrawBalance?.toLocaleString("vi-VN") || 0}đ
          </h4>
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

export default DashBoard;
