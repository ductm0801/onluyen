"use client";
import { statusEnum, userRoleEnumNormalize } from "@/constants/enum";
import { User } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getUserDetail, updateInstructorRate } from "@/services";
import { Avatar, Button, Form, Modal, Select, Tooltip } from "antd";
import moment from "moment";
import { useParams } from "next/navigation";
import React, { act, useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const tab = [
  { key: "infor", value: "Thông tin" },
  { key: "bank", value: "Tài khoản ngân hàng" },
];
const rateOptions = [
  { label: "0.7", value: 0.7 },
  { label: "0.8", value: 0.8 },
  { label: "0.9", value: 0.9 },
];
export const renderBgColorStatus = (status: keyof typeof statusEnum) => {
  switch (status) {
    case 1:
      return "from-orange-600 to-orange-300";
    case 2:
      return "from-orange-600 to-orange-300";
    case 4:
      return "from-red-600 to-red-300";
    case 3:
      return "from-emerald-600 to-emerald-400";
    case 0:
      return "from-slate-600 to-slate-300";
    default:
      return "from-emerald-500 to-teal-400";
  }
};

const AccountDetail = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const { setLoading } = useLoading();
  const [activeTabs, setActiveTabs] = useState("infor");
  const params = useParams();
  const [edit, setEdit] = useState(false);
  const [form] = Form.useForm();
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await getUserDetail(params.id);
      setUser(res.data);
    } catch (e: any) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [params.id]);

  const handleTabChange = (key: string) => {
    setActiveTabs(key);
  };
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await updateInstructorRate(params.id, values.rate);
      toast.success("Cập nhật thành công");
      setEdit(false);
      fetchUser();
    } catch (e: any) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const handleRenderTab = () => {
    switch (activeTabs) {
      case "infor":
        return (
          <div className="flex items-stretch  gap-4">
            <div className="w-full md:w-[35%] bg-white rounded-xl border border-gray-400 border-solid shadow-xl px-4 py-4 pt-3 flex flex-col gap-2 text-lg">
              <p className="text-xl font-bold mb-2 pb-3 border-b border-gray-300">
                Thông Tin Cá Nhân
              </p>
              <div className="flex flex-row flex-wrap items-center gap-2">
                <p className="font-bold text-lg m-0 min-w-[140px]">Email:</p>
                <p className="font-semibold text-lg m-0">
                  {user?.user.email || "\u2014"}
                </p>
              </div>
              <div className="flex flex-row flex-wrap items-center gap-2">
                <p className="font-bold text-lg m-0 min-w-[140px]">
                  Họ và tên:
                </p>
                <p className="font-semibold text-lg m-0">
                  {user?.user.fullName || "\u2014"}
                </p>
              </div>
              <div className="flex flex-row flex-wrap items-center gap-2">
                <p className="font-bold text-lg m-0 min-w-[140px]">
                  Số điện thoại:
                </p>
                <p className="font-semibold text-lg m-0">
                  {user?.user.phoneNumber || "\u2014"}
                </p>
              </div>

              <div className="flex flex-row flex-wrap items-center gap-2">
                <p className="font-bold text-lg m-0 min-w-[140px]">
                  Ngày sinh:
                </p>
                <p className="font-semibold text-lg m-0">
                  {moment(user?.user.dateOfBirth).format("DD-MM-YYYY") ||
                    "-/-/-"}
                </p>
              </div>
              <div className="flex flex-row flex-wrap items-center gap-2">
                <p className="font-bold text-lg m-0 min-w-[140px]">
                  Giới tính:
                </p>
                <p className="font-semibold text-lg m-0">
                  {user?.user.gender
                    ? user.user.gender === "Male"
                      ? "Nam"
                      : "Nữ"
                    : "\u2014"}
                </p>
              </div>
              <div className="flex flex-row flex-wrap items-center gap-2">
                <p className="font-bold text-lg m-0 min-w-[140px]">
                  Trạng thái:
                </p>
                <div
                  className={`text-sm leading-normal text-center align-middle bg-transparent whitespace-nowrap shadow-transparent ${renderBgColorStatus(
                    user?.user.status as keyof typeof statusEnum
                  )}`}
                >
                  <span
                    className={`bg-gradient-to-tl ${renderBgColorStatus(
                      user?.user.status as keyof typeof statusEnum
                    )} px-3 text-sm rounded-xl py-1.5 inline-block whitespace-nowrap text-center align-baseline font-semibold leading-none text-white`}
                  >
                    {statusEnum[user?.user.status as keyof typeof statusEnum]}
                  </span>
                </div>
              </div>

              <div className="flex flex-row flex-wrap items-center gap-x-2">
                <div className="font-bold text-lg m-0 min-w-[140px]">
                  Địa chỉ:{" "}
                </div>
                <div className="whitespace-break-words overflow-hidden text-lg font-semibold overflow-ellipsis">
                  {user?.address &&
                  (user?.address?.at(1) || user?.address?.at(0))
                    ? `${user?.address?.at(1) || ""} ${
                        user?.address?.at(0) || ""
                      }`?.trim()
                    : "\u2014"}
                </div>
              </div>
            </div>
            <div className="w-full md:w-[35%] bg-white rounded-xl border border-gray-400 border-solid shadow-xl px-4 py-4 pt-3 flex flex-col gap-2 text-lg">
              <p className="text-xl font-bold mb-2 pb-3 border-b border-gray-300">
                Thông Tin liên quan
              </p>
              <div className="flex flex-row flex-wrap items-center gap-2">
                <p className="font-bold text-lg m-0 min-w-[140px]">
                  Số năm kinh nghiệm:
                </p>
                <p className="font-semibold text-lg m-0">
                  {user?.instructor.yearOfExperience || "\u2014"}
                </p>
              </div>
              <div className="flex flex-row flex-wrap items-center gap-2">
                <p className="font-bold text-lg m-0 min-w-[140px]">Dạy môn</p>
                <p className="font-semibold text-lg m-0">
                  {user?.subject.subjectName || "\u2014"}
                </p>
              </div>
              <div className="flex flex-row flex-wrap items-center gap-2">
                <p className="font-bold text-lg m-0 min-w-[140px]">Hoa hồng:</p>
                <p className="font-semibold text-lg m-0 flex items-center gap-2">
                  {user?.instructor.commissionRate || "\u2014"}{" "}
                  <Tooltip title="Chỉnh sửa hoa hồng">
                    <div
                      className="bg-blue-500 w-8 text-center py-1 cursor-pointer aspect-square rounded-xl text-white"
                      onClick={() => setEdit(true)}
                    >
                      <EditOutlined />
                    </div>
                  </Tooltip>
                </p>
              </div>
            </div>
          </div>
        );
      case "bank":
        return "ngân hàng";
      default:
        return null;
    }
  };
  if (!user) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-400 border-solid shadow-xl w-full flex flex-col justify-start">
      <div className="w-full flex flex-col justify-start px-4 py-4">
        <div className="relative">
          <Avatar className="border-2 border-white text-3xl font-bold w-[172px] h-[172px] object-cover">
            {user?.user.fullName?.charAt(0)?.toUpperCase() ||
              user?.user.imageUrl}
          </Avatar>
        </div>
        <div className="w-full flex flex-col items-start px-2">
          <h6 className="font-bold text-2xl mb-1">
            {user?.user.fullName || "\u2014"}
          </h6>
          <div className="flex flex-row gap-2">
            <h6 className="font-semibold mb-0 text-lg">
              Vai trò:{" "}
              {userRoleEnumNormalize[
                Object.keys(user || "")[1] as keyof typeof userRoleEnumNormalize
              ] || "\u2014"}
            </h6>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row flex-wrap border-t border-gray-200 px-2">
        {tab.map((i, ixd) => (
          <div
            role="button"
            className="cursor-pointer"
            onClick={() => handleTabChange(i.key)}
            key={ixd}
          >
            <p
              className={`m-0 py-2.5 px-3 pb-2 font-bold inline-block rounded-t-xl text-base ${
                activeTabs === i.key &&
                "border-b-2 text-blue-700 border-blue-700 hover:border-blue-700"
              }`}
            >
              {i.value}
            </p>
          </div>
        ))}
      </div>
      <div className="p-4">{handleRenderTab()}</div>
      {edit && (
        <Modal
          open={edit}
          onCancel={() => setEdit(false)}
          title="Cập nhật hoa hồng"
          footer={null}
        >
          <Form
            form={form}
            onFinish={onFinish}
            initialValues={{ rate: user.instructor.commissionRate }}
          >
            <Form.Item name="rate" label="Mức hoa hồng" labelCol={{ span: 24 }}>
              <Select options={rateOptions} />
            </Form.Item>
            <Form.Item>
              <div className="flex items-center justify-end">
                <Button htmlType="submit" type="primary">
                  Xác nhận
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default AccountDetail;
