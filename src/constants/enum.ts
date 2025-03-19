export const difficultyEnum = {
  0: "Cơ bản",
  1: "Trung Bình",
  2: "Nâng Cao",
  3: "Chuyên gia",
  4: "Học thuật",
};
export const questionEnum = {
  0: "Chọn một",
  1: "Chọn nhiều",
  2: "Tự Luận",
};
export const examEnum = {
  0: "Trắc nghiệm",
  1: "Tự luận",
  2: "Tổng hợp",
};

export const statusEnum = {
  0: "Hoạt động",
  1: "Tạm ngưng",
  2: "Chờ duyệt",
  3: "Thành công",
  4: "Thất bại",
};
export const pendingExamEnum = {
  0: "Bản Nháp",
  1: "Chờ duyệt",
  2: "Đã Duyệt ",
  3: "Từ chối ",
};
export const courseStatusEnum = {
  0: "Bản nháp",
};

export const renderBgColorStatus = (status: keyof typeof statusEnum) => {
  switch (status) {
    case 2:
      return "from-orange-600 to-orange-300";
    case 3:
      return "from-emerald-600 to-emerald-400";
    case 4:
      return "from-red-600 to-red-300";
    case 0:
      return "from-emerald-600 to-teal-400";
    case 1:
      return "from-slate-600 to-slate-300";
    default:
      return "from-emerald-500 to-teal-400";
  }
};

export const renderColorStatus = (status: keyof typeof statusEnum) => {
  switch (status) {
    case 0:
      return "text-green-500";
    case 1:
      return "text-red-500";
    case 2:
      return "text-[#d3c718]";
    case 3:
      return "text-green-500";
    case 4:
      return "text-red-500";
    default:
      return "text-[#d3c718]";
  }
};
export const examResultEnum = {
  1: "Chưa đạt",
  0: "Đạt",
};
