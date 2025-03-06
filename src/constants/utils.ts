import { statusEnum } from "./enum";

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
