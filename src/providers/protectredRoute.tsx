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

    // Chỉ kiểm tra quyền nếu pathname bắt đầu bằng role
    const rolePaths = ["/admin", "/student", "/instructor"];
    const shouldCheck = rolePaths.some((role) => pathname.startsWith(role));

    if (shouldCheck) {
      const allowedPaths = menus[user.Role as keyof typeof menus].map(
        (item) => item.path
      );

      if (!allowedPaths.includes(pathname)) {
        const redirectPath =
          menus[user.Role as keyof typeof menus][0]?.path || "/";
        router.push(redirectPath);
      }
    }
  }, [user, pathname]);

  return <>{children}</>;
};

export default ProtectedRoute;
