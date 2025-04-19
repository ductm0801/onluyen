"use client";
import { IMAGES } from "@/constants/images";
import { IConsultRequest } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import {
  getChat,
  getConsultantRequestChat,
  getConsultRequestDetail,
  sendConsultantRequestMessage,
  sendMessage,
  updateConsultRequest,
} from "@/services";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js/auto";
import { Radar } from "react-chartjs-2";
import moment from "moment";
import { toast } from "react-toastify";
import { db } from "@/firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/providers/authProvider";
import { Form } from "antd";
Chart.register(...registerables);

const statusOptions = [
  { label: "Chờ duyệt", value: 0 },
  { label: "Chấp Nhận", value: 1 },
  { label: "Từ chối", value: 2 },
  { label: "Hoàn thành", value: 3 },
];

const cols = [
  {
    name: "Môn học",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Tổng số câu",
    className:
      "px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap dark:text-white",
  },

  {
    name: "Số câu đúng",
    className:
      "px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Số câu sai",
    className:
      "px-6 py-4 font-medium text-center  whitespace-nowrap  rounded-e-lg",
  },
];

const ConsultRequestDetail = () => {
  const { setLoading } = useLoading();
  const [data, setData] = useState<IConsultRequest | undefined>(undefined);
  const params = useParams();
  const [openChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [form] = Form.useForm();
  const [status, setStatus] = useState(0);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getConsultRequestDetail(params.id);
      if (res) {
        setData(res.data);
        setStatus(res.data.status);
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
  const handleUpdateRequest = async (status: number) => {
    try {
      setLoading(true);
      await updateConsultRequest(status, params.id);
      fetchData();
      toast.success("Cập nhật trạng thái yêu cầu thành công!");
    } catch (e: any) {
      setLoading(false);
      toast.error(e.response.data.message);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchChat = async () => {
    try {
      if (!data) return;
      const res = await getConsultantRequestChat(
        data.studentInfo.user.id,
        data.id
      );
      if (res) setMessages(res);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    onSnapshot(collection(db, "chats_consultant_request"), (snapshot) => {
      fetchChat();
    });
  }, [params.id, data]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handleSubmit = async (values: any) => {
    if (!data) return;
    try {
      await sendConsultantRequestMessage({
        consultantRequestId: data.id,
        receiver: data.studentInfo.user.id,
        text: values.text,
      });
    } catch (err) {
      console.log(err);
    } finally {
      form.resetFields();
    }
  };
  const scrollToBottom = () => {
    if (!openChat) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, openChat]);

  if (!data) return null;
  return (
    <div>
      <div className="flex items-center justify-between mt-4">
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
        <div className="flex items-center gap-4">
          <p className="text-gray-500">Trạng thái:</p>
          {statusOptions.map((item, index) => (
            <button
              key={index}
              className={`${
                status === item.value ? "bg-blue-600" : "bg-gray-200"
              } text-white font-bold py-2 px-4 rounded-full`}
              onClick={() => handleUpdateRequest(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Thông tin học sinh</h3>

          <div className="w-full h-[600px] mt-4">
            <Radar data={dataChart} options={options} />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Đề xuất của AI</h3>
          <div className=" p-4 rounded-lg shadow-md max-h-[600px] overflow-auto">
            <p
              className="text-base"
              dangerouslySetInnerHTML={{
                __html: data.message.replace(/\n/g, "<br/>"),
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 min-h-[600px] relative border rounded-xl shadow-md overflow-hidden">
        <div className="flex items-center justify-between px-8 py-[40px]">
          <p className="text-[#101828] font-bold text-2xl">Kết quả làm bài</p>

          <button
            className="bg-[#1244A2] text-white w-[200px] text-center  rounded-xl py-3 cursor-pointer"
            onClick={() => setOpenChat((prev) => !prev)}
          >
            Liên hệ
          </button>

          <div
            className={`absolute top-24 right-0 max-w-[1008px] w-full bg-white shadow-lg rounded-lg p-4 transition-transform duration-300 ${
              openChat ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <h3 className="text-lg font-semibold">
              Tư vấn cho {data.studentInfo.user.fullName}
            </h3>
            <div className="h-[300px] overflow-auto border border-gray-300 rounded-lg p-2">
              <div className="flex flex-col mt-5 overflow-y-auto">
                {messages.map((m: any, index) =>
                  m.sender === user?.UserId ? (
                    <div className="flex justify-end mb-4" key={index}>
                      <div className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                        {m?.text}
                      </div>
                      <img
                        src={m.senderImageUrl || IMAGES.defaultAvatar}
                        className="object-cover h-8 w-8 rounded-full"
                        alt=""
                      />
                    </div>
                  ) : (
                    <div className="flex justify-start mb-4" key={index}>
                      <img
                        src={m.senderImageUrl || IMAGES.defaultAvatar}
                        className="object-cover h-8 w-8 rounded-full"
                        alt=""
                      />
                      <div className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                        {m?.text}
                      </div>
                    </div>
                  )
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            {status === 1 && (
              <Form
                form={form}
                onFinish={handleSubmit}
                className="py-5 relative"
              >
                <Form.Item name="text" noStyle>
                  <textarea
                    className="w-full border  py-2 px-3 rounded-xl field-sizing-content"
                    placeholder="Nhập tin nhắn ở đây..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.submit();
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item noStyle>
                  <button
                    type="submit"
                    className="absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    <img
                      src={IMAGES.sendIcon}
                      alt="send"
                      className="w-[20px]"
                    />
                  </button>
                </Form.Item>
              </Form>
            )}
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 border-b uppercase dark:text-gray-400">
            <tr>
              {cols.map((col, idx) => (
                <th scope="col" className={col.className} key={idx}>
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data &&
              data.testAttemptInfo.subjectScores.map((a, idx) => (
                <tr
                  className="bg-white dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  key={idx}
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="ps-3">
                      <div className="text-base font-semibold">
                        {a.subjectName}
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4 text-center">{a.totalQuestions}</td>
                  <td className="px-6 py-4 text-center">
                    {a.studentCorrectAnswers}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {a.totalQuestions - a.studentCorrectAnswers}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <p className="font-bold">Tổng điểm</p>
        <p className="font-bold">Thời gian làm bài</p>
        <p className="text-xl">
          {data.testAttemptInfo.grade} / {data.testAttemptInfo.testTotalGrade}{" "}
          điểm
        </p>
        <p className="text-xl">
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
        </p>
      </div>
    </div>
  );
};

export default ConsultRequestDetail;
