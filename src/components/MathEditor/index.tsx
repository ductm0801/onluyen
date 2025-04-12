"use client";

import React, { useRef, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import "katex/contrib/mhchem";
import FormulaModal from "@/components/FormulaModal";

interface MathEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const MathEditor: React.FC<MathEditorProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const handleInput = () => {
    const text = inputRef.current?.innerText || "";
    onChange?.(text);
    renderPreview(text);
  };

  const renderPreview = (text: string) => {
    // Replace $...$ with rendered formula
    let rendered = text.replace(/\$(.*?)\$/g, (_, formula) => {
      try {
        return katex.renderToString(formula, { throwOnError: false });
      } catch {
        return formula;
      }
    });

    // Replace newline with <br>
    rendered = rendered.replace(/\n/g, "<br>");

    if (previewRef.current) {
      previewRef.current.innerHTML = rendered;
    }
  };

  const handleSaveRange = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedRangeRef.current = selection.getRangeAt(0);
    }
  };

  const insertFormula = (formula: string) => {
    const selection = window.getSelection();

    if (inputRef.current && savedRangeRef.current) {
      selection?.removeAllRanges();
      selection?.addRange(savedRangeRef.current);

      const span = document.createElement("span");
      span.textContent = formula;

      savedRangeRef.current.deleteContents();
      savedRangeRef.current.insertNode(span);

      const space = document.createTextNode(" ");
      span.parentNode?.insertBefore(space, span.nextSibling);

      const newRange = document.createRange();
      newRange.setStartAfter(space);
      newRange.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(newRange);
      savedRangeRef.current = newRange;
    }

    handleInput(); // cập nhật lại cho Form và preview
    setShowModal(false);
  };

  const [showModal, setShowModal] = React.useState(false);

  // Set nội dung contentEditable khi value thay đổi từ bên ngoài
  useEffect(() => {
    if (inputRef.current && inputRef.current.innerText !== value) {
      inputRef.current.innerText = value || "";
      renderPreview(value || "");
    }
    console.log(value);
  }, [value]);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <button
          type="button"
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
        <div ref={previewRef} />
      </div>

      {showModal && (
        <FormulaModal
          onSelect={insertFormula}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default MathEditor;
