"use client";
import Paging from "@/components/Paging";
import { examResultEnum } from "@/constants/enum";
import { IMAGES } from "@/constants/images";
import { IEXamResult } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { examResult, getExamResults, getHistoryExamDetail } from "@/services";
import { Modal, Tooltip } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const sort = [
  { label: "Điểm cao đến thấp", value: true },
  { label: "Điểm thấp đến cao", value: false },
];

export const renderBgColorStatus = (status: keyof typeof examResultEnum) => {
  switch (status) {
    case 0:
      return "bg-[#17B26A]";
    case 1:
      return "bg-[#F04438]";
    default:
      return "";
  }
};

export const renderColorStatus = (status: keyof typeof examResultEnum) => {
  switch (status) {
    case 0:
      return "text-green-800";
    case 1:
      return "text-red-800";
  }
};

const StudentResult = () => {
  const [result, setResult] = useState<IEXamResult[]>([]);
  const { setLoading } = useLoading();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortType, setSortType] = useState(true);
  const detail = useRef<IEXamResult | null>(null);
  const [viewDetail, setViewDetail] = useState(false);
  const router = useRouter();
  const [resultDetail, setResultDetail] = useState<{
    testHistory: any[];
  } | null>(null);
  const handleOpenDetail = (item: IEXamResult) => {
    setViewDetail(true);
    detail.current = item;
  };
  const handleCloseDetail = () => {
    setViewDetail(false);
    detail.current = null;
  };
  const fetchResult = async () => {
    try {
      setLoading(true);
      const res = await getExamResults(currentPage, pageSize, sortType);
      if (res) setResult(res.data.items);
      setTotalItems(res.data.totalItemsCount);
      setTotalPages(res.data.totalPageCount);
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchResult();
  }, [currentPage, sortType]);
  const fetchResultDetail = async () => {
    if (!detail.current) return;
    try {
      setLoading(true);
      const res = await getHistoryExamDetail(detail.current?.id, 0, 10);
      if (res) setResultDetail(res.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchResultDetail();
  }, [detail.current]);

  return (
    <div>
      <div className="flex items-center justify-end gap-2">
        Sắp xếp theo:
        <p
          className="flex items-center cursor-pointer"
          onClick={() => setSortType(!sortType)}
        >
          {" "}
          {sort[sortType ? 0 : 1].label}{" "}
          <img
            src={IMAGES.arrowDown}
            className={`${
              sortType ? "rotate-0" : "rotate-180"
            } transition-all duration-300 ease-in-out w-[20px]`}
          />
        </p>
      </div>
      <div className="flex flex-wrap  pt-4 gap-4">
        {result.map((item) => (
          <div
            className="border flex flex-col gap-4 w-[364px] rounded-[20px]  p-4 shadow-lg"
            key={item.id}
          >
            <div className="flex items-start justify-between pb-4">
              <h2 className="font-bold text-2xl line-clamp-2">
                {item.examName}
              </h2>
              <p
                className={`rounded-xl text-xs flex items-center gap-1 min-w-fit px-[7px] py-0.5 font-bold ${renderBgColorStatus(
                  item.latestExamResult
                )}`}
              >
                <img
                  src={
                    item.latestExamResult === 0
                      ? IMAGES.passIcon
                      : IMAGES.notPassIcon
                  }
                  alt="icon"
                />
                <span className={`text-white`}>
                  {examResultEnum[item.latestExamResult]}
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-base flex items-center justify-between">
                Điểm thi gần nhất:{" "}
                <span
                  className={` ${renderColorStatus(
                    item.latestExamResult
                  )} font-bold`}
                >
                  {Math.round(item.latestGrade)}/{item.latestTestTotalGrade}{" "}
                  điểm{" "}
                </span>
              </p>

              <p className="text-base flex items-center justify-between">
                Môn:
                <span className="font-bold">{item.subjectName}</span>
              </p>
              <p className="text-base flex items-center justify-between">
                Ngày thi:
                <span className="font-bold">
                  {" "}
                  {moment(item.nearestAttemptDate).format("DD/MM/YYYY")}
                </span>{" "}
              </p>
            </div>

            <div
              className="flex items-center gap-2 text-blue-600 font-bold cursor-pointer justify-center"
              onClick={() => handleOpenDetail(item)}
            >
              Xem chi tiết{" "}
              <img
                src={IMAGES.arrowRight}
                className="bg-blue-600 rounded-full "
                alt="right"
              />
            </div>
          </div>
        ))}
      </div>
      <Paging
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        totalPages={totalPages}
      />
      {viewDetail && (
        <Modal
          open={viewDetail}
          title="Chi tiết kết quả"
          onCancel={() => handleCloseDetail()}
          footer={null}
        >
          <div className="p-4 max-h-[600px] overflow-y-auto">
            {resultDetail?.testHistory?.map((item: any, index: number) => (
              <div
                key={index}
                className="border-b p-4 mb-4 flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-[90%]">
                  <p className="flex items-center justify-between">
                    Điểm thi lần {index + 1}:{" "}
                    <span
                      className={`font-bold ${
                        item.isPass ? "text-[#17B26A]" : " text-[#F04438]"
                      } `}
                    >
                      {Math.round(item.grade)} /{item.testTotalGrade} điểm
                    </span>
                  </p>
                  <div className="flex items-center justify-between">
                    Thời gian thi:{" "}
                    <p className="font-bold">
                      {moment(item.publishedDate).diff(
                        moment(item.attemptDate),
                        "minutes"
                      )}{" "}
                      phút{" "}
                      {moment(item.publishedDate).diff(
                        moment(item.attemptDate),
                        "seconds"
                      ) % 60}{" "}
                      giây
                    </p>
                  </div>
                </div>
                <Tooltip title="Xem lại bài làm">
                  <img
                    src={IMAGES.eyeShow}
                    alt="detail"
                    className="w-[20px] cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/student/result-detail/${item.testAttemptId}`
                      )
                    }
                  />
                </Tooltip>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentResult;
