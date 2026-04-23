"use client";

import Login from "@/features/homePage/components/Login";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useGetUnreadCountQuery } from "@/packages/features/task-inbox/api/ReadApi";
import { Badge, useDisclosure } from "@heroui/react";
import Link from "next/link";

const MyTasksLink = () => {
  const { isAuthenticated } = useAuth();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      onOpen();
    }
  };

  const { data: unReadCount } = useGetUnreadCountQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const isInvisibleBadgeCount = !(
    isAuthenticated && unReadCount?.Data?.UserCount
  );

  return (
    <>
      {" "}
      <Link
        href={isAuthenticated ? "/task-inbox" : "#"}
        onClick={handleClick}
        className="text-primary-950 font-medium text-[12px] leading-[18px]
            hover:bg-primary-950/[3%] hover:text-primary-950 border border-transparent hover:border-primary-950/[25%]
            focus:bg-primary-950/[8%] focus:text-primary-950 p-3 rounded-[12px]
            disabled:border-secondary-0 disabled:text-secondary-300 disabled:bg-secondary-0
            cursor-pointer shrink-0"
      >
        <Badge
          content={unReadCount?.Data?.UserCount}
          color="default"
          placement="top-left"
          size="sm"
          isInvisible={isInvisibleBadgeCount}
          classNames={{
            badge:
              "min-w-[18px] h-[18px] text-[10px] top-[-1px] left-[-1px] bg-trash text-white flex items-center justify-center",
          }}
        >
          کارتابل من
        </Badge>
      </Link>
      <Login isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
    </>
  );
};

export default MyTasksLink;
