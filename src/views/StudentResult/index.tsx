"use client";
import Paging from "@/components/Paging";
import { examResultEnum } from "@/constants/enum";
import { IMAGES } from "@/constants/images";
import { IEXamResult } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { examResult, getExamResults } from "@/services";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

const sort = [
  { label: "Điểm cao đến thấp", value: true },
  { label: "Điểm thấp đến cao", value: false },
];

export const renderBgColorStatus = (status: keyof typeof examResultEnum) => {
  switch (status) {
    case 0:
      return "from-emerald-600 to-teal-400";
    case 1:
      return "from-red-600 to-red-300";
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
  console.log(result);
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
      <div className="grid grid-cols-3 pt-4 gap-4">
        {result.map((item) => (
          <div className="border rounded-lg p-4 shadow-lg" key={item.id}>
            <h2 className="font-bold">{item.examName}</h2>
            <p className="font-bold">
              Điểm thi gần nhất:{" "}
              <span className={` ${renderColorStatus(item.latestExamResult)}`}>
                {item.latestGrade} điểm{" "}
              </span>
            </p>

            <span className="font-bold">Kết quả: </span>
            <p
              className={`bg-gradient-to-br rounded-xl text-sm font-bold w-fit px-3 py-2 inline-block ${renderBgColorStatus(
                item.latestExamResult
              )}`}
            >
              <span className={`${renderColorStatus(item.latestExamResult)} `}>
                {examResultEnum[item.latestExamResult]}
              </span>
            </p>
            <p>
              <span className="font-bold">Môn:</span> {item.subjectName}
            </p>
            <p>
              <span className="font-bold">Ngày thi:</span>{" "}
              {moment(item.nearestAttemptDate).format("DD/MM/YYYY")}
            </p>
            <div
              className="flex items-center gap-2 text-blue-600 font-bold cursor-pointer justify-end"
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
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 opacity-50 z-50 flex items-center justify-center">

        </div>
      )}
    </div>
  );
};

export default StudentResult;
