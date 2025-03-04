"use client";
import Paging from "@/components/Paging";
import { IMAGES } from "@/constants/images";
import { IAccount } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getUser, updateUserStatus } from "@/services";
import React, { use, useEffect, useState } from "react";
import { toast } from "react-toastify";

const cols = [
  {
    name: "Người dùng",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-s-lg",
  },
  {
    name: "Vai trò",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  // {
  //   name: "Số điện thoại",
  //   className:
  //     "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  // },
  {
    name: "Trạng thái",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Địa chỉ",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Hành động",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white rounded-e-lg",
  },
];

const Account = () => {
  const [account, setAccount] = useState<IAccount[]>([]);
  const [pageSize, setPageSize] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [confirm, setConfirm] = useState(false);
  const [userId, setUserId] = useState("");
  const { setLoading } = useLoading();

  const openConfirm = (id: string) => {
    setConfirm(true);
    setUserId(id);
  };

  const fetchAccount = async () => {
    try {
      setLoading(true);
      const res = await getUser();
      if (res) setAccount(res.data.items);
      setPageSize(res.data.pageSize);
      setCurrentPage(res.data.pageIndex);
      setTotalItems(res.data.totalItemsCount);
      setTotalPages(res.data.totalPageCount);
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAccount();
  }, []);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await updateUserStatus(userId);
      toast.success("Cập nhật trạng thái thành công!");
      setConfirm(false);
      fetchAccount();
    } catch (error) {
      setLoading(false);
      toast.error("Cập nhật trạng thái thất bại!");
      console.error(error);
    }
  };
  return (
    <div className="relative overflow-x-auto">
      <div className="flex justify-end  items-center  flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
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
          {account &&
            account.map((a, idx) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={idx}
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={a.imageUrl || IMAGES.defaultMale}
                    alt="avatar"
                  />
                  <div className="ps-3">
                    <div className="text-base font-semibold">{a.fullName}</div>
                    <div className="font-normal text-gray-500">{a.email}</div>
                  </div>
                </th>
                <td className="px-6 py-4">{a.role}</td>
                {/* <td className="px-6 py-4">{a.phoneNumber}</td> */}
                <td className="px-6 py-4">
                  {a.isDelete ? (
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>{" "}
                      Tạm ngưng
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>{" "}
                      Đang hoạt độngđộng
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">{a.address}</td>
                <td className="px-6 py-4">
                  {/* <div className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
                    Sửa
                  </div> */}
                  <div
                    className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer ms-3"
                    // onClick={() => openConfirm(a.id)}
                  >
                    Ẩn người dùng
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
      {confirm && (
        <div className="fixed z-50 inset-0 bg-black/50 ">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div className="inline-block bg-white rounded-lg px-8 py-6 shadow-md text-left w-[350px]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg text-black font-bold">Xác nhận xoá</h3>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Bạn có chắc muốn xoá tài khoản này?
              </p>
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500"
                  onClick={() => setConfirm(false)}
                >
                  Hủy
                </button>
                <button
                  className="ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500"
                  onClick={() => {
                    onConfirm();
                  }}
                >
                  Xoá
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
