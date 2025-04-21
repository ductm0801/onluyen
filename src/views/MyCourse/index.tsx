"use client";
import { useLoading } from "@/providers/loadingProvider";
import { getStudentCourse } from "@/services";
import React, { useEffect, useState } from "react";

const MyCourse = () => {
  const [data, setData] = useState([]);
  const { setLoading } = useLoading();
  const fetchData = async () => {
    setLoading;
    try {
      const res = await getStudentCourse();
      if (res) {
        setData(res.data.items);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  console.log(data);
  useEffect(() => {
    fetchData();
  }, []);
  return <div>MyCOurse</div>;
};

export default MyCourse;
