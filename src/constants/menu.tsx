import { IMAGES } from "./images";

export const menus: Record<
  "Admin" | "student" | "instructor",
  { label: string; path: string; icon: string }[]
> = {
  Admin: [
    { label: "Thống kê", path: "/admin/dashboard", icon: IMAGES.statsitcIcon },
    { label: "Tài khoản", path: "/admin/account", icon: IMAGES.account },
    { label: "Môn học", path: "/admin/courses", icon: IMAGES.courseIcon },
  ],
  student: [
    { label: "Trang chủ", icon: IMAGES.house, path: "/" },
    { label: "Lớp học trực tuyến", icon: IMAGES.school, path: "/calendar" },
    { label: "Tự học", icon: IMAGES.book, path: "" },
    { label: "Ôn luyện plus", icon: IMAGES.earth, path: "/question" },
  ],
  instructor: [
    {
      label: "Câu hỏi",
      path: "/investor/management",
      icon: IMAGES.questionIcon,
    },
    { label: "Đề kiểm tra", path: "/investor/projects", icon: IMAGES.examIcon },
  ],
};
