import { IExam } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getExamDetail, reviewreviewTestStatus } from "@/services";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type props = {
  onClose: () => void;
  data: IExam;
  fetchExamByBankId: () => Promise<void>;
  isReview?: boolean;
};

const ModaReviewTest: React.FC<props> = ({
  onClose,
  data,
  fetchExamByBankId,
  isReview = true,
}) => {
  const [examData, setExamData] = useState<IExam>();
  const { setLoading } = useLoading();
  const [pageSize, setPageSize] = useState(100);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const fetchExam = async () => {
    try {
      setLoading(true);
      const res = await getExamDetail(data.id, currentPage, pageSize);
      setExamData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExam();
  }, [data]);

  const handleUpdate = async (status: number) => {
    try {
      setLoading(true);
      await reviewreviewTestStatus({ status: status }, data.id);
      toast.success("Cập nhật thành công");
      onClose();
      fetchExamByBankId();
    } catch (error: any) {
      setLoading(false);

      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  if (!examData) return;
  return (
    <div
      id="crud-modal"
      tabIndex={-1}
      aria-hidden="true"
      className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black/70"
    >
      <div className="relative p-4 w-full max-w-lg max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chi tiết đề kiểm tra
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="crud-modal"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4">
            <p className="text-lg font-semibold">{examData.testName}</p>
            {/* <p className="text-sm text-gray-600">Người tạo: {examData.creator}</p> */}
            {/* <p className="text-sm text-gray-600">
            Ngày tạo: {new Date(examData.).toLocaleDateString()}
          </p> */}
            <hr className="my-4" />
            <p className="font-medium">Mô tả:</p>
            <p className="text-gray-700 mb-4">{examData.description}</p>
            <hr className="my-4" />

            <div className="overflow-y-auto max-h-[300px]">
              <p className="font-medium">Danh sách câu hỏi:</p>

              <ul className="text-gray-700 flex flex-col gap-2">
                {examData.questions?.map((question, index) => (
                  <li key={index} className="text-sm">
                    {index + 1}. {question.title}
                    <ul className="list-inside list-disc">
                      {question.answers?.map((answer, index) => (
                        <li
                          key={index}
                          className={`${
                            answer.isCorrect
                              ? "text-green-500"
                              : "text-gray-600"
                          }  `}
                        >
                          {answer.content}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-600">
                      {question.answerText}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            {isReview && (
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  onClick={() => handleUpdate(3)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Từ chối
                </button>
                <button
                  onClick={() => handleUpdate(2)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Duyệt
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModaReviewTest;
