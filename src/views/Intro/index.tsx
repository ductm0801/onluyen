"use client";
import { IMAGES } from "@/constants/images";
import { ICourse, IInstructor, IInstructorDetail } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getAllInstructor, getCourse, getCourseByStudent } from "@/services";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";

// import required modules
import { Autoplay, EffectCards } from "swiper/modules";
import CustomButton from "@/components/CustomButton";
import { useAuth } from "@/providers/authProvider";
import { Avatar } from "antd";

const menu = [
  {
    title: "Về chúng tôi",
    href: "#ve-chung-toi",
  },
  {
    title: "Khoá học",
    href: "#khoa-hoc",
  },
  {
    title: "Giảng viên",
    href: "#giang-vien",
  },
];
const items = [
  IMAGES.about1,
  IMAGES.about2,
  IMAGES.about3,
  IMAGES.about4,
  IMAGES.about5,
  IMAGES.about6,
];

const Intro = () => {
  const [positions, setPositions] = useState<number[]>(items.map((_, i) => i));
  const [isActive, setIsActive] = useState(false);
  const { setLoading } = useLoading();
  const [course, setCourse] = useState<ICourse[]>([]);
  const [instructor, setInstructor] = useState<IInstructorDetail[]>([]);

  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const swiperRef = React.useRef<SwiperRef | null>(null);

  const handleSlideNext = () => {
    if (!swiperRef) return;
    swiperRef.current?.swiper.slideNext();
  };
  const handleSlidePrev = () => {
    if (!swiperRef) return;
    swiperRef.current?.swiper.slidePrev();
  };

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await getCourseByStudent(0, 3);
      if (res) {
        setCourse(res.data.items);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCourse();
    fetchInstructor();
  }, []);
  const fetchInstructor = async () => {
    try {
      setLoading(true);
      const res = await getAllInstructor();
      setInstructor(res.data);
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prevPositions) => {
        const newPositions = [...prevPositions];
        const last = newPositions.pop();
        if (last !== undefined) {
          newPositions.unshift(last);
        }
        return newPositions;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="">
      <div className="fixed top-0 left-0 right-0 border-b border-[#A4A4A4] bg-white z-20">
        <div className="flex justify-between items-center max-w-[1300px] py-8 mx-auto">
          <div className="flex items-center gap-2">
            <img src={IMAGES.logo} alt="logo" />
            <h1 className="text-3xl font-bold text-[#2E90FA] ">Ôn luyện</h1>
          </div>
          <div className="flex gap-8 border border-[#A4A4A4] rounded-full py-6 px-8">
            {menu.map((m, index) => (
              <Link
                key={index}
                href={m.href}
                className="text-black hover:text-[#1244A2]"
              >
                {m.title}
              </Link>
            ))}
          </div>
          {user ? (
            <div className="flex  gap-[8px] items-center relative group cursor-pointer">
              <div
                className="font-semibold text-lg"
                onClick={() => setOpen((open) => !open)}
              >
                Xin chào! {user?.FullName}
              </div>

              <Avatar
                className="border-2 border-gray-500 w-[38px] h-[38px]"
                src={user?.imageUrl || IMAGES.defaultAvatar}
              />

              <div
                className={`${
                  open ? "max-h-[300px]" : "max-h-0"
                } transition-all overflow-hidden min-w-[150px] duration-300 ease-in-out absolute top-10 right-0 w-full rounded-xl shadow-lg `}
              >
                <div className="flex flex-col gap-1 bg-white  p-2">
                  <button
                    className="bg-white rounded-[10px] border border-gray-300 py-2 text-black w-full flex items-center justify-center cursor-pointer"
                    onClick={() => router.push("/profile")}
                  >
                    Hồ sơ
                  </button>

                  <button
                    className="bg-white rounded-[10px] border border-gray-300 py-2 text-black w-full flex items-center justify-center cursor-pointer"
                    onClick={logout}
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-white bg-[#1244A2] flex items-center gap-2 py-[10px] px-[14px] rounded-md"
            >
              Đăng nhập
              <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 11L6.5 6L1.5 1"
                  stroke="white"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
      <div className=" pt-[160px] flex flex-col gap-16">
        <div className="bg-welcome aspect-[1216/604] max-w-[1300px] mx-auto bg-center bg-no-repeat flex items-center justify-between px-16">
          <div className="flex flex-col gap-6">
            <p className="text-[60px] text-white">Chào mừng đến với Ôn Luyện</p>
            <p className="text-white max-w-lg">
              Chào mừng bạn đến với nền tảng ôn luyện chuyên sâu dành cho kỳ thi
              năng lực Việt Nam!
            </p>
          </div>
          <img src={IMAGES.object} alt="object" />
        </div>
        <div
          id="ve-chung-toi"
          className="bg-aboutus bg-no-repeat bg-cover w-full py-16 gap-4"
        >
          <div className="flex flex-col items-center justify-center  relative">
            <p className="text-[#2E90FA] font-bold text-[60px]">Về chúng tôi</p>
            <p className="max-w-xl text-center">
              {" "}
              Chúng tôi cung cấp hệ thống bài giảng, bộ đề thi thử bám sát cấu
              trúc đề thi chính thức, cùng kho tài liệu phong phú giúp bạn nắm
              vững kiến thức và nâng cao kỹ năng làm bài.
            </p>
            <img
              src={IMAGES.courseBg}
              alt="bg"
              className="cursor-pointer pt-12"
              onClick={() => setIsActive((prev) => !prev)}
            />
            <div className="flex items-center justify-center pointer-events-none ">
              {items.map((item, index) => {
                const posIndex = positions[index];
                const theta = ((2 * Math.PI) / items.length) * posIndex;
                const y = 230 * Math.cos(theta);
                const x = 500 * Math.sin(theta);
                return (
                  <img
                    key={index}
                    src={item}
                    alt={`${index}`}
                    className={`${
                      isActive ? "opacity-100" : " opacity-0"
                    } absolute top-[55%] transition-all duration-1000 ease-in-out`}
                    style={{
                      transform: isActive
                        ? `translate3d(${x}px, ${y}px, 0px)`
                        : `translate3d(0px, 0px, 0px)`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div id="khoa-hoc" className="max-w-[1300px] mx-auto">
          <p className="text-[#2E90FA] font-bold text-[60px]">Các khoá học</p>
          <div className="flex items-center justify-between">
            <p className="max-w-xl text-start">
              {" "}
              Với giao diện trực quan, lộ trình học tập cá nhân hóa và sự hỗ trợ
              từ đội ngũ giảng viên giàu kinh nghiệm, chúng tôi cam kết đồng
              hành cùng bạn trên hành trình chinh phục kỳ thi quan trọng này.
              Hãy bắt đầu luyện tập ngay hôm nay để đạt kết quả tốt nhất!
            </p>
            <div className="text-white bg-[#1244A2] flex items-center gap-2 py-[10px] px-[14px] rounded-md">
              Xem thêm
              <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 11L6.5 6L1.5 1"
                  stroke="white"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-3 pt-12 gap-8">
            {course.map((c, index) => (
              <div
                key={index}
                className="bg-white p-4 border  rounded-[20px] shadow-md overflow-hidden"
              >
                <img
                  src={c.imageUrl}
                  alt="course"
                  className="w-full aspect-[352/384] object-cover"
                />
                <div className="p-4">
                  <p className="text-[#2E90FA] font-bold text-lg">{c.title}</p>
                </div>
                <div
                  className="bg-[#1244A2] text-white rounded-lg text-center py-3 cursor-pointer"
                  onClick={() => router.push(`/course/${c.courseId}`)}
                >
                  Chi tiết khóa học
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          id="giang-vien"
          className="bg-gradient-to-b from-[#267DFF] to-[#000288] py-16 flex flex-col items-center justify-center gap-4 "
        >
          <h1 className="text-center text-[60px] text-white">Các giảng viên</h1>
          <div className="flex items-center gap-16 w-full max-w-[1300px] mx-auto">
            <img
              src={IMAGES.arrowRight}
              alt="left"
              className="rotate-180 cursor-pointer border-white rounded-full border w-[40px]"
              onClick={() => handleSlidePrev()}
            />
            <Swiper
              slidesPerView={3}
              loop={true}
              autoplay={{ delay: 3000 }}
              spaceBetween={32}
              ref={swiperRef}
              grabCursor={true}
              modules={[Autoplay]}
              className="w-full"
            >
              {instructor.map((ins, index) => (
                <SwiperSlide key={index} className="rounded-3xl bg-white">
                  <div className="flex flex-col justify-center items-center gap-4 p-6">
                    <p className="text-white bg-[#F01818] rounded-full px-4 py-1 self-start">
                      {ins.subject.subjectName}
                    </p>
                    <p className="text-[#1A1A1A] text-xl font-bold">
                      {ins.user.fullName}
                    </p>

                    <img
                      src={IMAGES.instructorDefault}
                      alt="instructor"
                      className="w-[280px] aspect-[280/336] object-cover rounded-xl"
                    />
                    <div className="self-end">
                      <CustomButton
                        text="Xem chi tiết"
                        textHover="Xem ngay"
                        onClick={() =>
                          router.push(`/instructor-detail/${ins.user.id}`)
                        }
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <img
              src={IMAGES.arrowRight}
              alt="right"
              className=" cursor-pointer border-white rounded-full border w-[40px]"
              onClick={() => handleSlideNext()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
