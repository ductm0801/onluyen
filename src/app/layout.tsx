import type { Metadata } from "next";

import "./globals.css";
import Nav from "@/components/Nav";
import { Fahkwang } from "next/font/google";
import { LoadingProvider } from "@/providers/loadingProvider";
import { ToastContainer } from "react-toastify";
import DefaultLayout from "@/components/DefaultLayout";
import ProtectedRoute from "@/providers/protectredRoute";
import { AuthProvider } from "@/providers/authProvider";
import { ThemeProvider } from "@/providers/themeProvider";
import { ExamLeaveProvider } from "@/providers/examProvider";

const fahwang = Fahkwang({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fahkwang",
});

export const metadata: Metadata = {
  title: "Ôn Luyện",
  description:
    "Ôn luyện là ứng dụng học tập trực tuyến dành cho học sinh sắp thi THPT Quốc Gia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fahwang.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <ProtectedRoute>
              <LoadingProvider>
                <ExamLeaveProvider>
                  <ToastContainer />

                  <DefaultLayout>{children}</DefaultLayout>
                </ExamLeaveProvider>
              </LoadingProvider>
            </ProtectedRoute>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
