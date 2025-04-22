"use client";
import Paging from "@/components/Paging";
import { consultEnum } from "@/constants/enum";
import { useAuth } from "@/providers/authProvider";
import { useLoading } from "@/providers/loadingProvider";
import { getConsultRequest } from "@/services";
import { Select } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const renderBgColorStatus = (status: keyof typeof consultEnum) => {
  switch (status) {
    case 1:
      return "from-orange-600 to-orange-300";
    case 2:
      return "from-red-600 to-red-400";
    case 3:
      return "from-emerald-600 to-teal-400";
    case 0:
      return "from-slate-600 to-slate-300";
    default:
      return "from-emerald-500 to-teal-400";
  }
};
const statusOptions = [
  {
    value: 0,
    label: "Chờ duyệt",
  },
  {
    value: 1,
    label: "Đang xử lí",
  },
  {
    value: 2,
    label: "Từ chối",
  },
  {
    value: 3,
    label: "Hoàn thành",
  },
];

const cols = [
  {
    name: "Người yêu cầu",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Trạng thái",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center",
  },
  {
    name: "Ngày tạo",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center",
  },
  {
    name: "Hành động",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center",
  },
];

const ConsultRequest = () => {
  const { setLoading } = useLoading();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [consultData, setConsultData] = useState<any[]>([]);
  const router = useRouter();
  const { user } = useAuth();
  const fetchConsultRequest = async () => {
    try {
      setLoading(true);
      const res = await getConsultRequest(currentPage, pageSize, status);
      if (res) {
        setConsultData(res.data.items);
        setTotalItems(res.data.totalItemsCount);
        setTotalPages(res.data.totalPageCount);
      }
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchConsultRequest();
  }, [currentPage, status]);
  return (
    <div className="relative overflow-x-auto">
      <div className="flex justify-between  items-center  flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        <Select
          options={statusOptions}
          value={status}
          allowClear
          className="w-[200px] text-sm"
          placeholder="Trạng thái"
          onChange={(value) => setStatus(value)}
        />
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {cols.map((col, idx) => (
              <th scope="col" className={col.className} key={idx}>
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {consultData &&
            consultData.map((a, idx) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={idx}
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div className="text-base font-semibold flex items-start gap-3">
                    {a.studentName}
                  </div>
                </th>

                <td
                  className={`p-2 text-sm leading-normal text-center align-middle shadow-transparent`}
                >
                  <span
                    className={`px-2 text-sm rounded-lg py-1 font-bold text-white bg-gradient-to-tl ${renderBgColorStatus(
                      a.status
                    )}`}
                  >
                    {consultEnum[a.status as keyof typeof consultEnum]}
                  </span>
                </td>
                <td className="px-6 py-4 ">
                  <div className="flex flex-col items-center">
                    <p>{dayjs(a.creationDate).format("DD/MM/YYYY")}</p>
                    <p className="text-xs">
                      {dayjs(a.creationDate).format("HH:mm:ss")}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 flex justify-center items-center">
                  <div
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                    onClick={() =>
                      router.push(
                        user?.Role === "Consultant"
                          ? `/consultant/consult-request/${a.id}`
                          : `/student/consult-request/${a.id}`
                      )
                    }
                  >
                    Chi tiết
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Paging
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ConsultRequest;
