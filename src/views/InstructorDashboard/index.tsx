"use client";
import { useAuth } from "@/providers/authProvider";
import { useLoading } from "@/providers/loadingProvider";
import { getInstructorDashboard, instructorWithdraw } from "@/services";
import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Form, Input, InputNumber, Modal } from "antd";
import { toast } from "react-toastify";
Chart.register(...registerables);

const money = [
  { value: 1000000 },
  { value: 2000000 },
  { value: 3000000 },
  { value: 5000000 },
  { value: 10000000 },
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
