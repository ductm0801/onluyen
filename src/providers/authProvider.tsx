"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  UserId: string;
  UserName: string;
  Role: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const decoded: User = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
          console.warn("Token đã hết hạn, chuyển hướng đến đăng nhập.");
          localStorage.removeItem("token");
          setUser(null);
          router.replace("/login");
        } else {
          setUser(decoded);
        }
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        localStorage.removeItem("token");
        setUser(null);
        router.replace("/login");
      }
    };

    checkToken();

    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
