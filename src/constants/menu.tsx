import { IMAGES } from "./images";

export const menus: Record<
  "Admin" | "Student" | "Instructor" | "ExamManager",
  { label: string; path: string; icon: string; isShow: boolean }[]
> = {
  Admin: [
    {
      label: "Thống kê",
      path: "/admin/dashboard",
      icon: IMAGES.statsitcIcon,
      isShow: true,
    },
    {
      label: "Tài khoản",
      path: "/admin/account",
      icon: IMAGES.account,
      isShow: true,
    },
    {
      label: "Môn học",
      path: "/admin/courses",
      icon: IMAGES.courseIcon,
      isShow: true,
    },
  ],
  Student: [
    {
      label: "Trang chủ",
      icon: IMAGES.house,
      path: "/student/home",
      isShow: true,
    },
    {
      label: "Kiểm tra",
      icon: IMAGES.school,
      path: "/student/exam",
      isShow: false,
    },
    {
      label: "Lịch sử giao dịch",
      icon: IMAGES.book,
      path: "/student/transaction-history",
      isShow: true,
    },
    {
      label: "Mã thi của tôi",
      icon: IMAGES.examCode,
      path: "/student/exam-code",
      isShow: true,
    },
    {
      label: "Kết quả",
      icon: IMAGES.examCode,
      path: "/student/result-detail/",
      isShow: false,
    },
  ],
  Instructor: [
    {
      label: "Bộ Câu hỏi",
      path: "/instructor/question",
      icon: IMAGES.questionIcon,
      isShow: true,
    },
    {
      label: "Đề kiểm tra",
      path: "/instructor/exam",
      icon: IMAGES.examIcon,
      isShow: true,
    },
    {
      label: "Khoá học",
      path: "/instructor/course",
      icon: IMAGES.courseIcon,
      isShow: true,
    },
  ],
  ExamManager: [
    {
      label: "Kì thi",
      path: "/exammanager/exam",
      icon: IMAGES.examList,
      isShow: true,
    },
    {
      label: "Ngân hàng đề",
      path: "/exammanager/testBank",
      icon: IMAGES.questionIcon,
      isShow: true,
    },
    {
      label: "Đề Chờ duyệt",
      path: "/exammanager/pending-test",
      icon: IMAGES.pendingExam,
      isShow: true,
    },
  ],
};
