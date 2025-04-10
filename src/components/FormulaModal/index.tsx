"use client";
import React, { useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

export const formulaTemplatesBySubject = {
  Toán: [
    { name: "Phân số", latex: "\\frac{a}{b}" },
    { name: "Căn bậc hai", latex: "\\sqrt{a}" },
    { name: "Bình phương", latex: "x^2" },
    { name: "Tổng sigma", latex: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2}" },
    { name: "Tích phân", latex: "\\int_{a}^{b} x^2 \\,dx" },
    { name: "Đạo hàm", latex: "\\frac{d}{dx}x^2" },
    { name: "Giới hạn", latex: "\\lim_{x \\to 0} \\frac{\\sin x}{x}" },
    {
      name: "Ma trận",
      latex: "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}",
    },
    { name: "Hàm số mũ", latex: "e^{x}" },
  ],
  VậtLý: [
    { name: "Định luật Ohm", latex: "U = I \\cdot R" },
    { name: "Công suất điện", latex: "P = U \\cdot I" },
    { name: "Động năng", latex: "E_k = \\frac{1}{2}mv^2" },
    { name: "Thế năng", latex: "E_p = mgh" },
    { name: "Công cơ học", latex: "A = F \\cdot s \\cdot \\cos\\theta" },
    { name: "Định luật II Newton", latex: "F = ma" },
  ],
  HóaHọc: [
    { name: "Mol", latex: "n = \\frac{m}{M}" },
    { name: "Nồng độ mol", latex: "C_M = \\frac{n}{V}" },
    { name: "Khối lượng chất", latex: "m = n \\cdot M" },
    { name: "Thể tích khí", latex: "V = n \\cdot 22.4" },
    { name: "Phản ứng oxi hóa - khử", latex: "\\ce{2H2 + O2 -> 2H2O}" },
    {
      name: "Cân bằng hóa học",
      latex: "K = \\frac{[C]^c[D]^d}{[A]^a[B]^b}",
    },
  ],
};

interface Props {
  onSelect: (formula: string) => void;
  onClose: () => void;
}

const FormulaModal: React.FC<Props> = ({ onSelect, onClose }) => {
  const [activeSubject, setActiveSubject] =
    useState<keyof typeof formulaTemplatesBySubject>("Toán");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFormulas = formulaTemplatesBySubject[activeSubject].filter(
    (formula) =>
      formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formula.latex.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg max-h-[80vh] overflow-hidden">
        <div className="flex justify-between mb-4 items-center">
          <h2 className="text-lg font-semibold">Chọn công thức mẫu</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          {Object.keys(formulaTemplatesBySubject).map((subject) => (
            <button
              key={subject}
              onClick={() =>
                setActiveSubject(
                  subject as keyof typeof formulaTemplatesBySubject
                )
              }
              className={`px-3 py-1 rounded ${
                activeSubject === subject
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Tìm kiếm công thức..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[400px] pr-1">
          {filteredFormulas.length > 0 ? (
            filteredFormulas.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(`$${item.latex}$`)}
                className="text-left p-2 border rounded hover:bg-blue-50"
              >
                <div className="font-medium">{item.name}</div>
                <div
                  className="text-gray-600 mt-1"
                  dangerouslySetInnerHTML={{
                    __html: katex.renderToString(item.latex, {
                      throwOnError: false,
                    }),
                  }}
                />
              </button>
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-500">
              Không tìm thấy công thức phù hợp.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormulaModal;
