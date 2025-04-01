"use client";
import { IExam } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getExamDetail, updateTestStatus } from "@/services";
import { Form, Input, Modal, Select, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import FormUpdateInfo from "./FormUpdateInfo";
import FormUpdateExam from "./FormUpdateExam";
import { pendingExamEnum } from "@/constants/enum";

export const renderBgColorStatus = (status: keyof typeof pendingExamEnum) => {
  switch (status) {
    case 1:
      return "from-orange-600 to-orange-300";
    case 2:
      return "from-emerald-600 to-emerald-400";
    case 4:
      return "from-red-600 to-red-300";
    case 3:
      return "from-red-600 to-red-400";
    case 0:
      return "from-slate-600 to-slate-300";
    default:
      return "from-emerald-500 to-teal-400";
  }
};

const ExamDetail = () => {
  const [exam, setExam] = useState<IExam>();
  const [form] = Form.useForm();
  const params = useParams();
  const [pageIndex, setPageIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { setLoading } = useLoading();
  const fetchExam = async () => {
    try {
      setLoading(true);
      const res = await getExamDetail(params.id, pageIndex, pageSize);
      setExam(res.data);
    } catch (err: any) {
      setLoading(false);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExam();
  }, [params.id]);
  const onChangeStatus = async (status: number) => {
    try {
      setLoading(true);
      const res = await updateTestStatus({ status }, params.id);
      if (res) {
        toast.success(res.message);
        fetchExam();
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const tab = [
    {
      value: 0,
      label: "Thông tin chung",
      children: <FormUpdateInfo exam={exam} id={params.id} />,
    },
    {
      value: 1,
      label: "Câu hỏi",
      children: <FormUpdateExam exam={exam} id={params.id} />,
    },
  ];

  const handleConfirm = () => {
    Modal.confirm({
      title: "Xác nhận Chuyển Trạng thái Chờ Duyệt",
      content: `Bạn có chắc chắn muốn chuyển trạng thái sang Chờ Duyệt? Khi đã chuyển, bạn sẽ không thể chỉnh sửa bài kiểm tra nữa.`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        await onChangeStatus(1);
      },
    });
    return;
  };
  const handleConfirmDraft = () => {
    Modal.confirm({
      title: "Xác nhận Chuyển Trạng thái bản nháp",
      content: `Bạn có chắc chắn muốn chuyển trạng thái sang Bản nháp?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        await onChangeStatus(0);
      },
    });
    return;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-4">
        <h1 className="text-4xl font-bold">{exam?.testName}</h1>
        <div
          className={`bg-gradient-to-br px-3 rounded-xl text-xs py-2 ${renderBgColorStatus(
            exam?.testApprovalStatus ?? 0
          )}`}
        >
          <p className={`font-bold uppercase text-white`}>
            {
              pendingExamEnum[
                exam?.testApprovalStatus as keyof typeof pendingExamEnum
              ]
            }
          </p>
        </div>
        {exam?.testApprovalStatus === 0 && (
          <div
            className="bg-blue-600 ml-auto text-white text-sm px-3 py-2 rounded-lg font-bold cursor-pointer"
            onClick={() => handleConfirm()}
          >
            Chuyển sang chờ duyệt
          </div>
        )}
        {exam?.testApprovalStatus === 3 && (
          <div
            className="bg-blue-600 ml-auto text-white text-sm px-3 py-2 rounded-lg font-bold cursor-pointer"
            onClick={() => handleConfirmDraft()}
          >
            Chuyển sang bản nháp
          </div>
        )}
      </div>
      <Tabs
        defaultActiveKey={tab[0].value.toString()}
        items={tab.map((item) => ({
          key: item.value.toString(),
          label: item.label,
          children: item.children,
        }))}
      />
    </div>
  );
};

export default ExamDetail;
