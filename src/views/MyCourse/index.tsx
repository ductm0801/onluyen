"use client";
import { useLoading } from "@/providers/loadingProvider";
import { getMeetLink, getStudentCourse, getStudentSchedule } from "@/services";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Select, Tooltip } from "antd";
import { dayOfWeekOptions } from "@/constants/enum";
import { toast } from "react-toastify";
import { getCurrentWeekRange } from "@/constants/utils";
import ScheduleTotal from "@/components/ScheduleTotal";

const MyCourse = () => {
  const [data, setData] = useState([]);
  const { setLoading } = useLoading();

  const currentWeek = getCurrentWeekRange();
  const [startDate, setStartDate] = useState(currentWeek.startDate);
  const [endDate, setEndDate] = useState(currentWeek.endDate);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getStudentSchedule(startDate, endDate);
      if (res) {
        setData(res.data);
        console.log("eheheh");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  return (
    <div>
      <p className="text-3xl text-[#1244A2] font-bold py-4">Lịch học</p>
      <ScheduleTotal
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        data={data}
        currentWeek={currentWeek}
      />
    </div>
  );
};

export default MyCourse;
