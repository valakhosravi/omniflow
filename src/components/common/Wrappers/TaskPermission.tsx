"use client";

import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useVerifyTaskPermissionMutation } from "@/packages/features/task-inbox/api/RequestApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { AppPermissionLoading } from "@/components/common/AppPermissionLoading";

export default function TaskPermission({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userDetail } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams?.get("taskId");

  const [verifyTaskPermission, { isLoading: permissionLoading }] =
    useVerifyTaskPermissionMutation();

  const [allowed, setAllowed] = useState<boolean | null>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    if (!taskId || !userDetail || permissionLoading) {
      return;
    }
    if (calledRef.current) return;

    calledRef.current = true;
    const checkPermission = async () => {
      try {
        if (!userDetail || userDetail === null || !taskId) return;
        const res = await verifyTaskPermission({
          Groups: userDetail.UserDetail.GroupKeys,
          PersonnelId: String(userDetail.UserDetail.PersonnelId),
          TaskId: taskId,
        });
        if ("error" in res) {
          const err = res.error;
          if (err && "data" in err && (err.data as any).ResponseCode === 103) {
            setAllowed(false);
            router.replace("/no-access");
          }
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
  }, [taskId, userDetail, permissionLoading]);
  if (allowed === null) {
    return <AppPermissionLoading />;
  }

  if (!allowed) return null;
  return <>{children}</>;
}
