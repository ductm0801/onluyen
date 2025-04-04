"use client";
import { IMAGES } from "@/constants/images";
import { db } from "@/firebase/config";
import { IInstructorDetail } from "@/models";
import { useAuth } from "@/providers/authProvider";
import { useLoading } from "@/providers/loadingProvider";
import { getChat, getInstructorDetail, sendMessage } from "@/services";
import { Form, Image } from "antd";
import { collection, onSnapshot } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

const InstructorDetail = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const params = useParams();
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [detail, setDetail] = useState<IInstructorDetail>();
  const { setLoading } = useLoading();
  const router = useRouter();
  const sliderRef = useRef<any>();
  const fetchChat = async () => {
    try {
      const res = await getChat(params.id);
      if (res) setMessages(res);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchInstructor = async () => {
    try {
      setLoading(true);
      const res = await getInstructorDetail(params.id);
      if (res) setDetail(res.data);
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchInstructor();
  }, [params.id]);

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
  return (
    <div>
      <div className="flex items-center gap-4">
        <Image
          width={150}
          height={150}
          src={IMAGES.defaultAvatar}
          alt="avatar"
        />
        <div>
          <b>{detail?.user?.fullName}</b>
          {/* <div>{detail?.instructor.}</div> */}
        </div>
      </div>
      <div>
        <div>
          <div className="flex flex-col gap-4">
            <div>
              <b>Số năm kinh nghiệm:</b> {detail?.instructor.yearOfExperience}
            </div>
            <div>
              <b>Email:</b> {detail?.user.email}
            </div>
            <div>
              <b>Môn học:</b> {detail?.subject.subjectName}
            </div>
            <div className="flex flex-col gap-3 items-start">
              <b>Chứng chỉ:</b>{" "}
              <img src={detail?.instructor.certificate} alt="cert" />
            </div>
            {detail?.courses && detail?.courses.length > 0 && (
              <div className="overflow-visible relative">
                <div className="font-bold mb-4 text-xl">Các khóa học:</div>
                <Swiper slidesPerView={3} className=" w-full  " ref={sliderRef}>
                  {detail?.courses.map((c: any, index) => (
                    <SwiperSlide
                      key={index}
                      className="bg-white p-4 border  rounded-[20px] shadow-md overflow-hidden"
                    >
                      <img
                        src={c.imageUrl}
                        alt="course"
                        className="w-full aspect-[352/384] object-cover"
                      />
                      <div className="p-4">
                        <p className="text-[#2E90FA] font-bold text-lg">
                          {c.title}
                        </p>
                      </div>
                      <div
                        className="bg-[#1244A2] text-white rounded-lg text-center py-3 cursor-pointer"
                        onClick={() => router.push(`/course/${c.id}`)}
                      >
                        Chi tiết khóa học
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <img
                  src={IMAGES.arrowRight}
                  alt="left"
                  className="rotate-180  absolute top-1/2 z-50 -translate-y-1/2 -left-[10px] cursor-pointer bg-blue-600 rounded-full"
                  onClick={() => slideLeft()}
                />
                <img
                  src={IMAGES.arrowRight}
                  alt="right"
                  className="cursor-pointer absolute top-1/2 z-50 -translate-y-1/2 -right-[10px] bg-blue-600 rounded-full"
                  onClick={() => slideRight()}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetail;
