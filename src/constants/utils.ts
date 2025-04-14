import katex from "katex";
import "katex/dist/katex.min.css";

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
