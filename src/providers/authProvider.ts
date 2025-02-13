"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface User {
  UserId: string;
  UserName: string;
  Role: string;
  exp: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: User = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
          console.warn("Token đã hết hạn, chuyển hướng đến đăng nhập.");
          localStorage.removeItem("token");
          setUser(null);
          router.push("/login");

          return;
        }

        setUser(decoded);
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        localStorage.removeItem("token");
        setUser(null);
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]); // Thêm navigate nếu dùng React Router

  return { user };
};
