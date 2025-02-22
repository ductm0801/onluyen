"use client";
import Paging from "@/components/Paging";
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
  {
    name: "Số điện thoại",
    className:
      "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  },
  {
    name: "Email",
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
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
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
              <tr className="bg-white dark:bg-gray-800" key={idx}>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {a.fullName}
                </th>
                <td className="px-6 py-4">{a.role}</td>
                <td className="px-6 py-4">{a.phoneNumber}</td>
                <td className="px-6 py-4">{a.email}</td>
                <td className="px-6 py-4">{a.address}</td>
                <td className="flex items-center px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                  >
                    Sửa
                  </a>
                  <div
                    className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer ms-3"
                    // onClick={() => openConfirm(a.id)}
                  >
                    Xoá
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
