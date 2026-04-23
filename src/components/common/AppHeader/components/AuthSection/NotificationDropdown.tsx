"use client";

import { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Badge,
  useDisclosure,
} from "@/ui/NextUi";
import CustomButton from "@/ui/Button";
import { Notification } from "iconsax-reactjs";
import { useGetAllUserNotificationQuery } from "@/features/notification/notification.services";
import NotificationDetailModal from "@/features/notification/components/NotificationDetailModal";
import {
  formatJalaliDateTime,
  toDurationFromNow,
} from "@/packages/features/task-inbox/utils/toDurationFromNow";
import Link from "next/link";
interface Notification {
  id: string;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationDropdown() {
  const { data: unReadNotifications } = useGetAllUserNotificationQuery(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleNotificationClick = (notificationId: number) => {
    const notification = unReadNotifications?.Data?.find(
      (n) => n.NotificationId === notificationId,
    );

    if (notification) {
      setSelectedNotification(notification);
      onOpen();
    }
  };

  const unreadCount = unReadNotifications?.Data?.length ?? 0;

  return (
    <>
      <Dropdown
        placement="bottom-end"
        className="rounded-[12px] shadow-[(-8px_8px_40px_0px_#959DA51F)] p-0 min-w-[320px] w-[320px]"
      >
        <DropdownTrigger className="transition-none !opacity-100">
          <button
            className="relative cursor-pointer rounded-[12px] w-[48px] h-[48px] bg-white
           hover:bg-secondary-50 transition-all
          flex items-center justify-center shrink-0"
            aria-label="اعلان‌ها"
          >
            <Badge
              content={unreadCount > 0 ? unreadCount : ""}
              color="default"
              placement="top-left"
              size="sm"
              isInvisible={unreadCount === 0}
              classNames={{
                badge:
                  "min-w-[18px] h-[18px] text-[10px] top-[0px] left-[0px] bg-trash text-white flex items-center justify-center",
              }}
            >
              <Notification className="size-[20px] text-primary-950" />
            </Badge>
          </button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Notification Menu"
          className="p-0 max-h-[500px] overflow-y-auto"
          variant="flat"
        >
          <DropdownItem
            key="header"
            isReadOnly
            className="hover:!bg-transparent cursor-default p-4 pb-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[14px] text-secondary-950">
                اعلان‌ها
              </h3>
              {unReadNotifications?.Data &&
                unReadNotifications?.Data.length > 0 && (
                  <span className="text-[12px] text-secondary-500">
                    {unReadNotifications?.Data.length} خوانده نشده
                  </span>
                )}
            </div>
          </DropdownItem>

          {unReadNotifications?.Data && unReadNotifications?.Data.length > 0 ? (
            <>
              {unReadNotifications?.Data.slice(0, 3).map((notification) => (
                <DropdownItem
                  key={notification.NotificationId}
                  onClick={() =>
                    handleNotificationClick(notification.NotificationId)
                  }
                  className="hover:!bg-primary-950/[3%] p-4"
                >
                  <div
                    className={`flex flex-col gap-1 ${
                      !notification.IsRead ? "font-semibold" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`text-[13px] ${
                          !notification.IsRead
                            ? "text-secondary-950"
                            : "text-secondary-700"
                        }`}
                      >
                        {notification.Title}
                      </span>
                      {!notification.IsRead && (
                        <span className="w-2 h-2 bg-accent-500 rounded-full shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[12px] text-secondary-500 font-normal line-clamp-2">
                      {notification.Description}
                    </p>
                    <div className="text-[11px] text-secondary-400 font-normal">
                      <span>{toDurationFromNow(notification.CreatedDate)}</span>
                      <span>
                        {" "}
                        ({formatJalaliDateTime(notification.CreatedDate)})
                      </span>
                    </div>
                  </div>
                </DropdownItem>
              ))}

              <DropdownItem
                key="view-all"
                isReadOnly
                className="hover:!bg-transparent cursor-default p-3"
              >
                <Link href="/notifications">
                  <CustomButton
                    buttonSize="sm"
                    buttonVariant="primary"
                    className="w-full text-primary-950 font-semibold text-[13px]"
                  >
                    مشاهده همه اعلان‌ها
                  </CustomButton>
                </Link>
              </DropdownItem>
            </>
          ) : (
            <>
              <DropdownItem
                key="empty"
                isReadOnly
                className="hover:!bg-transparent cursor-default p-8"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Notification
                    name="notification"
                    size={48}
                    className="size-[48px] text-secondary-300"
                  />
                  <p className="text-[13px] text-secondary-300">
                    اعلانی وجود ندارد
                  </p>
                </div>
              </DropdownItem>
              <DropdownItem
                key="view-all"
                isReadOnly
                className="hover:!bg-transparent cursor-default p-3"
              >
                <Link href="/notifications">
                  <CustomButton
                    buttonSize="sm"
                    buttonVariant="primary"
                    className="w-full text-primary-950 font-semibold text-[13px]"
                  >
                    مشاهده همه اعلان‌ها
                  </CustomButton>
                </Link>
              </DropdownItem>
            </>
          )}
        </DropdownMenu>
      </Dropdown>
      <NotificationDetailModal
        isOpen={isOpen}
        onClose={onClose}
        selectedNotification={selectedNotification}
      />
    </>
  );
}
