import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

declare global {
  interface Window {
    MathJax: any;
  }
}

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],

    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    [{ color: [] }],
    ["image", "formula"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const MathEditor = () => {
  const [value, setValue] = useState("");

  return (
    <div className="w-full">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        formats={[
          "bold",
          "italic",
          "underline",
          "list",
          "indent",
          "direction",
          "align",
          "image",
          "formula",
        ]}
      />
    </div>
  );
};

export default MathEditor;
