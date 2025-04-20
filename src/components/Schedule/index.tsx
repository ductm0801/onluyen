import { useLoading } from "@/providers/loadingProvider";
import { getMeetLink } from "@/services";
import { Tooltip } from "antd";
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
type props = {
  duration: string;
  data: any[];
};

const dayOfWeekOptions = [
  { value: "ChuNhat", label: "Chủ nhật" },
  { value: "ThuHai", label: "Thứ hai" },
  { value: "ThuBa", label: "Thứ ba" },
  { value: "ThuTu", label: "Thứ tư" },
  { value: "ThuNam", label: "Thứ năm" },
  { value: "ThuSau", label: "Thứ sáu" },
  { value: "ThuBay", label: "Thứ bảy" },
];

const Schedule: FC<props> = ({ duration, data }) => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const { setLoading } = useLoading();
  const convertToTime = (timeStr: string) => {
    const hour = parseInt(timeStr.split(" ")[0], 10);
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  const isTimeSlotMatched = (slotStartTime: any, timeLabel: any) => {
    const slotStartHour = parseInt(slotStartTime.split(":")[0], 10);
    const slotEndHour = slotStartHour + parseInt(duration.split(":")[0], 10);

    const timeHour = parseInt(timeLabel.split(":")[0], 10);

    // Kiểm tra nếu timeLabel nằm trong khoảng thời gian học
    return timeHour >= slotStartHour && timeHour < slotEndHour;
  };

  const generateSchedule = () => {
    const schedule: any[] = [];

    // Duyệt qua từng lớp học
    data.forEach((scheduleItem) => {
      scheduleItem.timeSlots.forEach((slot: any) => {
        // Tìm ngày trong tuần tương ứng
        const day = dayOfWeekOptions.find((d) => d.value === slot.dayOfWeek);
        if (day) {
          const dayIndex = dayOfWeekOptions.indexOf(day);

          // Tạo hoặc cập nhật dữ liệu cho lịch học
          if (!schedule[dayIndex]) {
            schedule[dayIndex] = [];
          }
          schedule[dayIndex].push({
            id: slot.id,
            note: scheduleItem.note,
            startTime: convertToTime(slot.startTime),
            endTime: convertToTime(slot.endTime),
            courseId: scheduleItem.courseId,
          });
        }
      });
    });

    return schedule;
  };
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      const startTime = `${hour.toString().padStart(2, "0")}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;
      slots.push({ startTime, endTime });
    }
    return slots;
  };

  const timeSlots = getTimeSlots();

  useEffect(() => {
    setSchedule(generateSchedule());
  }, [data]);
  const handleGetMeetLink = async (data: any) => {
    try {
      setLoading(true);
      const res = await getMeetLink(data.id);
      if (res) window.open(res.data, "_blank");
    } catch (e: any) {
      toast.error(e.response.data.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate text-sm text-center border-spacing-2">
        <thead>
          <tr>
            <th className=" relative bg-[#1244A2]   text-start text-[10px] rounded-xl text-white px-4 pt-3">
              Thời gian
              <p className="absolute inset-0 z-50 text-end px-4 pb-3 bg-[#FDB022] border border-[#FDB022] rounded-xl clip-half">
                Ngày
              </p>
            </th>
            {dayOfWeekOptions.map((day) => (
              <th
                key={day.value}
                className=" text-white bg-[#FDB022] rounded-xl px-4 py-2"
              >
                {day.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((timeSlot) => (
            <tr key={timeSlot.startTime}>
              <td className=" border-gray-300 py-2 font-medium bg-[#1244A2] text-white rounded-xl">
                {timeSlot.startTime} - {timeSlot.endTime}
              </td>
              {dayOfWeekOptions.map((day, index) => {
                const daySchedule = schedule[index];

                return (
                  <td key={index} className={`rounded-xl border  `}>
                    {Array.isArray(daySchedule) &&
                      daySchedule
                        .filter((slot) =>
                          isTimeSlotMatched(slot.startTime, timeSlot.startTime)
                        )
                        .map((slot, idx) => (
                          <Tooltip
                            key={idx}
                            title="Đi đến lớp học"
                            className="cursor-pointer w-full px-2 py-1"
                          >
                            <div
                              className="w-full"
                              onClick={() => handleGetMeetLink(slot)}
                            >
                              {slot.note}
                            </div>
                          </Tooltip>
                        ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;
