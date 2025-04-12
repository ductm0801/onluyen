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
  const resultPath = examId ? `/student/exam/result/${examId}` : null;
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
    if (pathname === resultPath) {
      return;
    }
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
  }, [pathname, examPath]);

  return (
    <ExamLeaveContext.Provider value={{ setExamId }}>
      {children}
    </ExamLeaveContext.Provider>
  );
};
