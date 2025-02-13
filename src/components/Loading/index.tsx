import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
      <div className="bg-blue-500 rounded-full aspect-square w-[80px] animate-shimmer" />
    </div>
  );
};

export default Loading;
