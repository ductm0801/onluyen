import katex from "katex";
import "katex/dist/katex.min.css";
import dayjs from "dayjs";

export const renderMathContent = (text: string): string => {
  if (!text) return "";

  return text.replace(/\$(.+?)\$/g, (_, formula) => {
    try {
      return katex.renderToString(formula, {
        throwOnError: false,
        displayMode: false,
      });
    } catch (e) {
      return formula;
    }
  });
};

export const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      reject("Không thể đọc metadata của video");
    };

    video.src = URL.createObjectURL(file);
  });
};
export const formatDuration = (duration: string) => {
  const [hours, minutes, seconds] = duration.split(":").map(Number);

  let result = "";
  if (hours) result += `${hours} tiếng`;
  if (minutes) result += ` ${minutes} phút`;

  return result.trim();
};

export const getCurrentWeekRange = () => {
  const today = dayjs();
  const startOfWeek = today.startOf("week").add(1, "day");
  const endOfWeek = startOfWeek.add(6, "day");
  return {
    startDate: startOfWeek.format("YYYY-MM-DD"),
    endDate: endOfWeek.format("YYYY-MM-DD"),
  };
};
export const parseGvizDate = (dateStr: string): string => {
  const match = dateStr.match(/Date\((\d+),(\d+),(\d+)\)/);
  if (!match) return dateStr;

  const [_, year, month, day] = match.map(Number);
  const d = new Date(year, month, day);

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
};
