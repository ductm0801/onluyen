"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

interface ExamLeaveContextType {
  setExamId: (id: string | string[] | null) => void;
}

const ExamLeaveContext = createContext<ExamLeaveContextType>({
  setExamId: () => {},
});

export const useExamLeave = () => useContext(ExamLeaveContext);

export const ExamLeaveProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const [examId, setExamId] = useState<string | string[] | null>(null);
  const prevPathRef = useRef<string | null>(null);

  const examPath = examId ? `/student/exam/${examId}` : null;
  const router = useRouter();
  const submitExam = () => {
    if (!examId) return;

    const token = localStorage.getItem("token");
    const url = `${process.env.NEXT_PUBLIC_HOST}/api/exam/submitExam/${examId}`;

    console.log("📤 Đang nộp bài...");

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gửi bài thất bại");
        console.log("✅ Đã nộp bài thành công");
      })
      .catch((err) => {
        console.error("❌ Lỗi khi nộp bài:", err);
      });
  };

  useEffect(() => {
    const confirmSubmit = () => {
      const confirmLeave = window.confirm(
        "Bạn có chắc chắn muốn rời khỏi? Bài làm sẽ được nộp."
      );
      if (confirmLeave) {
        submitExam();
      } else {
        router.replace(`/student/exam/${examId}`);
      }
    };

    if (examPath && prevPathRef.current === examPath && pathname !== examPath) {
      confirmSubmit();
    }

    prevPathRef.current = pathname;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pathname === examPath) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && pathname === examPath) {
        const confirmLeave = window.confirm(
          "Bạn sắp rời khỏi trang. Bài sẽ được nộp. Đồng ý?"
        );
        if (confirmLeave) {
          submitExam();
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname, examPath]);

  return (
    <ExamLeaveContext.Provider value={{ setExamId }}>
      {children}
    </ExamLeaveContext.Provider>
  );
};
