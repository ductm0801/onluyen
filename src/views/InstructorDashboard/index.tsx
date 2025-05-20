"use client";
import { useAuth } from "@/providers/authProvider";
import { useLoading } from "@/providers/loadingProvider";
import {
  getInstructorDashboard,
  getInstructorTransaction,
  instructorWithdraw,
} from "@/services";
import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Form, Input, InputNumber, Modal } from "antd";
import { toast } from "react-toastify";
import Paging from "@/components/Paging";
import { statusEnum } from "@/constants/enum";
import dayjs from "dayjs";
Chart.register(...registerables);

const money = [
  { value: 100000 },
  { value: 200000 },
  { value: 300000 },
  { value: 500000 },
  { value: 1000000 },
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

const InstructorDashboard = () => {
  const { user } = useAuth();
  const { setLoading } = useLoading();
  const [filterType, setFilterType] = useState("month");
  const [selectAmount, setSelectAmount] = useState<number | string>();
  const [amount, setAmount] = useState<number>();
  const [open, setOpen] = useState(false);
  const [analyzeData, setAnalyzeData] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [transaction, setTransaction] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const onFinish = async (value: any) => {
    try {
      setLoading(true);
      await instructorWithdraw(value.amount ? value.amount : selectAmount);
      toast.success("Tạo lệnh rút tiền thành công");
      handleCloseWithDraw();
    } catch (e: any) {
      setLoading(false);
      toast.error(e.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchInstructorTransaction = async () => {
    try {
      setLoading(true);
      const res = await getInstructorTransaction(currentPage, pageSize);
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
  const handleWithDraw = (amount: number | string, value?: number) => {
    setSelectAmount(amount);
    setAmount(value);
  };
  const handleCloseWithDraw = () => {
    setSelectAmount(0);
    setAmount(0);
    setOpen(false);
  };
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
  useEffect(() => {
    fetchInstructorTransaction();
  }, [currentPage]);
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
      <div className="flex items-center gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            Tổng số dư {user?.instructor?.totalBalance.toLocaleString("vi-VN")}đ
          </h4>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            Số dư khả dụng{" "}
            {user?.instructor?.availableBalance.toLocaleString("vi-VN")}đ
          </h4>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            Chờ xác nhận{" "}
            {user?.instructor?.pendingBalance.toLocaleString("vi-VN")}đ
          </h4>
        </div>
        <div
          onClick={() => setOpen(true)}
          className="bg-blue-500 rounded-xl px-3 py-2 text-white cursor-pointer ml-auto"
        >
          Rút tiền
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
                  <td className="px-6 py-4 text-center">{a?.createName}</td>
                  <td
                    className={`px-6 py-4 text-end font-bold ${
                      a.transactionType === "Withdraw" ||
                      a.transactionType === "Platform fee"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {a.transactionType === "Withdraw" ||
                    a.transactionType === "Platform fee"
                      ? "-"
                      : "+"}
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
      {open && (
        <Modal
          title="Rút tiền"
          open={open}
          onOk={onFinish}
          onCancel={handleCloseWithDraw}
          width={520}
          footer={null}
        >
          <Form form={form} onFinish={onFinish}>
            <div className="grid grid-cols-2 gap-4">
              {money.map((a) => {
                const notAllowed =
                  (user?.instructor?.availableBalance ?? 0) < a.value;
                const isSelected = selectAmount === a.value;

                return (
                  <div
                    key={a.value}
                    role="button"
                    onClick={
                      !notAllowed
                        ? () => handleWithDraw(a.value, a.value)
                        : undefined
                    }
                    className={`
          ${isSelected ? "text-green-500 bg-green-100" : ""}
          ${notAllowed ? "bg-gray-300/50 cursor-not-allowed" : "cursor-pointer"}
          text-lg font-semibold border border-gray300 px-4 py-2 rounded-lg transition-all duration-300
        `}
                  >
                    {a.value.toLocaleString("vi-VN")} đ
                  </div>
                );
              })}

              <div
                role="button"
                onClick={() => handleWithDraw("another")}
                className={`${
                  selectAmount === "another"
                    ? "text-green-500 bg-green-100"
                    : ""
                } text-lg font-semibold border border-gray300 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer`}
              >
                {" "}
                Số tiền khác
              </div>
            </div>
            {selectAmount === "another" && (
              <Form.Item
                name="amount"
                rules={[
                  {
                    validator: (_, value) => {
                      if (value == null) {
                        return Promise.reject("Vui lòng nhập số tiền!");
                      }
                      if (!Number.isInteger(value)) {
                        return Promise.reject("Số tiền không hợp lệ!");
                      }
                      if (value < 100000) {
                        return Promise.reject(
                          "Giá trị phải lớn hoặc bằng 100,000đ!"
                        );
                      }
                      if ((user?.instructor?.availableBalance ?? 0) < value) {
                        return Promise.reject(
                          "Số dư không đủ để thực hiện giao dịch"
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  suffix="đ"
                  onChange={(v: any) => setAmount(v)}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/đ\s?|(,*)/g, "") || ""}
                  className="w-full mt-2"
                  placeholder="Số tiền"
                />
              </Form.Item>
            )}
            <Form.Item
              label="Tiền thực nhận"
              labelCol={{ span: 24 }}
              className="mt-4 mb-0"
            >
              <InputNumber
                suffix="đ"
                onChange={(v: any) => setAmount(v)}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                disabled
                value={
                  selectAmount === "another"
                    ? (amount ?? 0) * (user?.instructor?.commissionRate ?? 0.7)
                    : typeof selectAmount === "number"
                    ? selectAmount * (user?.instructor?.commissionRate ?? 0.7)
                    : 0
                }
                className="w-full"
                placeholder="Số tiền"
              />
            </Form.Item>
            <Form.Item
              label="Phí nền tảng"
              labelCol={{ span: 24 }}
              className="mt-4 mb-0"
            >
              <InputNumber
                suffix="đ"
                onChange={(v: any) => setAmount(v)}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                disabled
                value={
                  selectAmount === "another"
                    ? Math.ceil(
                        (amount ?? 0) *
                          (1 - (user?.instructor?.commissionRate ?? 0.7))
                      )
                    : typeof selectAmount === "number"
                    ? Math.ceil(
                        selectAmount *
                          (1 - (user?.instructor?.commissionRate ?? 0.7))
                      )
                    : 0
                }
                className="w-full"
                placeholder="Số tiền"
              />
            </Form.Item>
            <div className="flex justify-end mt-2">
              <Form.Item>
                <button
                  type="submit"
                  className="bg-blue-500 font-bold border rounded-lg text-white border-gray-400 px-4 py-2.5"
                >
                  Xác nhận
                </button>
              </Form.Item>
            </div>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default InstructorDashboard;
