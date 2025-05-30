"use client";
import Paging from "@/components/Paging";
import { dayOfWeekOptions } from "@/constants/enum";
import { IMAGES } from "@/constants/images";
import { formatDuration } from "@/constants/utils";
import { ICourse } from "@/models";
import { useAuth } from "@/providers/authProvider";
import { useLoading } from "@/providers/loadingProvider";
import {
  getCourseDetail,
  getSchedule,
  handleTrialCourse,
  paymentCourse,
  startCourse,
} from "@/services";
import { Select } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CalendarDays, Clock } from "lucide-react";

const CourseDetail = () => {
  const [course, setCourse] = useState<ICourse>();
  const [schedule, setSchedule] = useState<any>();
  const params = useParams();
  const { setLoading } = useLoading();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { user } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const res = await getCourseDetail(params.id, currentPage, pageSize);
      if (res) {
        setCourse(res.data);
        setTotalItems(res.data.lessons.totalItemsCount);
        setTotalPages(res.data.lessons.totalPageCount);
      }
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCourseDetail();
  }, [params.id, currentPage]);
  const fetchCourseSchedule = async () => {
    if (course?.courseType === 0) return;
    try {
      setLoading(true);
      const res = await getSchedule(0, 100, params.id);
      if (res) {
        setSchedule(res.data.items);
        setSelectedTime(res.data.items[0]?.scheduleId);
      }
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseSchedule();
  }, [course]);
  const handlePayment = async () => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để thanh toán!");
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        courseId: course?.courseId,
        cancelUrl: `${process.env.NEXT_PUBLIC_HOST}/payment/cancel`,
        returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/course/${course?.courseId}`,
        amount: course?.coursePrice,
      };

      if (course?.courseType !== 0) {
        payload.scheduleId = selectedTime;
      }

      const res = await paymentCourse(payload);
      if (res) router.push(res.data);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearning = async () => {
    if (course?.isStarted) {
      router.push(`/student/learning/${course?.courseId}`);
      return;
    }

    await startCourse(course?.paidCourse.id || "");
    router.push(`/student/learning/${course?.paidCourse.id}`);
  };
  const handleTrial = async () => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để học thử!");
      return;
    }
    if (course?.trialCourse !== null) {
      router.replace(`/student/learning/${course?.trialCourse.id}`);
      return;
    }
    try {
      setLoading(true);
      const res = await handleTrialCourse(params.id);

      router.replace(`/student/learning/${res.data.studentCourseId}`);
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };
  const handleRenderContent = () => {
    switch (course?.courseType) {
      case 0:
        return (
          <>
            {" "}
            <div className="flex flex-col gap-2 text-[#667085]">
              {course?.lessons.items.map((item, index) => (
                <div
                  key={item.lessonId}
                  className="flex items-center justify-between gap-2 rounded-2xl border p-6 cursor-pointer"
                  onClick={() => setActive(index)}
                >
                  <div className="flex flex-col w-full">
                    <p className="text-[#101828] font-bold">{item.title}</p>
                    <div
                      className={`flex items-center w-full justify-between ${
                        active === index ? "max-h-[500px]" : "max-h-0"
                      } overflow-hidden transition-all duration-300 `}
                    >
                      <p>{item.description}</p>
                      <span className="text-[#101828] font-bold">
                        {Math.floor((item?.totalVideoLength || 0) / 60)} phút{" "}
                        {(item?.totalVideoLength || 0) % 60} giây
                      </span>{" "}
                    </div>
                  </div>
                  <img
                    src={active === index ? IMAGES.minusIcon : IMAGES.plusIcon}
                    alt="icon"
                  />
                </div>
              ))}
            </div>
            <Paging
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageSize={pageSize}
              totalItems={totalItems}
              totalPages={totalPages}
            />
          </>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#101828]">
              📚 Chọn thời gian học
            </h2>

            <Select
              options={schedule.map((s: any) => ({
                label: s.note,
                value: s.scheduleId,
              }))}
              placeholder="🕐 Chọn lịch học phù hợp"
              onChange={(e) => setSelectedTime(e)}
              value={selectedTime}
              className="text-base"
            />

            {selectedTime && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schedule
                  .find((s: any) => s.scheduleId === selectedTime)
                  ?.timeSlots.map((timeSlot: any) => (
                    <div
                      key={timeSlot.id}
                      className="p-5 rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-2 mb-2 text-primary">
                        <CalendarDays size={18} />
                        <span className="font-semibold text-[#101828]">
                          {
                            dayOfWeekOptions.find(
                              (option) => option.value === timeSlot.dayOfWeek
                            )?.label
                          }
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[#667085] text-sm mb-1">
                        <Clock size={16} />
                        <span>
                          {timeSlot.startTime} - {timeSlot.endTime}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="grid grid-cols-3 gap-x-8">
      <div className="flex flex-col gap-4 col-span-2">
        <h1 className="text-4xl font-bold">{course?.title}</h1>
        <p className="text-base text-[#344054]">{course?.description}</p>
        <div className="grid grid-cols-2 items-center gap-4">
          {course?.courseType === 0 ? (
            <div className="flex items-center gap-2 text-[#667085]">
              <img src={IMAGES.lessonIcon} alt="lesson" />
              Tổng số
              <span className="text-[#101828] font-bold">{totalItems}</span> bài
              học
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#667085]">
              <img src={IMAGES.course} alt="lesson" className="w-6" />
              Tổng
              <span className="text-[#101828] font-bold">
                {course?.totalTimeSlotAmount}
              </span>{" "}
              buổi học
            </div>
          )}

          <div className="flex items-center gap-2 text-[#667085]">
            <img src={IMAGES.priceIcon} alt="lesson" className="w-[25px]" />
            Giá
            <span className="text-[#101828] font-bold">
              {course?.coursePrice.toLocaleString("vi-VN")}đ
            </span>{" "}
          </div>
          <div className="flex items-center gap-2 text-[#667085]">
            <img src={IMAGES.peopleIcon} alt="lesson" className="w-[25px]" />
            Số người tham gia
            <span className="text-[#101828] font-bold">
              {course?.totalParticipants}
            </span>{" "}
          </div>
          <div className="flex items-center gap-2 text-[#667085]">
            <img src={IMAGES.clockIcon} alt="lesson" className="w-[25px]" />
            {course?.courseType === 0 ? (
              <>
                Tổng thời gian học
                <span className="text-[#101828] font-bold">
                  {Math.floor((course?.totalVideosLength || 0) / 60)} phút{" "}
                  {(course?.totalVideosLength || 0) % 60} giây
                </span>{" "}
              </>
            ) : (
              <>
                Thời gian học{" "}
                <span className="text-[#101828] font-bold">
                  {formatDuration(course?.timeSlotDuration || "00:00:00")}/ buổi
                </span>
              </>
            )}
          </div>
        </div>
        {handleRenderContent()}
      </div>
      <div className="flex flex-col gap-3">
        <img
          src={course?.imageUrl}
          alt="images"
          className="aspect-[3/2] object-cover rounded-lg"
        />
        {course?.isJoined ? (
          <div
            className="bg-[#1244A2] text-white rounded-lg text-center py-3 cursor-pointer flex items-center gap-3 justify-center"
            onClick={() => {
              course.courseType === 0
                ? handleStartLearning()
                : router.replace(`/student/my-course`);
            }}
          >
            Vào học <img src={IMAGES.arrowRight} alt="right" />
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full">
            {course?.courseType === 0 && (
              <div
                className="bg-[#FDB022] w-full text-white rounded-lg text-center py-3 cursor-pointer flex items-center gap-3 justify-center"
                onClick={() => handleTrial()}
              >
                Học thử
              </div>
            )}
            <div
              className="bg-[#1244A2] w-full text-white rounded-lg text-center py-3 cursor-pointer flex items-center gap-3 justify-center"
              onClick={() => handlePayment()}
            >
              Đăng ký <img src={IMAGES.arrowRight} alt="right" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
