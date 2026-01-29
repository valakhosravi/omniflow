"use client";

import { useEffect } from "react";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/ui/Loading";

export default function LogoutPage() {
  const { logout, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  useEffect(() => {
    logout();
  }, [logout]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loading />
          <p className="text-gray-600">در حال خروج...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">
          {message === "token_expired"
            ? "توکن شما منقضی شده است لطفا مجددا وارد شوید"
            : "در حال انتقال به صفحه اصلی..."}
        </p>
      </div>
    </div>
  );
}
