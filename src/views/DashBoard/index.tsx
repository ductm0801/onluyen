"use client";
import Paging from "@/components/Paging";
import { statusEnum } from "@/constants/enum";
import { IMAGES } from "@/constants/images";
import { useLoading } from "@/providers/loadingProvider";
import {
  getAdminRevenue,
  getAdminTransactionDashboard,
  getPlatformFee,
  sentFormtoMail,
} from "@/services";
import { Button, Rate } from "antd";
import axios from "axios";
import { Chart, registerables } from "chart.js/auto";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { toast } from "react-toastify";
Chart.register(...registerables);
const tableHeaders = [
  "date",
  "name",
  "mail",
  "result",
  "rate",
  "comment",
  "isTakeExam",
];

const cols = [
  {
    name: "Tên giao dịch",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Người thực hiện",
    className:
      "px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Số tiền",
    className:
      "px-6 py-4 font-medium text-end text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Trạng thái",
    className:
      "px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Ngày thực hiện",
    className:
      "px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap dark:text-white rounded-e-lg",
  },
];

export const renderBgColorStatus = (status: keyof typeof statusEnum) => {
  switch (status) {
    case 1:
      return "from-orange-600 to-orange-300";
    case 2:
      return "from-orange-600 to-orange-300";
    case 4:
      return "from-red-600 to-red-300";
    case 3:
      return "from-emerald-600 to-emerald-400";
    case 0:
      return "from-slate-600 to-slate-300";
    default:
      return "from-emerald-500 to-teal-400";
  }
};

const DashBoard = () => {
  const { setLoading } = useLoading();
  const [filterType, setFilterType] = useState("month");
  const [analyzeData, setAnalyzeData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any>({});
  const [reviewData, setReviewData] = useState<any[]>([]);
  const [transaction, setTransaction] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
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
        text: "THỐNG KÊ DOANH THU",
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
        label: "Tổng doanh thu",
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
  const fetchGgChart = async () => {
    setLoading(true);
    try {
      const url = `https://docs.google.com/spreadsheets/d/1PN3Yjg3JSK4PPEeatlUwPjeapUaGig8TG30E4f-JZhc/gviz/tq?tqx=out:json`;
      const res = await axios.get(url);
      const text = res.data;

      const json = JSON.parse(text.substring(47).slice(0, -2));
      const table = json.table;

      // const headers = table.cols.map((col: any) => col.label);

      const rows = table.rows.map((row: any) =>
        row.c.map((cell: any) => (cell ? cell.v : null))
      );

      const formattedData = rows.map((row: any) => {
        const obj: Record<string, any> = {};

        tableHeaders.forEach((header: string, index: number) => {
          const val = row[index];
          if (typeof val === "string" && val.startsWith("Date(")) {
            const match = val.match(/Date\((\d+),(\d+),(\d+)/);
            if (match) {
              const [_, year, month, day] = match.map(Number);
              obj[header] = dayjs(new Date(year, month, day)).format(
                "DD-MM-YYYY"
              );
            }
          } else {
            obj[header] = val;
          }
        });
        return obj;
      });

      setReviewData(formattedData);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };
  const countByResult = {
    Đậu: 0,
    "Không Đậu": 0,
    "Chưa có kết quả": 0,
  };
  const rateCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  reviewData.forEach((item: any) => {
    if (item.result === "Đậu") countByResult["Đậu"]++;
    else if (item.result === "Không Đậu") countByResult["Không Đậu"]++;
    else countByResult["Chưa có kết quả"]++;
  });

  reviewData.forEach((item: any) => {
    const rate = Number(item.rate);
    if (rate >= 1 && rate <= 5) {
      rateCounts[rate as 1 | 2 | 3 | 4 | 5]++;
    }
  });
  const total = reviewData.length;
  const rateProgress = Object.entries(rateCounts).map(([star, count]) => ({
    star: Number(star),
    count,
    percentage: (count / total) * 100,
  }));
  const validRates = reviewData
    .map((item: any) => Number(item.rate))
    .filter((rate) => rate >= 1 && rate <= 5);

  const totalValidRates = validRates.length;
  const sumRates = validRates.reduce((acc, rate) => acc + rate, 0);

  const averageRate = totalValidRates > 0 ? sumRates / totalValidRates : 0;
  const formattedAverageRate = Number(averageRate.toFixed(1));

  const excelData = {
    labels: ["Đậu", "Không Đậu", "Chưa có kết quả"],
    datasets: [
      {
        data: [
          countByResult["Đậu"],
          countByResult["Không Đậu"],
          countByResult["Chưa có kết quả"],
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const handleSendMail = async () => {
    try {
      setLoading(true);
      const res = await sentFormtoMail();
      toast.success(res.message);
    } catch (e: any) {
      setLoading(false);
      toast.error(e?.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGgChart();
    fetchPlatformTransaction();
  }, []);

  const fetchPlatformTransaction = async () => {
    try {
      setLoading(true);
      const res = await getPlatformFee(currentPage, pageSize);
      setTransaction(res.data.items);
      setTotalItems(res.data.totalItemsCount);
      setTotalPages(res.data.totalPageCount);
    } catch (err) {
      setLoading(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-8 w-full">
          <div className="1/2 flex flex-col gap-4">
            <Pie data={excelData} />
            <div className="flex flex-col items-center gap-2">
              <p className="font-bold"> {averageRate.toFixed(1)}/5</p>
              <Rate value={averageRate} allowHalf disabled />
              <p className="font-bold text-lg text-blue-500">
                {" "}
                {reviewData.length} đánh giá
              </p>
            </div>
          </div>
          <div className="w-1/2">
            {rateProgress.map(({ star, count, percentage }) => (
              <div key={star} className="mb-8">
                <div className="flex justify-between text-sm">
                  <span>{star} ⭐</span>
                  <span>{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div>
            <Button type="primary" onClick={() => handleSendMail()}>
              Gửi khảo sát
            </Button>
          </div>
        </div>
        <div className="w-full">
          <div className="flex flex-col gap-4 max-h-[500px] overflow-auto">
            {reviewData.map((r: any, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 shadow-lg rounded-xl p-4"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={IMAGES.defaultAvatar}
                    alt="avatar"
                    className="w-8 aspect-square rounded-full border"
                  />

                  <p className="text-xs"> {r.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Rate value={r.rate} disabled />
                  <p className="text-xs">{r.date}</p>
                </div>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 mt-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-center text-gray-800 text-title-sm dark:text-white/90">
            Doanh thu <br />{" "}
            {revenueData?.totalBalance?.toLocaleString("vi-VN") || 0}đ
          </h4>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-center text-gray-800 text-title-sm dark:text-white/90">
            Số dư khả dụng <br />
            {revenueData?.totalCurrentBalance?.toLocaleString("vi-VN") || 0}đ
          </h4>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-center text-gray-800 text-title-sm dark:text-white/90">
            Khóa học <br />{" "}
            {revenueData?.courseBalance?.toLocaleString("vi-VN") || 0}đ
          </h4>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-center text-gray-800 text-title-sm dark:text-white/90">
            Mã kiểm tra <br />{" "}
            {revenueData?.examBalance?.toLocaleString("vi-VN") || 0}đ
          </h4>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-center text-gray-800 text-title-sm dark:text-white/90">
            Hoa hồng đã rút <br />
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
      <div className="relative overflow-x-auto">
        <div className="flex justify-between items-center  flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
          {/* <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search-users"
              className="block p-2 ps-10 text-sm focus:ring-0 focus:outline-none text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
              placeholder="Tìm kiếm"
            />
          </div> */}
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {cols.map((col, idx) => (
                <th scope="col" className={col.className} key={idx}>
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transaction &&
              transaction.map((a: any, idx) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  key={idx}
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="text-base font-semibold">
                      {a?.transactionName}
                    </div>
                  </th>
                  <td className="px-6 py-4 text-center">{a?.fullName}</td>
                  <td
                    className={`px-6 py-4 text-end font-bold ${
                      a.transactionType === "Withdraw"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {a.transactionType === "Withdraw" ? "-" : "+"}
                    {a.amount.toLocaleString("vi-VN")}đ
                  </td>
                  <td
                    className={`p-2 text-sm leading-normal text-center align-middle shadow-transparent`}
                  >
                    <span
                      className={`px-2 text-sm rounded-lg py-1 font-bold text-white bg-gradient-to-tl ${renderBgColorStatus(
                        a.status
                      )}`}
                    >
                      {statusEnum[a.status as keyof typeof statusEnum] ||
                        "Unknown Status"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex flex-col  items-center">
                    <p>{dayjs(a.transactionDate).format("DD/MM/YYYY")}</p>
                    <p className="text-xs">
                      {dayjs(a.transactionDate).format("HH:mm:ss")}
                    </p>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Paging
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={totalItems}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default DashBoard;
