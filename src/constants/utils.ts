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
