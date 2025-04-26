import { dayOfWeekOptions } from "@/constants/enum";
import { useLoading } from "@/providers/loadingProvider";
import { getMeetLink } from "@/services";
import { Tooltip } from "antd";
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  data: any[];
};

const Schedule: FC<Props> = ({ data }) => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const { setLoading } = useLoading();

  const convertToTime = (timeStr: string) => {
    const hour = parseInt(timeStr.split(" ")[0], 10);
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  const generateSchedule = () => {
    const schedule: any[] = [];

    data.forEach((scheduleItem) => {
      scheduleItem.timeSlots.forEach((slot: any) => {
        const day = dayOfWeekOptions.find((d) => d.value === slot.dayOfWeek);
        if (day) {
          const dayIndex = dayOfWeekOptions.indexOf(day);

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

  useEffect(() => {
    setSchedule(generateSchedule());
  }, [data]);

  const handleGetMeetLink = async (data: any) => {
    try {
      setLoading(true);
      const res = await getMeetLink(data.id);
      if (res) window.open(res.data, "_blank");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border rounded-xl text-sm text-center border-spacing-2">
        <thead>
          <tr>
            {dayOfWeekOptions.map((day) => (
              <th
                key={day.value}
                className="text-white bg-[#FDB022] rounded-xl px-4 py-2"
              >
                {day.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {dayOfWeekOptions.map((day, index) => {
              const daySchedule = schedule[index];

              return (
                <td key={day.value}>
                  {Array.isArray(daySchedule) &&
                    daySchedule.map((slot, idx) => (
                      <Tooltip
                        key={idx}
                        title="Đi đến lớp học"
                        className="cursor-pointer w-full block"
                      >
                        <div
                          className="w-full border px-2 py-1 mb-2 bg-[#1244A2] text-white rounded-md"
                          onClick={() => handleGetMeetLink(slot)}
                        >
                          <div className="text-[11px]">{slot.note}</div>
                          <div className="font-semibold text-[12px]">
                            {slot.startTime} - {slot.endTime}
                          </div>
                        </div>
                      </Tooltip>
                    ))}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;
