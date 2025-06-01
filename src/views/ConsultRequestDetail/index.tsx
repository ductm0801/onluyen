"use client";
import { difficultyEnum } from "@/constants/enum";
import { IMAGES } from "@/constants/images";
import { db } from "@/firebase/config";
import { IConsultRequest } from "@/models";
import { useAuth } from "@/providers/authProvider";
import { useLoading } from "@/providers/loadingProvider";
import {
  getConsultantRequestChat,
  getConsultRequestDetail,
  getStudentExamDetail,
  getStudentExamHistory,
  sendConsultantRequestMessage,
  updateConsultRequest,
} from "@/services";
import { Form, Input, Modal, Popover, Tooltip } from "antd";
import { Chart, registerables } from "chart.js/auto";
import { collection, onSnapshot } from "firebase/firestore";
import { Check, Equal, GitCompare, MoveDown, MoveUp, X } from "lucide-react";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Radar } from "react-chartjs-2";
import { toast } from "react-toastify";
Chart.register(...registerables);

const statusOptions = [
  { label: "Chờ duyệt", value: 0 },
  { label: "Chấp Nhận", value: 1 },
  { label: "Từ chối", value: 2 },
  { label: "Hoàn thành", value: 3 },
];
const statusEnum = {
  0: "Chờ duyệt",
  1: "Chấp nhận",
  2: "Từ chối",
  3: "Hoàn thành",
};
const statusColor = {
  0: "text-yellow-500 bg-yellow-100",
  1: "text-green-500 bg-green-100",
  2: "text-red-500 bg-red-100",
  3: "text-blue-500 bg-blue-100",
};

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
  {
    name: "hành động",
    className:
      "px-6 py-4 font-medium text-center  whitespace-nowrap  rounded-e-lg",
  },
];

const renderDiff = (diff: number) => {
  if (diff > 0) {
    return (
      <span className="text-green-600 font-medium flex items-center justify-center gap-1">
        <MoveUp /> {diff}
      </span>
    );
  } else if (diff < 0) {
    return (
      <span className="text-red-600 font-medium flex items-center justify-center gap-1">
        <MoveDown /> {Math.abs(diff)}
      </span>
    );
  } else {
    return (
      <span className="text-gray-500 flex items-center justify-center gap-1">
        <Equal />
      </span>
    );
  }
};

const ConsultRequestDetail = () => {
  const { setLoading } = useLoading();
  const [data, setData] = useState<IConsultRequest | undefined>(undefined);
  const params = useParams();
  const [openChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [form] = Form.useForm();
  const [status, setStatus] = useState(0);
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [resultDetail, setResultDetail] = useState<any>(false);
  const detail = useRef<any>(null);
  const [studentHistory, setStudentHistory] = useState<any>(null);
  const [openPopup, setOpenPopup] = useState(false);
  const router = useRouter();
  const [openCompare, setOpenCompare] = useState(false);
  const [examCompare, setExamCompare] = useState<any>(null);
  const handleOpenDetail = (item: any) => {
    detail.current = item;
    setResultDetail(true);
  };
  const handleCloseDetail = () => {
    detail.current = null;
    setResultDetail(false);
  };

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

  const getSubjectByName = (scores: any, name: string) =>
    scores.find((s: any) => s.subjectName === name);

  const allSubjects = Array.from(
    new Set([
      ...(data?.testAttemptInfo.subjectScores ?? []).map(
        (s: any) => s.subjectName
      ),
      ...(examCompare?.subjectScores ?? []).map((s: any) => s.subjectName),
    ])
  );
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
        user?.Role === "Consultant"
          ? data.studentInfo.user.id
          : "12FFC162-D2D0-420A-8806-647253B09E95",

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
  const handleSubmit = async () => {
    if (!data || !message.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendConsultantRequestMessage({
        consultantRequestId: data.id,
        receiver:
          user?.Role === "Consultant"
            ? data.studentInfo.user.id
            : "12FFC162-D2D0-420A-8806-647253B09E95",
        text: message.trim(),
      });
      setMessage(""); // Xóa sau khi gửi
    } catch (err) {
      console.log(err);
    } finally {
      setIsSending(false);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Ngăn xuống dòng
      handleSubmit(); // Gửi tin nhắn
    }
  };
  const scrollToBottom = () => {
    if (!openChat) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, openChat]);

  const renderStatusbutton = (status: number) => {
    switch (status) {
      case 0:
        return (
          <div className="flex items-center gap-4">
            <button
              className="bg-green-500 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => handleUpdateRequest(1)}
            >
              Chấp Nhận
            </button>
            <button
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => handleUpdateRequest(2)}
            >
              Từ chối
            </button>
          </div>
        );
      case 1:
        return (
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => handleUpdateRequest(3)}
          >
            Hoàn thành
          </button>
        );
      case 2:
        return null;
      case 3:
        return null;
      default:
        return null;
    }
  };
  const getStudetnExamHistory = async () => {
    try {
      setLoading(true);
      setOpenPopup(true);
      const res = await getStudentExamHistory(0, 100, params.id);
      setStudentHistory(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const getExamDetail = async (id: string) => {
    try {
      setLoading(true);
      const res = await getStudentExamDetail(id);
      setExamCompare(res.data);
    } catch (e: any) {
      toast.error(e?.response?.data.message);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenCompare = (item: any) => {
    setOpenCompare(true);
    setOpenPopup(false);
    getExamDetail(item.testAttemptId);
  };
  console.log(examCompare);
  const handleCloseCompare = () => {
    setOpenCompare(false);
    setOpenPopup(false);
    setExamCompare(null);
  };

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
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {data.studentInfo.user.fullName}{" "}
              </h2>
              <p
                className={`text-xs p-2 rounded-xl ${
                  statusColor[data.status as keyof typeof statusColor]
                } `}
              >
                {statusEnum[data.status as keyof typeof statusEnum]}
              </p>
            </div>
            <p className="text-gray-500">{data.studentInfo.user.email}</p>
            <p className="text-gray-500">{data.studentInfo.user.phoneNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user?.Role === "Consultant" ? (
            <>
              <>{renderStatusbutton(status)}</>
            </>
          ) : (
            <>
              <p className="text-gray-500">Trạng thái:</p>
              <button
                className={`
                bg-blue-600
                text-white font-bold py-2 px-4 rounded-full`}
              >
                {statusOptions.find((item) => item.value === status)?.label}
              </button>
            </>
          )}
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
          <div className="flex flex-col gap-2">
            <p className="text-[#101828] font-bold text-2xl">Kết quả làm bài</p>
            <button
              type="button"
              className="flex items-center gap-2 underline text-blue-500"
              onClick={() => getStudetnExamHistory()}
            >
              Lịch sử thi
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              className=" text-blue-500 border-2 border-blue-500 w-[200px] text-center  rounded-xl py-3 cursor-pointer"
              onClick={() =>
                router.push(
                  `/consultant/result-detail/${data.testAttemptInfo.testAttemptId}`
                )
              }
            >
              Xem chi tiết bài làm
            </button>
            <button
              className="bg-[#1244A2] text-white w-[200px] text-center  rounded-xl py-3 cursor-pointer"
              onClick={() => setOpenChat((prev) => !prev)}
            >
              Liên hệ
            </button>
          </div>

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
                      <div
                        className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                        dangerouslySetInnerHTML={{
                          __html: m?.text.replace(/\n/g, "<br/>"),
                        }}
                      >
                        {/* {m?.text} */}
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
                      <div
                        className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
                        dangerouslySetInnerHTML={{
                          __html: m?.text.replace(/\n/g, "<br/>"),
                        }}
                      >
                        {/* {m?.text} */}
                      </div>
                    </div>
                  )
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            {status === 1 && (
              <div className="relative mt-4">
                <Input.TextArea
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  className="w-full border  py-2 px-3 rounded-xl field-sizing-content"
                  placeholder="Nhập tin nhắn ở đây..."
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  value={message}
                />

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="absolute top-1/2 right-3 -translate-y-1/2"
                >
                  <img src={IMAGES.sendIcon} alt="send" className="w-[20px]" />
                </button>
              </div>
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
                  <td className="px-6 py-4 text-center">
                    {a.totalAmountOfQuestions}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {a.totalStudentCorrectAnswers}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {a.totalAmountOfQuestions - a.totalStudentCorrectAnswers}
                  </td>
                  <td className="px-6 py-4 text-center flex items-center justify-center">
                    <Tooltip title="Xem chi tiết" placement="top">
                      <img
                        src={IMAGES.eyeShow}
                        alt="eye"
                        className="w-[20px]"
                        onClick={() => handleOpenDetail(a)}
                      />
                    </Tooltip>
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
      {detail.current && resultDetail && (
        <Modal
          open={resultDetail}
          onCancel={handleCloseDetail}
          width={800}
          footer={null}
          centered
          title={`Chi tiết kết quả ${detail.current?.subjectName}`}
          className="rounded-2xl"
        >
          <div className="flex flex-col gap-4">
            <table className="table-auto w-full rounded-xl overflow-hidden text-sm border border-gray-200">
              <thead>
                <tr className="bg-blue-300 text-white text-center">
                  <th className="w-[120px] py-2 border-b text-left"></th>
                  {detail.current?.difficulties.map((a: any, idx: number) => (
                    <th key={idx} className="px-4 py-2 border-b">
                      {
                        difficultyEnum[
                          a.difficulty as keyof typeof difficultyEnum
                        ]
                      }
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="text-center border-t">
                  <td className="px-4 py-2 border-b text-left font-medium">
                    Tổng số câu
                  </td>
                  {detail.current?.difficulties.map((a: any, idx: number) => (
                    <td key={idx} className="px-4 py-2 border-b">
                      {a.amountOfQuestions}
                    </td>
                  ))}
                </tr>
                <tr className="text-center border-t">
                  <td className="px-4 py-2 border-b text-left font-medium">
                    Số câu đúng
                  </td>
                  {detail.current?.difficulties.map((a: any, idx: number) => (
                    <td key={idx} className="px-4 py-2 border-b">
                      {a.studentCorrectAnswers}
                    </td>
                  ))}
                </tr>
                <tr className="text-center border-t">
                  <td className="px-4 py-2 border-b text-left font-medium">
                    Số câu sai
                  </td>
                  {detail.current?.difficulties.map((a: any, idx: number) => (
                    <td key={idx} className="px-4 py-2 border-b">
                      {a.amountOfQuestions - a.studentCorrectAnswers}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
      )}
      {openPopup && (
        <Modal
          open={openPopup}
          onCancel={() => setOpenPopup(false)}
          width={800}
          footer={null}
          centered
          title={`Lịch sử thi của ${data.studentInfo.user.fullName}`}
          className="rounded-2xl overflow-y-auto max-h-[600px]"
        >
          {studentHistory &&
            studentHistory.testHistory.map((item: any, index: number) => (
              <div
                key={index}
                className={`${
                  item.testAttemptId === data.testAttemptInfo.testAttemptId &&
                  "bg-[#E5F2FF] border-[#1244A2]"
                } border-b p-4 mb-4 flex items-center gap-3`}
              >
                <div className="flex-shrink-0 w-[90%]">
                  <p className="flex items-center justify-between">
                    Điểm thi lần {studentHistory.totalItemsCount - index}:{" "}
                    <span
                      className={`font-bold ${
                        item.isPass ? "text-[#17B26A]" : "text-[#F04438]"
                      } `}
                    >
                      {Math.round(item.grade)} /{item.testTotalGrade} điểm
                    </span>
                  </p>
                  <div className="flex items-center justify-between">
                    Thời gian thi:{" "}
                    <p className="font-bold">
                      {moment(item.publishedDate).diff(
                        moment(item.attemptDate),
                        "seconds"
                      ) >
                      item.testLength * 60
                        ? `${item.testLength} phút`
                        : `${moment(item.publishedDate).diff(
                            moment(item.attemptDate),
                            "minutes"
                          )} phút ${
                            moment(item.publishedDate).diff(
                              moment(item.attemptDate),
                              "seconds"
                            ) % 60
                          } giây`}
                    </p>
                  </div>
                </div>
                <Popover
                  content={
                    <div className="flex flex-col gap-2">
                      {item.testAttemptId !==
                        data.testAttemptInfo.testAttemptId && (
                        <div
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => handleOpenCompare(item)}
                        >
                          So sánh{" "}
                          <GitCompare color="#3b82f6" className="ml-auto" />
                        </div>
                      )}
                      <div
                        className="flex items-center gap-2  cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/consultant/result-detail/${item.testAttemptId}`
                          )
                        }
                      >
                        Xem bài làm
                        <img
                          src={IMAGES.eyeShow}
                          alt="detail"
                          className="w-[20px]"
                        />
                      </div>
                    </div>
                  }
                  placement="top"
                >
                  <img
                    src={IMAGES.threeDotsBlack}
                    alt="icon"
                    className="w-4 h-4 cursor-pointer mt-2"
                  />
                </Popover>
              </div>
            ))}
        </Modal>
      )}
      {openCompare && examCompare && (
        <Modal
          open={openCompare}
          onCancel={handleCloseCompare}
          width={800}
          footer={null}
          centered
          title="So sánh kết quả hai lần thi"
          className="rounded-2xl "
        >
          {" "}
          <div className="p-4 overflow-y-auto max-h-[600px]">
            {/* Thông tin chung */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Thông tin chung</h3>
              <table className="w-full border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1 text-left">Thông tin</th>
                    <th className="border px-2 py-1">Hiện tại</th>
                    <th className="border px-2 py-1">Bài cần so sánh</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-2 py-1">Ngày thi</td>
                    <td className="border px-2 py-1">
                      {data.testAttemptInfo.attemptDate
                        ? moment(data.testAttemptInfo.attemptDate).format(
                            "DD/MM/YYYY HH:mm"
                          )
                        : ""}
                    </td>
                    <td className="border px-2 py-1">
                      {examCompare.attemptDate
                        ? moment(examCompare.attemptDate).format(
                            "DD/MM/YYYY HH:mm"
                          )
                        : ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">Điểm</td>
                    <td className="border px-2 py-1">
                      {data.testAttemptInfo.grade}
                    </td>
                    <td className="border px-2 py-1">{examCompare.grade}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">Tổng điểm</td>
                    <td className="border px-2 py-1">
                      {data.testAttemptInfo.testTotalGrade}
                    </td>
                    <td className="border px-2 py-1">
                      {examCompare.testTotalGrade}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">Kết quả</td>
                    <td className="border px-2 py-1">
                      {data.testAttemptInfo.isPass ? (
                        <div className="flex items-center gap-1 text-green-500">
                          <Check /> Đậu
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-500">
                          <X />
                          Không đậu
                        </div>
                      )}
                    </td>
                    <td className="border px-2 py-1">
                      {examCompare.isPass ? (
                        <div className="flex items-center gap-1 text-green-500">
                          <Check /> Đậu
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-500">
                          <X />
                          Không đậu
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* So sánh môn học */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                So sánh theo môn học
              </h3>
              <table className="min-w-full table-auto border border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">Môn</th>
                    <th className="border px-2 py-1">Độ khó</th>
                    <th className="border px-2 py-1">Hiện tại</th>
                    <th className="border px-2 py-1">Bài cần so sánh</th>
                    <th className="border px-2 py-1">Chênh lệch</th>
                  </tr>
                </thead>
                <tbody>
                  {allSubjects.map((subjectName) => {
                    const s1 = getSubjectByName(
                      data.testAttemptInfo.subjectScores,
                      subjectName
                    );
                    const s2 = getSubjectByName(
                      examCompare.subjectScores,
                      subjectName
                    );

                    if (!s1 || !s2) return null;

                    const total1 = s1.totalStudentCorrectAnswers;
                    const total2 = s2.totalStudentCorrectAnswers;
                    const totalQuestions = s1.totalAmountOfQuestions;

                    return (
                      <React.Fragment key={subjectName}>
                        <tr className="bg-gray-50 font-semibold">
                          <td className="border px-2 py-1">{subjectName}</td>
                          <td className="border px-2 py-1 text-center">-</td>
                          <td className="border px-2 py-1 text-center">
                            {total1} / {totalQuestions}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {total2} / {s2.totalAmountOfQuestions}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {renderDiff(total1 - total2)}
                          </td>
                        </tr>

                        {s1.difficulties.map((d1: any, idx: number) => {
                          const d2 = s2.difficulties.find(
                            (d: any) => d.difficulty === d1.difficulty
                          );
                          if (!d2) return null;

                          return (
                            <tr key={idx}>
                              <td className="border px-2 py-1"></td>
                              <td className="border px-2 py-1">
                                {
                                  difficultyEnum[
                                    d1.difficulty as keyof typeof difficultyEnum
                                  ]
                                }
                              </td>
                              <td className="border px-2 py-1 text-center">
                                {d1.studentCorrectAnswers} /{" "}
                                {d1.amountOfQuestions}
                              </td>
                              <td className="border px-2 py-1 text-center">
                                {d2.studentCorrectAnswers} /{" "}
                                {d2.amountOfQuestions}
                              </td>
                              <td className="border px-2 py-1 text-center">
                                {renderDiff(
                                  d1.studentCorrectAnswers -
                                    d2.studentCorrectAnswers
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ConsultRequestDetail;
