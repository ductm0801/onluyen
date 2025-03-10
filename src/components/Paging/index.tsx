import React from "react";
type props = {
  pageSize: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

const Paging: React.FC<props> = ({
  pageSize,
  currentPage,
  totalItems,
  totalPages,
  setCurrentPage,
}) => {
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems);
  return (
    <nav
      className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
      aria-label="Table navigation"
    >
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
        Hiển thị
        <span className="font-semibold text-gray-900 dark:text-white">
          {" "}
          {startItem}-{endItem}
        </span>{" "}
        kết quả từ{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalItems}
        </span>
      </span>

      <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
        <li>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg 
    ${
      currentPage === 0
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-gray-100 hover:text-gray-700"
    } dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
          >
            Trang trước
          </button>
        </li>

        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index}>
            <button
              onClick={() => setCurrentPage(index)}
              className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 
      ${
        currentPage === index
          ? "!text-blue-600 !border-blue-300 !bg-blue-50"
          : "hover:bg-gray-100 hover:text-gray-700"
      } dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
            >
              {index + 1}
            </button>
          </li>
        ))}

        <li>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage >= totalPages - 1}
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg 
    ${
      currentPage >= totalPages - 1
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-gray-100 hover:text-gray-700"
    } dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
          >
            Trang sau
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Paging;
