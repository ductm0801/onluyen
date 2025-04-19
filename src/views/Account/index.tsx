"use client";
import Paging from "@/components/Paging";
import { userRoleEnum } from "@/constants/enum";
import { IMAGES } from "@/constants/images";
import { IAccount } from "@/models";
import { useLoading } from "@/providers/loadingProvider";
import { getUser, updateUserStatus } from "@/services";
import { Modal } from "antd";
import { useRouter } from "next/navigation";
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
  // {
  //   name: "Địa chỉ",
  //   className:
  //     "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white",
  // },
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
  const router = useRouter();

  const openConfirm = (id: string) => {
    setConfirm(true);
    setUserId(id);
  };

  const fetchAccount = async () => {
    try {
      setLoading(true);
      const res = await getUser(currentPage, 5);
      if (res) setAccount(res.data.items);
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
  }, [currentPage]);

  const onConfirm = async (
    items: IAccount,
    reasonValue: string,
    status: string
  ) => {
    try {
      setLoading(true);
      await updateUserStatus(items.userId, reasonValue, status);
      toast.success("Cập nhật trạng thái thành công!");
      setConfirm(false);
      fetchAccount();
    } catch (error) {
      setLoading(false);
      toast.error("Cập nhật trạng thái thất bại!");
      console.error(error);
    }
  };
  const handleConfirm = (items: IAccount, status: string) => {
    let reasonValue = "";

    Modal.confirm({
      title: "Nhập lý do",
      content: (
        <textarea
          className="border border-gray-300 rounded-lg p-2 w-full mt-2"
          placeholder="Nhập lý do"
          onChange={(e) => {
            reasonValue = e.target.value;
          }}
        />
      ),
      onOk: () => {
        if (!reasonValue.trim()) {
          toast.error("Vui lòng nhập lý do!");
          return Promise.reject();
        }
        return onConfirm(items, reasonValue, status);
      },
    });
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
                  className="flex group cursor-pointer items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  onClick={() => router.push(`/admin/account/${a.userId}`)}
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={a.imageUrl || IMAGES.defaultMale}
                    alt="avatar"
                  />
                  <div className="ps-3">
                    <div className="text-base group-hover:underline group-hover:text-blue-500  font-semibold">
                      {a.fullName}
                    </div>
                    <div className="font-normal text-gray-500">{a.email}</div>
                  </div>
                </th>
                <td className="px-6 py-4">{userRoleEnum[a.role]}</td>
                {/* <td className="px-6 py-4">{a.phoneNumber}</td> */}
                <td className="px-6 py-4">
                  {a.status ? (
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>{" "}
                      Tạm ngưng
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>{" "}
                      Đang hoạt động
                    </div>
                  )}
                </td>
                {/* <td className="px-6 py-4">{a.address}</td> */}
                <td className="px-6 py-4">
                  {a.status ? (
                    <div
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                      onClick={() => handleConfirm(a, "Active")}
                    >
                      Hiện người dùng
                    </div>
                  ) : (
                    <div
                      className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer ms-3"
                      onClick={() => handleConfirm(a, "Inactive")}
                    >
                      Ẩn người dùng
                    </div>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Paging
        pageSize={5}
        currentPage={currentPage}
        totalItems={totalItems}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Account;
