"use client";
import CircularProgess from "@/components/CircularProgress";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { IMAGES } from "@/constants/images";
import {
  enrollExam,
  getExamBySubjectId,
  getSubject,
  paymentExamCode,
  takeExam,
} from "@/services";
import { useLoading } from "@/providers/loadingProvider";
import { useAuth } from "@/providers/authProvider";
import { IExam, Subject } from "@/models";
import { toast } from "react-toastify";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "next/navigation";
import { Button, Input, Modal } from "antd";
import ExamDetail from "../ExamDetail";
import { db } from "@/firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

const items = [
  {
    id: 0,
    title: "Vật lý",
    desc: "Khám phá các quy luật của tự nhiên, bao gồm các chủ đề như cơ học, điện từ, nhiệt động lực học và lý thuyết lượng tử.",
    value: 80,
  },
  {
    id: 1,
    title: "Toán",
    desc: "Bao gồm các chủ đề như đại số, hình học, phép tính và thống kê. Tập trung vào lý luận logic và kỹ năng giải quyết vấn đề.",
    value: 90,
  },
  {
    id: 2,
    title: "Hóa",
    desc: "Nghiên cứu về thành phần, cấu trúc, tính chất và sự thay đổi của vật chất, bao gồm hóa học hữu cơ, vô cơ và vật lý.",
    value: 75,
  },
  {
    id: 3,
    title: "Sinh",
    desc: "Nghiên cứu về sinh vật sống và các quá trình sống, bao gồm sinh học tế bào, di truyền, tiến hóa, sinh thái học và sinh học con người.",
    value: 85,
  },
  {
    id: 4,
    title: "Tiếng Anh",
    desc: "Tập trung vào việc đọc, viết và phân tích văn học, cũng như phát triển kỹ năng giao tiếp bằng tiếng Anh.",
    value: 95,
  },
  {
    id: 5,
    title: "Sử",
    desc: "Nghiên cứu các sự kiện lịch sử, văn hóa và xã hội trong nhiều thời kỳ khác nhau, tập trung vào lịch sử thế giới và lịch sử quốc gia.",
    value: 70,
  },
];
const renderBullet = (index: number, className: string) =>
  `<div class="${className}"></div>`;

const Home = () => {
  const sliderRef = useRef<any>();
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { setLoading } = useLoading();
  const [active, setActive] = useState("");
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const subjectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const examDetail = useRef<any>();

  const handleSubjectClick = (id: string, index: number) => {
    setActive(id);

    if (subjectRefs.current[index]) {
      subjectRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };
  const slideLeft = () => {
    if (!sliderRef) {
      return;
    }
    sliderRef.current.swiper.slidePrev();
  };
  const slideRight = () => {
    if (!sliderRef) {
      return;
    }
    sliderRef.current.swiper.slideNext();
  };
  const fetchSubject = async () => {
    try {
      setLoading(true);
      const res = await getSubject();
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
  const [examCode, setExamCode] = useState("");

  const fetchExam = async () => {
    const pageSize = 10;
    try {
      setLoading(true);
      const res = await getExamBySubjectId(active, pageIndex, pageSize);
      if (res) {
        setExam(res.data.items);
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
  }, [active]);

  const handleOpenPopup = async (item: any) => {
    if (!item.enrollmentId) {
      try {
        setLoading(true);
        const res = await enrollExam(item.id);
        if (res) {
          toast.success(res.message);
          await fetchExam();
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Có lỗi xảy ra");
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    } else {
      setOpen(true);
      examDetail.current = item;
    }
  };
  const handleCLose = () => {
    setOpen(false);
    examDetail.current = undefined;
  };
  const handlePayment = async () => {
    try {
      setLoading(true);
      console.log(examDetail.current);
      const res = await paymentExamCode({
        examEnrollmentId: examDetail.current.enrollmentId,
        buyerName: "string",
        buyerEmail: "string",
        buyerPhone: "string",
        cancelUrl: `${process.env.NEXT_PUBLIC_HOST}/payment/cancel`,
        returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/student/home`,
        amount: examDetail.current.price,
      });
      if (res) router.push(res.data);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeExam = async () => {
    try {
      setLoading(true);
      const res = await takeExam(examDetail.current.id, examCode);
      if (res) {
        // toast.success("Bạn đã đăng ký thành công!");
        router.push(`/student/exam/${res.data}`);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  // const [messages, setMessages] = useState<any[]>([]);

  // useEffect(() => {
  //   onSnapshot(collection(db, "chats"), (snapshot) => {
  //     setMessages(snapshot.docs.map((doc) => doc.data()));
  //   });
  // }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end items-center">
        <div className="flex gap-2 items-center border border-[#D0D5DD] rounded-full py-2 px-4">
          <img src={IMAGES.searchIcon} alt="search" className="text-sm" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="border-none outline-none bg-white dark:bg-black ring-0"
          />
        </div>
      </div>
      <div className="relative">
        <Swiper
          slidesPerView={3}
          spaceBetween={12}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
            renderBullet: renderBullet,
          }}
          modules={[Autoplay, Pagination, Navigation]}
          slidesPerGroup={3}
          ref={sliderRef}
        >
          {items.map((item, index) => (
            <SwiperSlide key={index} className="pb-4">
              <div className="flex items-center gap-6 border border-[#D0D5DD] rounded-xl px-4">
                <CircularProgess
                  className="flex-shrink-0 w-[96px] aspect-square"
                  gaugePrimaryColor="#FDB022"
                  gaugeSecondaryColor="#1244A2"
                  max={100}
                  min={0}
                  value={item.value}
                />
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="font-bold text-lg">{item.title}</div>
                    <p className="line-clamp-1 text-xs">{item.desc}</p>
                  </div>
                  <div className="font-bold  text-xs text-[#FDB022] flex items-center gap-[6px] mt-auto cursor-pointer">
                    <p className="border-b border-[#FDB022] ">
                      Tiếp tục chương trình
                    </p>
                    <img src={IMAGES.arrowRight} alt="right" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-pagination"></div>
        </Swiper>

        <img
          src={IMAGES.arrowRight}
          alt="left"
          className="rotate-180 bg-[#1244A2] rounded-full absolute z-10 top-[40%] -translate-y-1/2 -left-2 cursor-pointer"
          onClick={() => slideLeft()}
        />
        <img
          src={IMAGES.arrowRight}
          alt="right"
          className="bg-[#1244A2] rounded-full cursor-pointer absolute z-10 top-[40%] -translate-y-1/2 -right-2"
          onClick={() => slideRight()}
        />
      </div>
      <div className="flex flex-col gap-6">
        <div className="text-2xl font-bold">Môn học</div>
        <div className="flex gap-4 flex-wrap">
          {subjects &&
            subjects.map((s, index) => (
              <div
                ref={(el) => {
                  subjectRefs.current[index] = el;
                }}
                key={s.id}
                className={` border cursor-pointer hover:border-blue-600 transition-all duration-300 rounded-lg px-4 py-[21px] w-[112px] h-[138px] flex flex-col items-center gap-2`}
                onClick={() => handleSubjectClick(s.id, index)}
              >
                <img src={s.imageUrl} alt="img" />
                <div className="font-bold text-sm text-center">
                  {s.subjectName}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="text-2xl font-bold">Đề thi</div>
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
        <div className="grid grid-cols-3 gap-4">
          {exam &&
            exam.map((e: any, index) => (
              <div
                className="flex flex-col gap-4 border w-full border-[#D0D5DD] rounded-xl p-4"
                key={e.id}
              >
                <p className="font-bold h-[50px] text-start max-w-[70%]">
                  {e.examName}
                </p>
                <div className="flex items-center justify-between">
                  <p className="line-clamp-1 text-md">
                    {e.price.toLocaleString("vi-VN")}đ
                  </p>
                  {e.enrollmentId ? (
                    <CustomButton
                      text="Vào thi ngay"
                      textHover="Đừng ngại"
                      onClick={() => handleOpenPopup(e)}
                    />
                  ) : (
                    <CustomButton
                      text="Nhận mã thi"
                      textHover="Đừng ngại"
                      onClick={() => handleOpenPopup(e)}
                    />
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* <div>
        {messages.map((message, index) => (
          <div key={index} className="flex gap-2">
            <div className="font-bold">{message.name}</div>
            <div>{message.message}</div>
          </div>
        ))}
      </div> */}
      {open && (
        <Modal
          open={open}
          onCancel={handleCLose}
          title="Nhập mã thi"
          footer={false}
        >
          <div className="flex flex-col gap-3">
            <Input
              placeholder="mã thi"
              onChange={(e) => setExamCode(e.target.value)}
            />
            <div>
              Bạn chưa có mã?{" "}
              <span
                onClick={() => handlePayment()}
                className="text-blue-500 font-bold cursor-pointer"
              >
                Mua Ngay!
              </span>
            </div>
            <div className="flex justify-end ">
              <Button type="primary" onClick={() => handleTakeExam()}>
                Xác nhận
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;
