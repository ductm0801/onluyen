"use client";
import Paging from "@/components/Paging";
import { IExam, Subject } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import {
  getExamAnalyze,
  getExamBySubjectId,
  getExamInsight,
  getSubject,
} from "@/services";
import { Select } from "antd";
import { Chart, registerables } from "chart.js/auto";
import { use, useEffect, useRef, useState } from "react";
import { Bar, Line, PolarArea } from "react-chartjs-2";
Chart.register(...registerables);

const Dashboard = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { setLoading } = useLoading();
  const [active, setActive] = useState("");
  const subjectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [insightData, setInsightData] = useState<any | null>(null);
  const [examActive, setExamActive] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  const [analyzeData, setAnalyzeData] = useState<any | null>(null);

  const fetchSubject = async () => {
    try {
      setLoading(true);
      const res = await getSubject(true);
      if (res) {
        setSubjects(res.data);
        setActive(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSubject();
  }, []);
  const [pageIndex, setPageIndex] = useState(0);
  const [exam, setExam] = useState<any[]>([]);

  const fetchExam = async () => {
    const pageSize = 3;
    if (!active) return;
    try {
      setLoading(true);
      const res = await getExamBySubjectId(active, pageIndex, pageSize);
      if (res) {
        setExam(res.data.items);
        setExamActive(res.data.items[0].id);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExam();
  }, [active, pageIndex]);
  const fetchAnalyze = async () => {
    if (!examActive) return;
    try {
      setLoading(true);
      const res = await getExamAnalyze(examActive, year);
      if (res) {
        setAnalyzeData(res.data);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAnalyze();
  }, [examActive, year]);

  const fetchInsight = async () => {
    try {
      setLoading(true);
      const res = await getExamInsight();
      if (res) {
        setInsightData(res.data);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchInsight();
  }, []);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "THỐNG KÊ DOANH THU",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1000,
        },
      },
    },
  };

  const data = {
    labels: analyzeData?.monthlyStatistics?.map((a: any) => a.month),
    datasets: [
      {
        label: "Doanh thu",
        data: analyzeData?.monthlyStatistics?.map((a: any) => a.revenue),
        borderColor: "rgba(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };
  const options2 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Thống kê điểm trung bình",
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 10,
          },
        },
      },
    },
  };

  const data2 = {
    labels: analyzeData?.monthlyStatistics?.map((a: any) => a.month),
    datasets: [
      {
        fill: true,
        label: "Điểm trung bình",
        data: analyzeData?.monthlyStatistics?.map(
          (a: any) => a.averageScorePercentage
        ),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  const options3 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Thống kê số học sinh làm bài kiểm tra",
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  };
  const data3 = {
    labels: analyzeData?.monthlyStatistics?.map((a: any) => a.month),
    datasets: [
      {
        label: "Số học sinh làm bài kiểm tra",
        data: analyzeData?.monthlyStatistics?.map(
          (a: any) => a.newStudentTakeExam
        ),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const dataInsight = {
    labels: insightData?.map((a: any) => a.examName),
    datasets: [
      {
        label: "Số lượng học sinh",
        data: insightData?.map((a: any) => a.totalStudentTakeExam),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(199, 199, 199, 0.5)",
          "rgba(83, 102, 255, 0.5)",
          "rgba(255, 102, 255, 0.5)",
          "rgba(102, 255, 178, 0.5)",
          "rgba(255, 153, 153, 0.5)",
          "rgba(102, 178, 255, 0.5)",
          "rgba(255, 255, 102, 0.5)",
          "rgba(178, 102, 255, 0.5)",
          "rgba(255, 128, 0, 0.5)",
          "rgba(0, 204, 102, 0.5)",
          "rgba(255, 51, 153, 0.5)",
          "rgba(102, 255, 255, 0.5)",
          "rgba(153, 255, 102, 0.5)",
          "rgba(255, 204, 229, 0.5)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const subjectOptions = subjects.map((subject) => ({
    value: subject.id,
    label: subject.subjectName,
  }));
  const examOptions = exam.map((exam) => ({
    value: exam.id,
    label: exam.examName,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end gap-4">
        <Select
          options={Array.from({ length: 10 }, (_, i) => ({
            value: 2025 - i,
            label: `${2025 - i}`,
          }))}
          value={year}
          onChange={(value) => setYear(value)}
        />

        <Select
          options={subjectOptions}
          value={active}
          onChange={(value) => setActive(value)}
        />
        <Select
          options={examOptions}
          value={examActive}
          onChange={(value) => setExamActive(value)}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="grid grid-cols-4 col-span-4 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
              {analyzeData?.totalRevenue.toLocaleString("vi-VN")}đ
            </h4>
            <div className="flex items-end justify-between mt-4 sm:mt-5">
              <div>
                <p className="text-gray-700 text-theme-sm dark:text-gray-400">
                  Lợi nhuận
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={` ${
                    analyzeData?.totalRevenueChangePercent > 0
                      ? "text-green-500"
                      : "text-red-500"
                  } inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500`}
                >
                  <span className="text-xl">
                    {analyzeData?.totalRevenueChangePercent > 0
                      ? "\u2191"
                      : "\u2193"}{" "}
                  </span>
                  {analyzeData?.totalRevenueChangePercent}%
                </span>
                {/* <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                năm trước
              </span> */}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
              {analyzeData?.totalPassCount}
            </h4>
            <div className="flex items-end justify-between mt-4 sm:mt-5">
              <div>
                <p className="text-gray-700 text-theme-sm dark:text-gray-400">
                  Đậu
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={` ${
                    analyzeData?.totalPassCountChangePercent > 0
                      ? "text-green-500"
                      : "text-red-500"
                  } inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500`}
                >
                  <span className="text-xl">
                    {analyzeData?.totalPassCountChangePercent > 0
                      ? "\u2191"
                      : "\u2193"}{" "}
                  </span>
                  {analyzeData?.totalPassCountChangePercent}%
                </span>
                {/* <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                năm trước
              </span> */}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
              {analyzeData?.totalFailCount}
            </h4>
            <div className="flex items-end justify-between mt-4 sm:mt-5">
              <div>
                <p className="text-gray-700 text-theme-sm dark:text-gray-400">
                  Không đậu
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={` ${
                    analyzeData?.totalFailCountChangePercent > 0
                      ? "text-green-500"
                      : "text-red-500"
                  } inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500`}
                >
                  <span className="text-xl">
                    {analyzeData?.totalFailCountChangePercent > 0
                      ? "\u2191"
                      : "\u2193"}{" "}
                  </span>
                  {analyzeData?.totalFailCountChangePercent}%
                </span>
                {/* <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                năm trước
              </span> */}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
              {analyzeData?.totalStudentTakeExam}
            </h4>
            <div className="flex items-end justify-between mt-4 sm:mt-5">
              <div>
                <p className="text-gray-700 text-theme-sm dark:text-gray-400">
                  Học sinh thi
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`${
                    analyzeData?.totalTestsTakenChangePercent > 0
                      ? "text-green-500"
                      : "text-red-500"
                  } inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500`}
                >
                  <span className="text-xl">
                    {analyzeData?.totalTestsTakenChangePercent > 0
                      ? "\u2191"
                      : "\u2193"}{" "}
                  </span>
                  {analyzeData?.totalTestsTakenChangePercent}%
                </span>
                {/* <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                năm trước
              </span> */}
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-lg col-span-2 rounded-lg p-4 bg-white dark:bg-white/[0.03]">
          <Bar options={options} data={data} />
        </div>
        <div className="shadow-lg col-span-2 rounded-lg p-4 bg-white dark:bg-white/[0.03]">
          <PolarArea data={dataInsight} />
        </div>

        <div className="shadow-lg col-span-2 rounded-lg p-4 bg-white dark:bg-white/[0.03]">
          <Line options={options2} data={data2} className="w-full" />
        </div>
        <div className="shadow-lg col-span-2 rounded-lg p-4 bg-white dark:bg-white/[0.03]">
          <Line options={options3} data={data3} className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
