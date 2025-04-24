import { Popover, Select, Tooltip } from "antd";
import React, { FC, useState } from "react";
import dayjs from "dayjs";
import { useLoading } from "@/providers/loadingProvider";
import { getMeetLink } from "@/services";
import { toast } from "react-toastify";

type props = {
  data: any;
  currentWeek: any;
  setStartDate: any;
  setEndDate: any;
};

const dayOfWeekOrder = [
  "ThuHai",
  "ThuBa",
  "ThuTu",
  "ThuNam",
  "ThuSau",
  "ThuBay",
  "ChuNhat",
];

const dayOfWeekLabels: Record<string, string> = {
  ChuNhat: "Chủ nhật",
  ThuHai: "Thứ hai",
  ThuBa: "Thứ ba",
  ThuTu: "Thứ tư",
  ThuNam: "Thứ năm",
  ThuSau: "Thứ sáu",
  ThuBay: "Thứ bảy",
};

const ScheduleTotal: FC<props> = ({
  data,
  currentWeek,
  setStartDate,
  setEndDate,
}) => {
  const { setLoading } = useLoading();
  const getMonday = (dateStr: string) => {
    const date = dayjs(dateStr);
    const dayOfWeek = date.day();
    return dayOfWeek === 0
      ? date.subtract(6, "day")
      : date.subtract(dayOfWeek - 1, "day");
  };

  const generateWeeks = (startDate: string, numberOfWeeks: number) => {
    const weeks = [];
    const monday = getMonday(startDate);
    for (let i = 0; i < numberOfWeeks; i++) {
      const weekStart = monday.add(i * 7, "day");
      const weekEnd = weekStart.add(6, "day");
      weeks.push({
        label: `${weekStart.format("DD/MM")} - ${weekEnd.format("DD/MM")}`,
        value: {
          startDate: weekStart.format("YYYY-MM-DD"),
          endDate: weekEnd.format("YYYY-MM-DD"),
        },
      });
    }
    return weeks;
  };

  function generateTimeSlots(start = 7, end = 20): string[] {
    const slots: string[] = [];
    for (let hour = start; hour <= end; hour++) {
      const hourStr = hour.toString().padStart(2, "0");
      slots.push(`${hourStr}:00`);
      if (hour !== end) {
        slots.push(`${hourStr}:30`);
      }
    }
    return slots;
  }

  const timeSlots = generateTimeSlots();

  const weekOptions = generateWeeks("2025-04-01", 20);
  const defaultValue = weekOptions.find(
    (w) =>
      w.value.startDate === currentWeek.startDate &&
      w.value.endDate === currentWeek.endDate
  );

  const getCell = (day: string, time: string) => {
    const entry: any = data.find(
      (item: any) => item.dayOfWeek === day && item.startTime.startsWith(time)
    );
    if (!entry) return null;

    return (
      <Popover
        placement="top"
        title={entry.courseTitle}
        content="Đi đên lớp học"
        className="cursor-pointer"
      >
        <div
          className="text-sm font-bold text-center p-2 rounded"
          onClick={() => handleGetMeetLink(entry)}
        >
          <div className="line-clamp-1">{entry.courseTitle}</div>
          <div>
            {entry.startTime.slice(0, 5)} - {entry.endTime.slice(0, 5)}
          </div>
        </div>
      </Popover>
    );
  };

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
    <div>
      <Select
        style={{ width: 250 }}
        placeholder="Chọn tuần"
        options={weekOptions.map((week) => ({
          label: week.label,
          value: JSON.stringify(week.value),
        }))}
        defaultValue={JSON.stringify(defaultValue?.value)}
        onChange={(value) => {
          const { startDate, endDate } = JSON.parse(value);
          setStartDate(startDate);
          setEndDate(endDate);
        }}
      />
      <div className="overflow-auto py-4">
        <table className="table-fixed border border-separate border-spacing-2 rounded-[20px] p-4 w-full">
          <thead>
            <tr>
              <th className=" relative bg-[#1244A2] w-[100px]  text-start text-[10px] rounded-xl text-white px-2 pt-4">
                Thời gian
                <p className="absolute inset-0 z-50 text-end px-2 pb-4 bg-[#FDB022] border border-[#FDB022] rounded-xl clip-half">
                  Ngày
                </p>
              </th>
              {dayOfWeekOrder.map((day) => (
                <th
                  key={day}
                  className=" text-white bg-[#FDB022] rounded-xl px-4 py-2"
                >
                  {dayOfWeekLabels[day]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <td className=" border-gray-300 py-2 text-center font-medium bg-[#1244A2] text-white rounded-xl">
                  {time}
                </td>
                {dayOfWeekOrder.map((day) => (
                  <td key={day} className="rounded-xl border">
                    {getCell(day, time)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(ScheduleTotal);
