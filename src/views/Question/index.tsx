"use client";
import Paging from "@/components/Paging";
import { difficultyEnum, questionEnum } from "@/constants/enum";
import { IQuestion, IQuestionBank } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getQuestionBank } from "@/services";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import QuestionDetail from "./Detail";
import { Select } from "antd";
const cols = [
  {
    name: "Tên bộ câu hỏi",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Môn học",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Mô tả",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  // {
  //   name: "Loại",
  //   className:
  //     "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  // },
  //   {
  //     name: "Ngày tạo",
  //     className:
  //       "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  //   },
  {
    name: "Hành động",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-e-lg",
  },
];

const Question = () => {
  const [question, setQuestion] = useState<IQuestionBank[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { setLoading } = useLoading();
  const router = useRouter();

  // const [detail, setDetail] = useState(false);
  const [create, setCreate] = useState(false);
  // const qDetail = useRef<IQuestion | null>(null);
  // const handleOpenDetail = (item: IQuestion) => {
  //   setDetail(true);
  //   qDetail.current = item;
  // };
  // const handleCloseDetail = () => {
  //   setDetail(false);
  //   qDetail.current = null;
  // };
  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const res = await getQuestionBank();
      if (res) {
        setQuestion(res.data);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQuestion();
  }, [currentPage]);

  return (
    <>
      <div className="relative overflow-x-auto">
        <div className="flex justify-between  items-center  flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
          <div
            className="bg-[#ffc022] rounded-lg px-3 py-2 cursor-pointer"
            onClick={() => setCreate(true)}
          >
            Tạo bộ câu hỏi
          </div>
          <div>
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
            {question &&
              question.map((a, idx) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  key={idx}
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="text-base font-semibold">
                      {a.questionBankName}
                    </div>
                  </th>
                  <td className="px-6 py-4">{a.subjectName}</td>
                  <td className="px-6 py-4 line-clamp-1">{a.description}</td>
                  {/* <td className="px-6 py-4">{questionEnum[a.type]}</td> */}
                  <td className="px-6 py-4">
                    <div
                      className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer ms-3"
                      onClick={() =>
                        router.push(`/instructor/question/${a.id}`)
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
      {/* {detail && (
        <QuestionDetail
          data={qDetail.current}
          open={detail}
          handleClose={handleCloseDetail}
        />
      )} */}
    </>
  );
};

export default Question;
