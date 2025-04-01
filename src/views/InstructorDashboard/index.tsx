"use client";
import { useAuth } from "@/providers/authProvider";
import React from "react";

const InstructorDashboard = () => {
  const { user } = useAuth();
  console.log(user);
  return (
    <div>
      <div className="flex gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            Tổng số dư{" "}
            {user?.instructor?.availableBalance.toLocaleString("vi-VN")}đ
          </h4>
          <div className="flex items-end justify-between mt-4 sm:mt-5">
            <div>
              <p className="text-gray-700 text-theme-sm dark:text-gray-400">
                Tăng
              </p>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
                20%
              </span>
              <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                so với tháng trươcs
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
