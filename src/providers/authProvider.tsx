"use client";

import { User } from "@/models";
import { getUserProfile } from "@/services";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  setUpdate: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [update, setUpdate] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        // router.replace("/login");
        return;
      }

      try {
        const decoded: User = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
          toast.warn("Token đã hết hạn, chuyển hướng đến đăng nhập.");
          localStorage.removeItem("token");
          setUser(null);
          router.replace("/login");
          return;
        }

        // Lấy thông tin người dùng từ API
        const newData = await getUserProfile();
        setUser({ ...decoded, ...newData.data }); // Cập nhật đúng
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        localStorage.removeItem("token");
        setUser(null);
        router.replace("/login");
      }
    };

    checkToken();

    // Lắng nghe thay đổi trong localStorage (khi token thay đổi)
    const handleStorageChange = () => {
      checkToken();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router, update]);
  useEffect(() => {
    if (user?.user?.status === 1) {
      toast.warn("Tài khoản của bạn đã bị khóa, vui lòng liên hệ admin.");
      localStorage.removeItem("token");
      setUser(null);
      router.replace("/login");
      return;
    }
  }, [user, router, update]);
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ setUpdate, user, setUser, logout }}>
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
