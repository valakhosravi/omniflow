"use client";

import { Badge, Skeleton, useDisclosure } from "@/ui/NextUi";
import Login from "./Login";
import UserDropDown from "./UserDropDown";
import CoServicesDropDown from "./CoServicesDropDown";
import MegaMenuDrawer from "./MegaMenuDrawer";
import NotificationDropdown from "./NotificationDropdown";
import Link from "next/link";
import CustomButton from "@/ui/Button";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useState } from "react";
import { useGetUnreadQuery } from "@/packages/features/task-inbox/api/ReadApi";

export default function Header() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { user, isLoading } = useAuth();
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(
    null
  );
  const { data: unReadTasks } = useGetUnreadQuery(undefined, {
    skip: !user,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const handleTaskInboxClick = () => {
    setRedirectAfterLogin("/task-inbox");
    onOpen();
  };

  return (
    <>
      {isLoading ? (
        <div className="flex self-start items-center gap-x-[48px]">
          <Skeleton className="h-[48px] w-[144px] rounded-[8px]" />
          <Skeleton className="h-[46px] w-[46px] rounded-[8px]" />
          <Skeleton className="h-[44px] w-[77px] rounded-[8px]" />
        </div>
      ) : (
        <div className="flex self-start items-center gap-x-[48px]">
          {!user ? (
            <CustomButton
              buttonSize="md"
              buttonVariant="primary"
              onPress={onOpen}
              data-cy="open-login-modal"
            >
              ورود به سامانه
            </CustomButton>
          ) : (
            <div className="flex items-center justify-between w-full gap-x-[24px]">
              <UserDropDown />
              <NotificationDropdown />
              <MegaMenuDrawer />
            </div>
          )}
          <CoServicesDropDown />
          {user ? (
            <Link
              href={`/task-inbox`}
              className="text-primary-950 font-medium text-[12px] leading-[18px]
        hover:bg-primary-950/[3%] hover:text-primary-950 border border-transparent hover:border-primary-950/[25%]
        focus:bg-primary-950/[8%] focus:text-primary-950 p-3 rounded-[12px]
        disabled:border-secondary-0 disabled:text-secondary-300 disabled:bg-secondary-0
        !cursor-pointer shrink-0"
            >
              <Badge
                content={
                  unReadTasks?.Data?.length && unReadTasks.Data.length > 0
                    ? unReadTasks.Data.length
                    : ""
                }
                color="default"
                placement="top-left"
                size="sm"
                isInvisible={(unReadTasks?.Data?.length ?? 0) === 0}
                classNames={{
                  badge:
                    "min-w-[18px] h-[18px] text-[10px] top-[-1px] left-[-1px] bg-trash text-white flex items-center justify-center",
                }}
              >
                کارتابل من
              </Badge>
            </Link>
          ) : (
            <span
              onClick={handleTaskInboxClick}
              className="text-primary-950 font-medium text-[12px] leading-[18px]
        hover:bg-primary-950/[3%] hover:text-primary-950 border border-transparent hover:border-primary-950/[25%]
        focus:bg-primary-950/[8%] focus:text-primary-950 p-3 rounded-[12px]
        disabled:border-secondary-0 disabled:text-secondary-300 disabled:bg-secondary-0
        !cursor-pointer shrink-0"
            >
              کارتابل من
            </span>
          )}
          {isOpen && (
            <Login
              onClose={onClose}
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              redirectPath={redirectAfterLogin}
            />
          )}
        </div>
      )}
    </>
  );
}
