"use client";
import ScheduleTotal from "@/components/ScheduleTotal";
import { getCurrentWeekRange } from "@/constants/utils";
import { useLoading } from "@/providers/loadingProvider";
import { getInstructorSchedule } from "@/services";
import React, { useEffect, useState } from "react";

const InstructorSchedule = () => {
  const [data, setData] = useState([]);
  const { setLoading } = useLoading();

  const currentWeek = getCurrentWeekRange();
  const [startDate, setStartDate] = useState(currentWeek.startDate);
  const [endDate, setEndDate] = useState(currentWeek.endDate);
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getInstructorSchedule(startDate, endDate);
      if (res) {
        setData(res.data);
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
      <p className="text-3xl text-[#1244A2] font-bold py-4">Lịch dạy</p>
      <ScheduleTotal
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        data={data}
        currentWeek={currentWeek}
        fetchData={fetchData}
      />
    </div>
  );
};

export default InstructorSchedule;
