"use client";
import { ICourse } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getCourseDetail } from "@/services";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CourseDetail = () => {
  const [course, setCourse] = useState<ICourse>();
  const params = useParams();
  const { setLoading } = useLoading();
  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const res = await getCourseDetail(params.id);

      if (res) {
        setCourse(res.data);
      }
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCourseDetail();
  }, [params.id]);
  return <div>CourseDetail</div>;
};

export default CourseDetail;
