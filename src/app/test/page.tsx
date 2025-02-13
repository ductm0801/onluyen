"use client";
import { IMAGES } from "@/constants/images";
import React, { useEffect, useState, useRef } from "react";

const Test = () => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isYes, setIsYes] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial position within the screen
    setPosition({ top: 200, left: 200 });
  }, []);

  const moveButton = () => {
    if (!buttonRef.current) return;
    setIsMoving(true);
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const minDistance = 150; // Minimum movement distance
    const maxDistance = 300; // Maximum movement distance

    let newLeft, newTop;
    let attempts = 0;

    do {
      const deltaX =
        (Math.random() * (maxDistance - minDistance) + minDistance) *
        (Math.random() < 0.5 ? -1 : 1);
      const deltaY =
        (Math.random() * (maxDistance - minDistance) + minDistance) *
        (Math.random() < 0.5 ? -1 : 1);

      newLeft = position.left + deltaX;
      newTop = position.top + deltaY;

      // Ensure the button stays within screen boundaries
      const buttonWidth = buttonRect.width;
      const buttonHeight = buttonRect.height;

      const withinXBounds =
        newLeft >= 20 && newLeft + buttonWidth <= screenWidth - 20;
      const withinYBounds =
        newTop >= 20 && newTop + buttonHeight <= screenHeight - 20;

      if (withinXBounds && withinYBounds) break;

      attempts++;
    } while (attempts < 10); // Prevent infinite loops in edge cases

    setPosition({ left: newLeft, top: newTop });
  };

  return (
    <div className="bg-pink-300 w-screen h-screen flex items-center justify-center relative">
      {isYes ? (
        <div className="flex flex-col items-center gap-4">
          <img src={IMAGES.hugDuck} alt="hug" />
          <p className="text-white text-3xl">Bít ngayyyy!!!!</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <img src={IMAGES.cuteDuck} alt="duck" />
          <p className="text-white text-3xl">
            Bé Đủ có đồng ý đi chơi 14/2 zới anh hongggg???
          </p>
          <div className="flex gap-4">
            <div
              className="bg-green-500 rounded-lg px-8 py-4 text-white cursor-pointer"
              onClick={() => setIsYes(true)}
            >
              CÓ
            </div>
            <div
              ref={buttonRef}
              className={`bg-red-500 rounded-lg px-8 py-4 text-white cursor-pointer ${
                isMoving ? "absolute" : ""
              }  transition-all duration-300`}
              style={{ left: `${position.left}px`, top: `${position.top}px` }}
              onMouseEnter={moveButton}
            >
              KHÔNG
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;
