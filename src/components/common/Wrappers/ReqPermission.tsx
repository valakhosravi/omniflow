"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useTaskInvolvementCheckerQuery } from "@/packages/features/task-inbox/api/RequestApi";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AppPermissionLoading } from "@/components/common/AppPermissionLoading";

export default function ReqPermission({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userDetail } = useAuth();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestId = params?.requestId || searchParams?.get("requestId");
  const { data, isLoading: permissionIsLoading } =
    useTaskInvolvementCheckerQuery(String(requestId), { skip: !requestId });
  const hasPermission = data?.Data;

  const [allowed, setAllowed] = useState<boolean | null>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    if (!userDetail || permissionIsLoading) {
      return;
    }
    if (calledRef.current) return;

    calledRef.current = true;
    const checkPermission = () => {
      try {
        if (!userDetail || userDetail === null) return;

        if (!hasPermission) {
          setAllowed(false);
          router.replace("/no-access");
        } else {
          setAllowed(true);
        }
      } catch (err) {
        console.error(err);
        setAllowed(false);
        router.replace("/no-access");
      }
    };
    checkPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetail, permissionIsLoading]);

  if (allowed === null) {
    return <AppPermissionLoading />;
  }

  if (!allowed) return null;
  return <>{children}</>;
}
