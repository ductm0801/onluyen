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
      <div
        className="description-wrapper flex flex-col gap-4
                  [&_div]:!text-sm [&_div]:sm:!text-base [&_div]:xl:!text-lg [&_div]:font-medium [&_div]:text-gray800
                  [&_p]:!text-sm [&_p]:sm:!text-base [&_p]:xl:!text-lg [&_p]:text-gray800 [&_p]:font-quicksand [&_p]:font-medium
                  [&_h2]:!text-lg [&_h2]:sm:!text-xl [&_h2]:xl:!text-2xl [&_h2]:text-accent700 [&_h2]:font-akeila [&_h2]:text-stroke-[0.3px] [&_h2]:text-stroke-accent700 [&_h2]:mt-4
                  [&_h3]:!text-base [&_h3]:sm:!text-lg [&_h3]:xl:!text-22 [&_h3]:text-gray900 [&_h3]:font-akeila [&_h3]:text-stroke-[0.3px] [&_h3]:text-stroke-gray900
                  [&_li]:!text-sm [&_li]:sm:!text-base [&_li]:xl:!text-lg [&_li]:!text-gray800 [&_li]:font-quicksand [&_li]:font-medium
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_table]:text-gray800 [&_table]:font-quicksand [&_table]:font-medium
                  [&_strong]:!text-sm [&_strong]:sm:!text-base [&_strong]:text-gray800 [&_strong]:font-quicksand [&_strong]:xl:!text-lg [&_strong]:!font-extrabold [&_strong>div]:font-extrabold
                  [&_blockquote>p]:!text-primary800 [&_blockquote>p]:font-semibold [&_blockquote>p]:border-l-[1px] [&_blockquote>p]:border-primary800 [&_blockquote>p]:pl-3
                  [&_blockquote>div]:!text-primary800 [&_blockquote>div]:font-semibold [&_blockquote>div]:border-l-[1px] [&_blockquote>div]:border-primary800 [&_blockquote>div]:pl-3
                  [&_a]:break-all [&_a]:inline [&_a]:hyphens-auto [&_a]:word-wrap-break-word
                  [&_img]:place-self-center
                  "
        dangerouslySetInnerHTML={{ __html: news.content }}
      />
    </div>
  );
};

export default NewsDetail;
