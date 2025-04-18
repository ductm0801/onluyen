"use client";
import ModaReviewTest from "@/components/ModalReviewExam";
import Paging from "@/components/Paging";
import { examEnum, pendingExamEnum } from "@/constants/enum";
import { IExam } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getExamPending, updateTestStatus } from "@/services";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
const cols = [
  {
    name: "Tên",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Miêu tả",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Môn học",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Trạng thái",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Hành động",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-e-lg",
  },
];

const PendingTest = () => {
  const [exam, setExam] = useState<IExam[]>([]);
  const [pageSize, setPageSize] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [open, setOpen] = useState(false);
  const { setLoading } = useLoading();
  const detail = useRef<IExam>();

  const handleOpen = (item: IExam) => {
    setOpen(true);
    detail.current = item;
  };
  const handleClose = () => {
    setOpen(false);
    detail.current = undefined;
  };

  const fetchExamByBankId = async () => {
    try {
      setLoading(true);
      const res = await getExamPending(currentPage, pageSize);
      setExam(res.data.items);
      setPageSize(res.data.pageSize);
      setTotalItems(res.data.totalItemsCount);
      setTotalPages(res.data.totalPageCount);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExamByBankId();
  }, []);

  return (
    <div className="relative overflow-x-auto">
      <div className="flex justify-between  items-center  flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
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
                    {/* <img
                className="w-10 h-10 rounded-full"
                src={a.imageUrl || IMAGES.defaultMale}
                alt="avatar"
              /> */}

                    <div className="text-base font-semibold">{a.testName}</div>
                  </th>
                  <td className="px-6 py-4">{a.description}</td>
                  <td className="px-6 py-4">{a.subjectName}</td>
                  {/* <td className="px-6 py-4">{examEnum[a.testType]}</td> */}
                  <td className="px-6 py-4">
                    {pendingExamEnum[a.testApprovalStatus]}
                  </td>

                  <td className="px-6 py-4 flex items-center">
                    <div
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                      onClick={() => handleOpen(a)}
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
      {open && detail.current && (
        <ModaReviewTest
          onClose={handleClose}
          data={detail.current}
          fetchExamByBankId={fetchExamByBankId}
        />
      )}
    </div>
  );
};

export default PendingTest;
