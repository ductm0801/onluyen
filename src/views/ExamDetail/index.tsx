"use client";
import { IExam } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getExamDetail, updateTestStatus } from "@/services";
import { Form, Input, Select, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import FormUpdateInfo from "./FormUpdateInfo";
import FormUpdateExam from "./FormUpdateExam";
const testStatus = [
  { label: "Bản Nháp", value: 0 },
  { label: "Chờ duyệt", value: 1 },
  { label: "Đã Duyệt", value: 2 },
  { label: "Từ chối", value: 3 },
];

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
  const onChangeStatus = async (status: any) => {
    try {
      setLoading(true);
      const res = await updateTestStatus({ status: status }, params.id);
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

  //   const renderTab = () => {};
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold">{exam?.testName}</h1>
        <Select
          options={testStatus}
          value={exam?.testApprovalStatus}
          onChange={(value) => onChangeStatus(value)}
        />
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
