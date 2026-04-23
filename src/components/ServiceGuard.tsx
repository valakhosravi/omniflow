"use client";

import { useAuth } from "@/packages/auth/hooks/useAuth";
import Loading from "@/ui/Loading";
import { routeAccessMap } from "@/utils/routeAccessMap";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const getRequiredServices = (pathname: string): number[] | null => {
  const sortedPaths = Object.keys(routeAccessMap).sort(
    (a, b) => b.length - a.length
  );

  for (const path of sortedPaths) {
    if (pathname.startsWith(path)) {
      return routeAccessMap[path];
    }
  }
  return null;
};

export default function ServiceGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userDetail, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const requiredServices = getRequiredServices(pathname as string);
      if (!requiredServices) return;

      const userServices = userDetail?.ServiceIds || [];
      const hasAccess = requiredServices.some((id) =>
        userServices.includes(id)
      );

      if (!hasAccess) {
        router.replace("/unauthorized");
      }
    }
  }, [pathname, userDetail, isLoading, router]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );

  return <>{children}</>;
}
