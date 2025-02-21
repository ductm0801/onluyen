import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import { Fahkwang } from "next/font/google";
import { LoadingProvider } from "@/providers/loadingProvider";
import { ToastContainer } from "react-toastify";
import DefaultLayout from "@/components/DefaultLayout";
import ProtectedRoute from "@/providers/protectredRoute";
import { AuthProvider } from "@/providers/authProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
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
        <AuthProvider>
          <ProtectedRoute>
            <LoadingProvider>
              <ToastContainer />

              <DefaultLayout>{children}</DefaultLayout>
            </LoadingProvider>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
