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

    const allowedPaths = menus[user.Role as keyof typeof menus].map(
      (item) => item.path
    );
    if (!allowedPaths.includes(pathname)) {
      const redirectPath =
        menus[user.Role as keyof typeof menus][0]?.path || "/";
      router.push(redirectPath);
    }
  }, [user, pathname]);

  return <>{children}</>;
};

export default ProtectedRoute;
