"use client";
import { useLoading } from "@/providers/loadingProvider";
import { getNewDetail } from "@/services";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const NewsDetail = () => {
  const [news, setNews] = useState<any>();
  const { setLoading } = useLoading();
  const params = useParams();
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getNewDetail(params.id);
      if (res) setNews(res.data);
    } catch (e: any) {
      toast.error(e.response.data.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [params.id]);
  console.log(news);
  if (!news) return;
  return (
    <div className="flex flex-col gap-4">
      <img src={news.videoUrl} className="rounded-xl w-full" />
      <h1 className="text-3xl font-bold text-center">{news.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: news.content }} />
    </div>
  );
};

export default NewsDetail;
