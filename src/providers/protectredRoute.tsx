"use client";
import { useEffect } from "react";
import { useAuth } from "./authProvider";
import { menus } from "@/constants/menu";
import { usePathname, useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      return;
    }

    // Các role cần kiểm tra
    const rolePaths = ["/admin", "/student", "/instructor"];

    // Lấy phần đầu tiên của đường dẫn (bỏ ID nếu có)
    const basePath = `/${pathname.split("/")[1]}`;

    // Kiểm tra nếu basePath nằm trong rolePaths
    const shouldCheck = rolePaths.includes(basePath);

    if (shouldCheck) {
      const allowedPaths = menus[user.Role as keyof typeof menus].map(
        (item) => item.path
      );

      // Kiểm tra quyền với cả pathname và pathname có id động
      const isAllowed = allowedPaths.some((path) => pathname.startsWith(path));

      if (!isAllowed) {
        const redirectPath =
          menus[user.Role as keyof typeof menus][0]?.path || "/";
        router.push(redirectPath);
      }
    }
  }, [user, pathname]);

  return <>{children}</>;
};

export default ProtectedRoute;
