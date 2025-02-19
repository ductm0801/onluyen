"use client";
import CircularProgess from "@/components/CircularProgress";
import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { IMAGES } from "@/constants/images";
import { getSubject } from "@/services";
import { useLoading } from "@/providers/loadingProvider";
import { useAuth } from "@/providers/authProvider";

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
  const ref = useRef<any>();
  const [subjects, setSubjects] = React.useState<any[]>([]);
  const { setLoading } = useLoading();
  const { user } = useAuth();
  const slideLeft = () => {
    if (!ref) {
      return;
    }
    ref.current.swiper.slidePrev();
  };
  const slideRight = () => {
    if (!ref) {
      return;
    }
    ref.current.swiper.slideNext();
  };
  const fetchSubject = async () => {
    try {
      setLoading(true);
      const res = await getSubject();
      if (res) {
        setSubjects(res.data);
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
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="font-bold text-[#0C111D]">Hi, {user?.UserName}!</div>
        <div className="flex gap-2 items-center border border-[#D0D5DD] rounded-full py-2 px-4">
          <img src={IMAGES.searchIcon} alt="search" className="text-sm" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="border-none outline-none ring-0"
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
          ref={ref}
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
            subjects.map((s) => (
              <div
                key={s.id}
                className="w-[180px] border border-[#D0D5DD] rounded-xl p-4 shadow-lg"
              >
                <div className="flex flex-col items-center gap-2">
                  <div>
                    <div className="font-bold text-sm text-center">
                      {s.subjectName}
                    </div>
                    <p className="line-clamp-2">{s.subjectDescription}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
