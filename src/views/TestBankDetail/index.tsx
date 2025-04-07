"use client";
import ModaReviewTest from "@/components/ModalReviewExam";
import Paging from "@/components/Paging";
import { IExam } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getExamByTestBank, revokeTest } from "@/services";
import { Modal } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
const cols = [
  {
    name: "Tiêu đề",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Thời lượng",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },

  {
    name: "Mô tả",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },

  {
    name: "Tổng Điểm",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },

  {
    name: "Hành động",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-e-lg",
  },
];

const TestBankDetail = () => {
  const [exam, setExam] = useState<IExam[]>([]);
  const { setLoading } = useLoading();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const params = useParams();

  // const [create, setCreate] = useState(false);
  const [detail, setDetail] = useState(false);

  const examDetail = useRef<IExam | null>(null);
  // const [confirm, setConfirm] = useState(false);
  // const [examId, setExamId] = useState("");
  const fetchExam = async () => {
    try {
      setLoading(true);
      const res = await getExamByTestBank(params.id, currentPage, pageSize);
      if (res) setExam(res.data.items);
      setTotalItems(res.data.totalItemsCount);
      setTotalPages(res.data.totalPageCount);
    } catch (err: any) {
      setLoading(false);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExam();
  }, [currentPage]);
  const handleOpenDetail = async (items: IExam) => {
    setDetail(true);
    examDetail.current = items;
  };
  const handleCloseDetail = () => {
    setDetail(false);
    examDetail.current = null;
  };
  const handleConfirmRevoke = (items: IExam) => {
    let reasonValue = "";

    Modal.confirm({
      title: "Nhập lý do thu hồi",
      content: (
        <textarea
          className="border border-gray-300 rounded-lg p-2 w-full mt-2"
          placeholder="Nhập lý do thu hồi"
          onChange={(e) => {
            reasonValue = e.target.value;
          }}
        />
      ),
      onOk: () => {
        if (!reasonValue.trim()) {
          toast.error("Vui lòng nhập lý do thu hồi!");
          return Promise.reject(); // ngăn đóng modal nếu chưa nhập
        }
        return handleRevolkTest(items, reasonValue);
      },
    });
  };

  const handleRevolkTest = async (items: IExam, reason: string) => {
    setLoading(true);
    try {
      const res = await revokeTest(items.id, reason);
      if (res) toast.success(res.message);
      fetchExam();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-x-auto">
      <div className="flex justify-between items-center  flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        {/* <div
          className="bg-[#ffc022] rounded-lg px-3 py-2 cursor-pointer"
          // onClick={() => setCreate(true)}
        >
          Tạo đề mới
        </div> */}
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search-users"
            className="block p-2 ps-10 text-sm focus:ring-0 focus:outline-none text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
            placeholder="Tìm kiếm"
          />
        </div>
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
          {exam &&
            exam
              .filter((a) => !a.isDeleted)
              .map((a, idx) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  key={idx}
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="text-base font-semibold">{a.testName}</div>
                  </th>
                  <td className="px-6 py-4">{a.length} phút</td>

                  <td className="px-6 py-4">{a.description}</td>
                  <td className="px-6 py-4">{a.totalGrade}</td>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div
                      className="font-medium whitespace-nowrap text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                      onClick={() => handleConfirmRevoke(a)}
                    >
                      Thu hồi
                    </div>
                    <div
                      className="font-medium whitespace-nowrap text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                      onClick={() => handleOpenDetail(a)}
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
      {detail && examDetail.current && (
        <ModaReviewTest
          onClose={handleCloseDetail}
          data={examDetail.current}
          fetchExamByBankId={fetchExam}
          isReview={false}
        />
      )}
    </div>
  );
};

export default TestBankDetail;
