"use client";
import Paging from "@/components/Paging";
import { Subject } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getExamAnalyze, getExamBySubjectId, getSubject } from "@/services";
import { Chart, registerables } from "chart.js/auto";
import { useEffect, useRef, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
Chart.register(...registerables);

const Dashboard = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { setLoading } = useLoading();
  const [active, setActive] = useState("");
  const subjectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [examActive, setExamActive] = useState("");

  const [analyzeData, setAnalyzeData] = useState<any | null>(null);
  const handleSubjectClick = (id: string, index: number) => {
    setActive(id);
    setPageIndex(0);
    if (subjectRefs.current[index]) {
      subjectRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

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
  const [exam, setExam] = useState([]);

  const fetchExam = async () => {
    const pageSize = 3;
    if (!active) return;
    try {
      setLoading(true);
      const res = await getExamBySubjectId(active, pageIndex, pageSize);
      if (res) {
        setExam(res.data.items);
        setExamActive(res.data.items[0].id);
        setTotalItemsCount(res.data.totalItemsCount);
        setTotalPages(res.data.totalPageCount);
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
      const res = await getExamAnalyze(examActive);
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
  }, [examActive]);

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
          stepSize: 1,
        },
      },
    },
  };

  const data = {
    labels: analyzeData?.monthlyStatistics?.map((a: any) => a.month),
    datasets: [
      {
        label: "Lợi nhuận",
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
            stepSize: 1,
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl w-1/4 flex-shrink-0 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            Tổng lợi nhuận
          </h4>
          <div className="flex items-end justify-between mt-4 sm:mt-5">
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
                {analyzeData?.totalRevenue.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl w-1/4 flex-shrink-0 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            Số học sinh đậu
          </h4>
          <div className="flex items-end justify-between mt-4 sm:mt-5">
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
                {analyzeData?.totalPassCount}
              </span>
              <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                Học sinh
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl w-1/4 flex-shrink-0 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            Số học sinh không đậu
          </h4>
          <div className="flex items-end justify-between mt-4 sm:mt-5">
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
                {analyzeData?.totalFailCount}
              </span>
              <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                học sinh
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl w-1/4 flex-shrink-0 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            Số học sinh tham gia
          </h4>
          <div className="flex items-end justify-between mt-4 sm:mt-5">
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
                {analyzeData?.totalStudentTakeExam}
              </span>
              <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                học sinh
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex border-b overflow-auto">
        {subjects &&
          subjects.map((s, index) => (
            <div
              ref={(el) => {
                subjectRefs.current[index] = el;
              }}
              key={s.id}
              className={`w-fit flex-shrink-0 ${
                active === s.id ? "border-b-2 border-[#1244A2]" : ""
              }  cursor-pointer transition-all duration-500 ease-in-out p-2`}
              onClick={() => handleSubjectClick(s.id, index)}
            >
              <div className="flex flex-col items-center gap-2">
                <div>
                  <div className="font-bold text-sm text-center">
                    {s.subjectName}
                  </div>
                  {/* <p className="line-clamp-2">{s.subjectDescription}</p> */}
                </div>
              </div>
            </div>
          ))}
      </div>
      <div>
        <div className="grid grid-cols-3 gap-4">
          {exam &&
            exam.map((e: any, index) => (
              <div
                className={`${
                  examActive === e.id
                    ? "bg-blue-500/50 text-white"
                    : "bg-white text-black"
                } transition-all duration-300 flex flex-col gap-4 border w-full border-[#D0D5DD] rounded-xl p-4`}
                key={e.id}
                onClick={() => setExamActive(e.id)}
              >
                <p className="font-bold h-[50px] text-start max-w-[70%]">
                  {e.examName}
                </p>
              </div>
            ))}
        </div>
        <Paging
          currentPage={pageIndex}
          pageSize={6}
          setCurrentPage={setPageIndex}
          totalItems={totalItemsCount}
          totalPages={totalPages}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="shadow-lg rounded-lg p-4 bg-white dark:bg-white/[0.03]">
          <Bar options={options} data={data} />
        </div>
        <div className="shadow-lg rounded-lg p-4 bg-white dark:bg-white/[0.03]">
          <Line options={options2} data={data2} />
        </div>
        <div className="shadow-lg rounded-lg p-4 bg-white dark:bg-white/[0.03]">
          <Line options={options3} data={data3} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
