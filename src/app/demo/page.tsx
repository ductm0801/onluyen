"use client";

import React, { useRef, useState, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import "katex/contrib/mhchem";
import FormulaModal from "@/components/FormulaModal";

export default function MathEditor() {
  const inputRef = useRef<HTMLDivElement>(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  const handleInput = () => {
    const text = inputRef.current?.innerText || "";
    const rendered = text.replace(/\$(.*?)\$/g, (_, formula) => {
      try {
        return katex.renderToString(formula, {
          throwOnError: false,
        });
      } catch {
        return `${formula}`;
      }
    });
    setHtmlContent(rendered);
  };

  // Ghi lại vị trí con trỏ
  const handleSaveRange = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0));
    }
  };

  const insertFormula = (formula: string) => {
    const selection = window.getSelection();

    if (inputRef.current && savedRange) {
      // Đặt lại selection về vị trí cũ
      selection?.removeAllRanges();
      selection?.addRange(savedRange);

      const span = document.createElement("span");
      span.textContent = `${formula}`;

      savedRange.deleteContents(); // Xoá đoạn được bôi đen (nếu có)
      savedRange.insertNode(span);

      // Tạo khoảng trắng sau công thức và đặt lại con trỏ
      const space = document.createTextNode(" ");
      span.parentNode?.insertBefore(space, span.nextSibling);

      const newRange = document.createRange();
      newRange.setStartAfter(space);
      newRange.collapse(true);

      selection?.removeAllRanges();
      selection?.addRange(newRange);
      setSavedRange(newRange);
    }

    handleInput(); // cập nhật lại xem trước
    setShowModal(false);
  };

  useEffect(() => {
    handleInput(); // Lần đầu khởi tạo xem trước
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-2">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          ➕ Chèn công thức mẫu
        </button>
      </div>

      <div
        ref={inputRef}
        contentEditable
        onInput={handleInput}
        onKeyUp={handleSaveRange}
        onMouseUp={handleSaveRange}
        className="p-3 border border-gray-300 rounded mb-4 min-h-[100px] focus:outline-none whitespace-pre-wrap"
        suppressContentEditableWarning
      />

      <div className="p-3 border rounded bg-gray-100">
        <h3 className="font-semibold mb-2">Xem trước:</h3>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>

      {showModal && (
        <FormulaModal
          onSelect={insertFormula}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
